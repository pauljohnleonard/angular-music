import { Ticker } from "./ticker"
import { Pulse } from "./pulse"
import { SamplesService } from "./samples.service"
import { SamplePlayer, Sample } from "./sample"

declare var audioContext: any

const TOL = 0.0001



class DrumLoop {

        samplePlayer: SamplePlayer


 
}


export class DrumPlayer implements Ticker, Instrument {
  
 
    static _samples: Array<any> = []
    name = "kit"

    samples: Array<SamplePlayer> = []
    type = "DrumPlayer"
  //  active = false
    names: Array<string> = []
    muted: boolean;

    constructor(public pulse: Pulse, samplesService: SamplesService, public monitor: any) {

        this.pulse.addClient(this)
        
       
        this.samples[0] = new SamplePlayer(new Sample(DrumPlayer._samples["Clave"], samplesService))
        this.samples[1] = new SamplePlayer(new Sample(DrumPlayer._samples["Taktell"], samplesService))
        this.samples[2] = new SamplePlayer(new Sample(DrumPlayer._samples["DanBeat"], samplesService))
    }


    start() {

    }

    stop() {

    }


    tick() {

        // console.log(this.pulse.time  + " " + audioContext.currentTime)

        if (this.muted) return

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

    mute(yes: boolean) {
        this.muted = yes;
    }
    addPostItems(items: any, saver: any): void {
        console.log(" DO NOTHING ")
    }
}


DrumPlayer._samples["Clave"] = "assets/sounds/metro/christeck/Metronom Claves.wav"
DrumPlayer._samples["Taktell"] = "assets/sounds/metro/christeck/Metronom Taktell Junior.wav"
DrumPlayer._samples["DanBar"] = "assets/sounds/metro/dan/metro_bar.wav"
DrumPlayer._samples["DanBeat"] = "assets/sounds/metro/dan/metro_beat.wav"
DrumPlayer._samples["FrankBar"] = "assets/sounds/metro/frank/metro_1.wav"
DrumPlayer._samples["FrankBeat"] = "assets/sounds/metro/frank/metro_other.wav"

