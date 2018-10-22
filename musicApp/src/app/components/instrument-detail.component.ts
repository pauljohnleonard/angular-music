
import { map, startWith } from 'rxjs/operators';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SFService } from '../services/sf.service'
import { SFInstrument } from '../../music/sfinstrument'
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material'

// import 'rxjs/add/operator/startWith';

@Component({
    moduleId: "app/music/",
    selector: "instrument-detail",
    templateUrl: "instrument-detail.html"

})


export class InstrumentDetailComponent implements OnInit{
    @Input() inst: SFInstrument;
    @ViewChild(MatAutocompleteTrigger) auto: MatAutocomplete

    nameCtrl: FormControl;
    name: string
    filteredNames: any;
    displayName: string
    val: string

    constructor(private sfService: SFService) {
        this.nameCtrl = new FormControl();
        this.filteredNames = this.nameCtrl.valueChanges.pipe(
            startWith(null),
            map(name => this.filterNames(name)), );

    //    console.log(name)
        this.nameCtrl.valueChanges.subscribe((val) => {

            console.log(val)

            if (this.sfService.names.indexOf(val) >= 0) {
                this.inst.setInst(val)
            }
        })
    }


    ngOnInit() {
        this.nameCtrl.setValue(this.inst.name)
    }

    filterNames(val: string) {
        return val ? this.sfService.names.filter((s) => new RegExp(val, 'gi').test(s)) : this.sfService.names;
    }


}


