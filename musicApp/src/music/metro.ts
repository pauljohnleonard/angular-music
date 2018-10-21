import { Ticker } from "./ticker"
import { Pulse } from "./pulse"
import { SamplesService } from "./samples.service"
import { SamplePlayer } from "./sample"

declare var audioContext: any

const TOL = 0.0001


export class Metro implements Ticker {
 
    static _samples: Array<any> = []

    samples: Array<SamplePlayer> = []
    type = "Metro"
    active = false
    names: Array<string> = []

    constructor(public pulse: Pulse, samplesService: SamplesService, public monitor: any) {

        this.pulse.addClient(this)
     
        samplesService.samplePlayer(Metro._samples["Clave"]).then(sp => this.samples[0] = sp);
        samplesService.samplePlayer(Metro._samples["Taktell"]).then(sp => this.samples[1] = sp);
        samplesService.samplePlayer(Metro._samples["DanBeat"]).then(sp => this.samples[2] = sp);
         
        // this.samples[0] = new SamplePlayer(new Sample(, )
        // this.samples[1] = new SamplePlayer(new Sample(Metro._samples["Taktell"], samplesService))
        // this.samples[2] = new SamplePlayer(new Sample(Metro._samples["DanBeat"], samplesService))
    }


    start() {

    }

    stop() {

    }


    tick() {

        // console.log(this.pulse.time  + " " + audioContext.currentTime)

        if (!this.active) return

        // console.log(this.pulse.beat)
        const pulseNow: number = Math.floor(this.pulse.beat * this.pulse.pulsesPerBeat + TOL);

        const fract = this.pulse.beat * this.pulse.pulsesPerBeat - pulseNow

        if (Math.abs(fract) > 2 * TOL) return


        // tslint:disable-next-line:no-bitwise
        const index = (pulseNow % this.pulse.patternLength) | 0

        const ii = this.pulse.accents[index]

        const sample = this.samples[ii]

        if (sample !== undefined) sample.play(this.pulse.time)

        if (this.monitor) this.monitor.spareTime(this.pulse.time - audioContext.currentTime)


    }

    addPostItems(items: any, saver: any): void {
        console.log(" DO NOTHING ")
    }
}


Metro._samples["Clave"] = "assets/sounds/metro/christeck/Metronom Claves.wav"
Metro._samples["Taktell"] = "assets/sounds/metro/christeck/Metronom Taktell Junior.wav"
Metro._samples["DanBar"] = "assets/sounds/metro/dan/metro_bar.wav"
Metro._samples["DanBeat"] = "assets/sounds/metro/dan/metro_beat.wav"
Metro._samples["FrankBar"] = "assets/sounds/metro/frank/metro_1.wav"
Metro._samples["FrankBeat"] = "assets/sounds/metro/frank/metro_other.wav"

