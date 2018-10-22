
import { Injectable } from '@angular/core';
import { SamplePlayer } from './sample';

declare var audioContext: any



@Injectable()
export class SamplesService {

    //    samples: Array<any> = []
    static cache = {}


    constructor() {

    }


    load(url: string): Promise<AudioBuffer> {
        // Load asynchronously

        const p = new Promise<AudioBuffer>((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open("GET", url, true);

            request.responseType = "arraybuffer";


            request.onload = function () {
                audioContext.decodeAudioData(request.response, (buffer: AudioBuffer) => {
                    resolve(buffer)
                })
            }

            request.send();
        })
        return p;
    }

    samplePlayer(name): Promise<SamplePlayer> {


        return new Promise<SamplePlayer>((resolve, reject) => {
            const  buff = SamplesService.cache[name];
            if (buff) {
                resolve(new SamplePlayer(buff));
            } else {
                this.load(name).then((buffnew: any) => {
                    SamplesService.cache[name] = buffnew;
                    resolve(new SamplePlayer(buffnew));
                })
            }
        });
    }
}




