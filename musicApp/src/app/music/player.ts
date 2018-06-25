import { SFInstrument } from '../../music/sfinstrument'
import { Ticker } from '../../music/ticker'
import { Music } from '../../app/music/music'
import { Savable } from '../../music/savable'
import { MidiSequencer } from './midisequencer'
import { Thing } from '../../music/thing'
import { AI } from './ai'
import { Mapper } from './mapper'



export class Band {
    players: Array<Player> = []


    solo(p: Player) {

        p.soloed = !p.soloed

        if (p.soloed) p.muted = false

        let soloedCnt = 0;

        this.players.forEach((px) => {
            if (px.soloed) soloedCnt++
        })

        if (soloedCnt === 0) {
            this.players.forEach((px) => {
                px.tmpMuted = false
                px.inst.mute(p.muted)
            })
        } else {
            this.players.forEach((px) => {
                if (!px.soloed) {
                    px.tmpMuted = true
                    px.inst.mute(true)
                } else {
                    px.tmpMuted = false
                    px.inst.mute(false)
                }
            })
        }
    }
}


export class Player extends Savable implements Ticker, Thing {

    soloed = false
    tmpMuted = false
    muted = false
    ticker: Ticker = null
    type: string
    viewMe = true
    expanded = true
    inst: Instrument | SFInstrument
    ai: AI = null
    name: string
    recording = false
    mapper: Mapper = null

    constructor(public music: Music, public band: Band) {
        super()
        band.players.push(this)
        this.music.pulse.addClient(this)
    }

    tick() {
        if (this.ticker) this.ticker.tick()
    }

    start() {
        if (this.ticker) this.ticker.start()

    }

    stop() {
        if (this.ticker) this.ticker.stop()
    }

    mute() {
        this.muted = !this.muted
        this.inst.mute(this.muted)
    }

    solo() {
        this.band.solo(this)
    }

    removeMe() {
        setTimeout(() => {
            this.music.removePlayer(this)
        }, 0);
    }


    saveDB(saver: any): any {

        if (this.id !== null) return this.id

        const postItems: any = {}

        if (this.ticker.addPostItems !== undefined) {
            this.ticker.addPostItems(postItems, saver)
        }

        postItems.inst = this.inst.name

        if (this.ai) {
            const id1 = this.ai.saveDB(saver)
            postItems.ai = id1
        }

        const id = saver.newIDItem('players', postItems)
        return id
    }

    addPostItems(items: any, saver: any): void {
        console.log(" DO NOTHING ")
    }
}
