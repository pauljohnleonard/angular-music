import { NgModule } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

// import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AIDetailComponent } from './components/ai-detail.component';
import { PlayerDetailComponent } from './components/player-detail.component';
import { InstrumentDetailComponent } from './components/instrument-detail.component';
import { MusicComponent } from './components/music.component';
import { MusicAppComponent } from './music-app.component';

import { DBService } from './services/db.service';
import { FirebaseDBService } from './services/firebasedb.service';
import { SFService } from './services/sf.service';
import { SettingsService } from '../music/settings.service';
import { NetService } from './services/net.service';
import { SamplesService } from '../music/samples.service';

import { LoadDialog } from './dialogs/load.dialog'
import { MetroDialog } from './dialogs/metro.dialog'
import { MetroSlideComponent } from './components/metro-slide.component';
import { MonitorComponent } from './components/monitor.component'
import { SliderValComponent } from './slider-val.component'
import { LocalStorageModule } from 'angular-2-local-storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatFormFieldModule, MatSelectModule, MatInputModule,
     MatCardModule, MatIconModule, MatButtonModule, MatSidenavModule, MatListModule,
      MatToolbarModule, MatSnackBarModule, MatMenuModule, MatAutocompleteModule, MatTooltipModule } from '@angular/material';
import { DrumkitScoreDetailComponent } from './drumkit-score-detail/drumkit-score-detail.component';


@NgModule({
    imports: [BrowserModule, HttpModule, JsonpModule, FormsModule, ReactiveFormsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatSnackBarModule,
      //  MatPaginatorModule,
      //  MatProgressSpinnerModule,
      //  MatProgressBarModule,
     //   MatCheckboxModule,
     //   MatTabsModule,
        MatInputModule,
        MatCardModule,
        MatIconModule,
        FormsModule,
        MatSelectModule,
        MatListModule,
     //   MatTableModule,
     //   CdkTableModule,
       MatToolbarModule,
        ReactiveFormsModule, // <-- #2 add to @NgModule imports,
     //   MatExpansionModule,
        MatSidenavModule,
        MatFormFieldModule,
    //    MatDatepickerModule,
   //     MatNativeDateModule,
   //     MatSortModule,
        MatDialogModule,
        MatAutocompleteModule,
   //     MatButtonToggleModule,
       MatTooltipModule,
     MatMenuModule,

        LocalStorageModule.withConfig({
            prefix: 'my-app',
            storageType: 'localStorage'
        })
    ],
    declarations: [AppComponent, AIDetailComponent, InstrumentDetailComponent, PlayerDetailComponent,
        MusicComponent, MusicAppComponent, LoadDialog, MetroDialog, MetroSlideComponent, 
        MonitorComponent, SliderValComponent, DrumkitScoreDetailComponent],
    providers: [{ provide: DBService, useClass: FirebaseDBService },
        SFService, SamplesService, NetService, SettingsService],
    bootstrap: [AppComponent],
    entryComponents: [LoadDialog, MetroDialog]
})


export class AppModule { }
