import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DrumPlayer } from 'src/music/drumplayer';

@Component({
    selector: 'app-drumkit-score-detail',
    templateUrl: './drumkit-score-detail.component.html',
    styleUrls: ['./drumkit-score-detail.component.css']
})
export class DrumkitScoreDetailComponent implements OnInit {

    @Input('player') player: DrumPlayer
   
    constructor() { }

    ngOnInit() {
    }


    update() {
        console.log(this.player.scoreText);
        this.player.update();
    }
}
