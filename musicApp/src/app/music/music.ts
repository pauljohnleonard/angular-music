import { DBService } from '../services/db.service'
import { NetService } from '../services/net.service'
import { SamplesService } from '../../music/samples.service'
import { SettingsService } from '../../music/settings.service'
import { AI } from './ai';
import { AISquencer } from './aisequencer';
import { Metro } from '../../music/metro'
import { Mapper, MappedPlayer } from './mapper';
import { SFInstrument } from '../../music/sfinstrument'
import { Pulse } from '../../music/pulse'
import { Player, Band } from "./player"

import { MidiSequencer } from './midisequencer'
import { Savable } from '../../music/savable'
import { Generator } from './generator'
import { Thing } from '../../music/thing'
import { DrumPlayer } from '../../music/drumplayer';


declare var firebase: any

export class Music extends Savable {

    playerType = "AI"
    playerTypes: Array<string> = ["AI", "midi", "kit"]
    things: Array<Thing> = []
    pulse: Pulse


    metro: Metro
    recording = false
    recordBuffer: Array<any> = []
    playHead = 0
    title = "A Song"
    band: Band;

    constructor(private dbService: DBService, private samplesService: SamplesService,
        private netService: NetService, private monitor: any, public settings: SettingsService) {
        super()
        console.log("new music constructed")
        const self = this

        this.band = new Band()
        window.navigator["requestMIDIAccess"]().then(
            (midiAccess: any) => {
                midiAccess.inputs.forEach(function (midiInput: any) {
                    console.log(midiInput)
                    midiInput.onmidimessage = function (event: any) {
                        //  console.log(event.data)

                        if (self.recording && self.pulse.running) {
                            const stamp = self.pulse.getBeatNow()
                            self.recordBuffer.push([stamp, event.data])
                        }

                        self.things.forEach((p) => {
                            if (p instanceof Player) {

                                if (p.recording && p.inst instanceof SFInstrument ) p.inst.playEvent(event.data, 0)
                            }
                        })

                    }
                })
            })

        this.setID('0')
        this.constructorX()
    }


    saveDB(saver: any): any {
        if (this.isSaved()) return
        const itemIDs: Array<any> = []

        let playerPos = 0
        let postItems: any = {
        }



        this.things.forEach((p: Player) => {
            const itemID: string = p.saveDB(saver)
            if (itemID !== null) {
                postItems[itemID] = playerPos++
            }
        })

        this.setID(saver.newIDItem('songs', postItems))

        postItems = {
            title: this.title,
        }

        saver.newIDItem('songinfo/' + saver.user.uid, postItems, this.id)

    }

    loadPlayer(playerSnap: any, pos: number) {

        let instName: string
        switch (playerSnap.child("type").val()) {

            case "MidiSequencer":
            instName = playerSnap.child("inst").val()
            const midiPlayer = this.addMidiPlayer(instName, pos)
            midiPlayer.setID(playerSnap.key)
            const midiKey = playerSnap.child("midi").val()
            if (midiKey !== null) {
                const midiRef = firebase.database().ref("midi").child(midiKey);
                midiRef.once("value").then((midi: any) => {
                    const midiData: any = JSON.parse(midi.val())
                    const seq: MidiSequencer = <MidiSequencer>midiPlayer.ticker
                    seq.setBuffer(midiData, midiKey)
                })
            }
            break


            case "AISequencer":
                instName = playerSnap.child("inst").val()
                const aiKey = playerSnap.child("ai").val()
                const aiRef = firebase.database().ref("ai").child(aiKey);
                aiRef.once("value").then((aiSnap: any) => {

                    const netKey = aiSnap.child("net").val()
                    const netRef = firebase.database().ref("net").child(netKey)
                    netRef.once("value").then((netSnap: any) => {
                        const netInfo = netSnap.val()
                        this.addAIPlayer(instName, netInfo, pos)
                    })
                })
                break;


            case "Pulse":
                this.pulse.loadSnap(playerSnap)

                break

            case "DrumPlayer":
                instName = playerSnap.child("inst").val();
                const player = this.addDrumPlayer(instName, pos);
                player.setID(playerSnap.key);
                const scoreText = playerSnap.child("score").val();
                (player.inst as DrumPlayer).update(JSON.parse(scoreText));
            
                 break

            default:
                console.log("UNKOWN TYPE : " + playerSnap.child("type").val())
        }

    }

    loadDB(songref: any) {
        songref.once("value").then((song: any) => {
            song.forEach((player: any) => {

                const playerref = firebase.database().ref("players").child(player.key);
                playerref.once("value").then((playerSnap: any) => {
                    this.loadPlayer(playerSnap, player.val())

                })
            })
        })
    }

    constructorX() {

        const ticksPerBeat = 12
        const bpm = 120

        this.pulse = new Pulse(ticksPerBeat, bpm, this.settings)
        this.things.push(this.pulse)

        // const majorSeed = [0, 2, 4, 5, 7, 9, 11]
        // const stack3 = [0, 2, 4, 6, 8, 10, 12]

        this.metro = new Metro(this.pulse, this.samplesService, this.monitor)

    }


    addMidiPlayer(name: string, pos: any): Player {
        const player = new Player(this, this.band)
        if (pos === null || pos === true) this.things.push(player)
        else this.things[pos] = player
        const inst = new SFInstrument(name, this.monitor)
        player.inst = inst
        const midiPlayer = new MidiSequencer(player)
        player.ticker = midiPlayer
        this.change()
        return player
    }

    addDrumPlayer(name: string, pos: any): Player {
        const player = new Player(this, this.band)
        if (pos === null || pos === true) this.things.push(player)
        else this.things[pos] = player
       
        // const inst = new Instrument(name, this.monitor)
        // player.inst = inst

        const drumPlayer = new DrumPlayer(this.pulse, this.samplesService , this.monitor)
       
        player.inst = drumPlayer 
        player.ticker = drumPlayer
       
       
        this.change()
        return player
    }


    addAIPlayer(instName: string, net: any, pos: number): Player {

        if (!net) net = {}

        if (net.nOut === undefined) net.nOut = 20
        if (net.nHidden === undefined) net.nHidden = [20]
        if (net.nIn === undefined) net.nIn = this.pulse.rampers.length

        const player = new Player(this, this.band)

        if (pos === null) this.things.push(player)
        else this.things[pos] = player

        const ai = new AI(this.dbService, this.netService)

        player.ai = ai


        if (instName === undefined) instName = "marimba"
        player.name = instName

        const inst = new SFInstrument(instName, this.monitor)
        player.inst = inst


        if (net.seed === undefined) {
            net.seed = Math.random()
        }
        const generator = new Generator(net.seed)

        ai.init(this.pulse, net)

        const base: Array<number> = [0, 3, 5, 7, 10]

        const mapper = new Mapper(40, base)
        player.mapper = mapper

        const mapPlayer = new MappedPlayer(inst, mapper)

        const playerAI = new AISquencer(ai, mapPlayer, this.pulse)
        player.ticker = playerAI
        this.change()   //  TODO not if we are loading
        return player

    }

    removePlayer(player: Player) {

        this.pulse.removeClient(player)
        let index = 0
        for (; index < this.things.length; index++) {
            if (this.things[index] === player) {
                this.things.splice(index, 1);
                this.change()
                if (this.things.length === 0) this.setID('0')
                return;
            }
        }

    }

    tick(): void {

        try {
            this.pulse.tick()
        } catch (err) {
            console.log(err.stack)
        }

        this.playHead = this.pulse.beat
    }

    record(yes: boolean) {
        this.recording = yes
    }

    start() {
        this.pulse.start()
    }

    stop() {
        this.pulse.stop()
        if (this.recordBuffer.length > 0) {
            this.things.forEach((p) => {
                if (p instanceof Player) {
                    if (p.recording && (p.ticker instanceof MidiSequencer)) {
                        p.ticker.setBuffer(this.recordBuffer, null)
                        p.change()
                    }
                }
            })
        }
        this.recordBuffer = []
    }

    pause() {
        this.pulse.pause()
    }

    isRunning(): boolean {
        return this.pulse.running
    }

    /*
     setPlayerType(t:string) {
         this.playerType=t
     }

     /*
     window.navigator.requestMIDIAccess().then(function(midiAccess) {
         midiAccess.inputs.forEach(function(midiInput) {
             self.focusPlayer.listenToMidi(midiInput)
         });
     });
     */

}
