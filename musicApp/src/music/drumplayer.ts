import { Ticker } from "./ticker"
import { Pulse } from "./pulse"
import { SamplesService } from "./samples.service"
import { SamplePlayer } from "./sample"
import { DBService } from "src/app/services/db.service";

declare var audioContext: any

const TOL = 0.0001



const sampleFolder = "assets/sounds/african/"

// tslint:disable-next-line:max-line-length
const hitNames = {
    "djembe": { B: "54018__domingus__djembe-lo-2.wav", S: "54015__domingus__djembe-hi-2.wav", T: "54022__domingus__djembe-mid-2.wav" },
    "kenkeni": { H: "170179__jimmyjames112__kenkeni.wav", M: "170179__jimmyjames112__kenkeni.wav" },
    "sangban": { H: "170177__jimmyjames112__sangban.wav", M: "170178__jimmyjames112__sangban-mute.wav" }
};






export class DrumPlayer implements Ticker, Instrument {
   
    name = "kit"
    samples = {}
    type = "DrumPlayer"
    names: Array<string> = []
    muted: boolean;
    scoreText: String =
        `       |1 . * . 2 . * . 3 . * . 4 . * . |\n` +
        `Djembe |B   s   B   t s B s s s B   s   |\n`

    grid = []
    patternLength = 0;
    lastIndex = -1;
    charSpace = 2;

    constructor(public pulse: Pulse, samplesService: SamplesService, public monitor: any) {

        //  this.pulse.addClient(this)

        this.samples = {}
        Object.keys(hitNames).forEach((drum) => {
            Object.keys(hitNames[drum]).forEach((hitname) => {
                this.samples[drum] = {};
                samplesService.samplePlayer(sampleFolder + hitNames[drum][hitname]).then(
                    (sp) => {
                        this.samples[drum][hitname] = sp;
                        sp.gain = 0.6;
                    }
                );
            })
        })
    }




    start() {
        console.log(" DRUM START ")
        this.lastIndex = -1;
    }

    stop() {

    }

    update(scoreNew?: string) {

        if (scoreNew) {
            this.scoreText = scoreNew
        }
        
        const newGrid = [];

        try {
            const lines = this.scoreText.split("\n");
            let patternLength = 0;
            lines.forEach((line) => {
                const toks = line.split("|")
                const drum = toks[0].trim().toLowerCase();
                if (hitNames[drum]) {
                    const tab = toks[1].toString()
                    const patternLengthX = tab.length / this.charSpace

                    if (patternLength !== 0 && patternLengthX !== patternLength) {
                        throw Error(" all tab must be the same length ")
                    }
                    patternLength = patternLengthX
                    const part = []
                    newGrid.push(part)
                    for (let i = 0; i < patternLengthX; i++) {
                        if (tab[i * this.charSpace] !== ' ') {
                            const hit = tab[i * this.charSpace].toUpperCase();
                            part[i] = this.samples[drum][hit]
                        }
                    }
                }
            });
            this.grid = newGrid
            this.patternLength = patternLength
        } catch (err) {
            console.error(err)
        }
    }


    tick() {

       // console.log(this.pulse.beat + " " + audioContext.currentTime)

        if (this.muted || this.patternLength === 0) return

        // console.log(this.pulse.beat)
        const ptrNow: number = Math.floor(this.pulse.beat * this.pulse.pulsesPerBeat * this.pulse.subDivs[0] + TOL);

    
        // tslint:disable-next-line:no-bitwise
        const index = (ptrNow % this.patternLength) | 0

        if (index === this.lastIndex) return

        this.lastIndex = index;
        console.log(index)
       

        this.grid.forEach((tab) => {

            const sample = tab[index]

            if (sample !== undefined) {
                sample.play(this.pulse.time)
         //       console.log(" sample play ")
            }
        })

        if (this.monitor) this.monitor.spareTime(this.pulse.time - audioContext.currentTime)


    }

    mute(yes: boolean) {
        this.muted = yes;
    }


    // saveDB(saver: DBService): string {
    //     if (this.isSaved()) return this.id


    //     // const postItems =
    //     //     JSON.stringify(this.buff)


    //     // const id = saver.newIDItem('midi', postItems)

    //     // this.setID(id)
    //     // return id
    //     console.log( " KIT saveDB")
    //     return '0' 
    // }

    // addPostItems(items: any, saver: any): void {
    //     throw new Error("Method not implemented.");
    // }


    
    addPostItems(items: any, saver: any): void {
        items.type = this.type
        if (this.scoreText !== null) {
            items.score = JSON.stringify(this.scoreText)
        }
    }
}
