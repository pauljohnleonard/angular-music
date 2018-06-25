import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Metro } from '../../music/metro'
import { SliderValComponent } from '../slider-val.component'


declare var firebase: any


@Component({
    moduleId: 'app/dialogs/',
    selector: 'metro-dialog',
    templateUrl: 'metro.html'
})



export class MetroDialog {

    metro: Metro

    constructor(public dialogRef: MatDialogRef<MetroDialog>) {

    }

    done() {
        this.dialogRef.close("LOADED")
    }

}

