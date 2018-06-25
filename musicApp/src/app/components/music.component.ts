import { Component, Input } from '@angular/core';
import { Music } from '../../app/music/music'

@Component({
    selector: "music-comp",
    template: `
       <mat-card>
            <div style="width: 100%">
         
                    <input mdInput  [(ngModel)]="music.title"/>
         
                <button mat-mini-fab  [matMenuTriggerFor]="menu" style="float:right;">
                      <mat-icon>add</mat-icon>
                 </button><br> 
                 <mat-menu #menu="matMenu" >
                         <button mat-menu-item *ngFor="let t of music.playerTypes" [value]="playerType" (click)="addPlayerType(t)">
                          {{ t }}
                         </button>
                </mat-menu>

                <br><br>
                <div *ngFor="let p of music.things">
                   <player-detail *ngIf="p.viewMe" [player]="p" (playerSelected)="slectedPlayer=p"> </player-detail>
                </div>
               </div>    
       </mat-card>
    `
})


export class MusicComponent {

    @Input() music: Music;

    constructor() {

    }

    addPlayerType(t: string) {

        switch (t) {
            case "AI":
                this.music.addAIPlayer("marimba", null, null)
                break
            case "midi":
                this.music.addMidiPlayer("marimba", null)
                break
            case "kit":
                this.music.addDrumPlayer("kit", null)
                break
        }
    }
} 
