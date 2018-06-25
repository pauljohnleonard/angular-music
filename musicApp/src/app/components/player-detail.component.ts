import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Player } from '../music/player'
import { AIDetailComponent } from './ai-detail.component'
import { InstrumentDetailComponent } from '../components/instrument-detail.component'
import { AI } from '../music/ai'

import { MatCard } from '@angular/material'

@Component({
    moduleId: "app/music/",
    selector: "player-detail",
    templateUrl: "player-detail.html"
})



export class PlayerDetailComponent {
    @ViewChild(MatCard) card: MatCard
    @Input() player: Player;
    @Output() playerSelected = new EventEmitter();

    soloed = false
    muted = false


    constructor() {

    }

    getAI(): AI {
        return this.player.ai

    }

    solo() {
        this.player.solo()
    }

    mute() {
        this.player.mute()
    }

    toggleRecord() {

        const player = this.player
        player.recording = !player.recording;

    }

    removeMe() {
        this.player.removeMe()
    }

}
