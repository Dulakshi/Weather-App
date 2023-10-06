import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {WeatherData} from "../weather-data.model";

@Component({
  selector: 'app-multiple-city-dialog',
  templateUrl: './city-selector-dialog.component.html',
  styleUrls: ['./city-selector-dialog.component.css']
})
export class CitySelectorDialogComponent {
  constructor(public dialogRef: MatDialogRef<CitySelectorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public selectedCities: WeatherData[]) {
  }

  onCitySelected(selectedCityData: WeatherData) {
    this.dialogRef.close(selectedCityData);
  }
}
