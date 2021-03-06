import { Component, Input, OnInit } from '@angular/core';
import { AI } from "../music/ai"
import { Generator } from '../music/generator'
import { SFService } from '../services/sf.service'
import { NetService } from '../services/net.service'

@Component({
    moduleId: "app/music/",
    selector: "ai-detail",
    templateUrl: "./ai-detail.html"

})

export class AIDetailComponent implements OnInit {
    @Input() ai: AI;

    aiName: any = null
    nHidden: Array<number> = []

    constructor(private netService: NetService) {

    }


    ngOnInit() {
        console.log("NGINIT")
        for (const name in this.netService.types) {

            if (name === this.ai.net.netname) {
                this.aiName = name
                console.log("DONE")
            }
        }
        this.nHidden = this.ai.net.nHidden
        //  console.log("HELLO"+this.ai.out)
    }

    implant() {
        this.ai.implant({ type: this.aiName , nHidden: this.nHidden })
    }
}
