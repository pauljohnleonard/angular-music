
import { Injectable } from '@angular/core';
import { SamplePlayer } from './sample';

declare var audioContext: any



@Injectable()
export class SamplesService {

    //    samples: Array<any> = []
    static cache = {}


    constructor() {

    }


    load(url: string): Promise<any> {
        // Load asynchronously

        const p = new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open("GET", url, true);

            request.responseType = "arraybuffer";


            request.onload = function () {
                audioContext.decodeAudioData(request.response, (buffer: any) => {
                    resolve(buffer)
                })
            }

            request.send();
        })
        return p;
    }

    samplePlayer(name): Promise<SamplePlayer> {


        return new Promise<SamplePlayer>((resolve, reject) => {
            let buffer;
            if (SamplesService.cache[name]) {
                buffer = SamplesService.cache[name]
            } else {
                this.load(name).then((buff: any) => {
                    buffer = buff
                    SamplesService.cache[name] = buff;
                    resolve(new SamplePlayer(buff));
                })
            }

        });
    }
}




