import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CitySelectorDialogComponent} from './city-selector-dialog.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";

describe('CitySelectorDialog', () => {
  let component: CitySelectorDialogComponent;
  let fixture: ComponentFixture<CitySelectorDialogComponent>;

  beforeEach(() => {
    const dialogRefMock = {
      close: jasmine.createSpy('close'),
    };

    TestBed.configureTestingModule({
      declarations: [CitySelectorDialogComponent],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefMock},
        {provide: MAT_DIALOG_DATA, useValue: []},
      ],
      imports: [
        MatDialogModule,
      ],
    });
    fixture = TestBed.createComponent(CitySelectorDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
