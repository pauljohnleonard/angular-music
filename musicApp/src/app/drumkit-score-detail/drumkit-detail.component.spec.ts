import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrumkitScoreDetailComponent } from './drumkit-score-detail.component';

describe('KitDetailComponent', () => {
  let component: DrumkitScoreDetailComponent;
  let fixture: ComponentFixture<DrumkitScoreDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrumkitScoreDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrumkitScoreDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
