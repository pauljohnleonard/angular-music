import { SamplesService } from "./samples.service";



declare var audioContext: any



// export class Sample {

//     static cache = {}
//     buffer;

//     constructor(buff,) {
//         if (Sample.cache[file]) {
//             this.buffer = Sample.cache[file]
//         } else {
//             samplesService.load(file).then((buff: any) => {
//                 this.buffer = buff
//                 Sample.cache[file] = buff;
//             })
//         }
//     }
// }

export class SamplePlayer {

    gain: any
    constructor(public buffer: Buffer ) {
        this.gain = audioContext.createGain();
        this.gain.gain.value = 0.1
        this.gain.connect(audioContext.destination);
    }

    play(when: number): void {
        const source: any = audioContext.createBufferSource();
        source.buffer = this.buffer
        source.connect(this.gain);
        source.start(when)
    }

    setGain(val: number): void {
        this.gain.gain.value = val
    }
}




