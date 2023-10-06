import {Component, OnDestroy, OnInit} from '@angular/core';
import {WeatherService} from '../services/weather.service';
import {FormControl} from "@angular/forms";
import {WeatherDataService} from "../services/weather-data.service";
import {MatDialog} from "@angular/material/dialog";
import {CitySelectorDialogComponent} from "../city-selector-dialog/city-selector-dialog.component";
import {Subject, takeUntil} from "rxjs";
import {WeatherData} from "../weather-data.model";


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  city: FormControl = new FormControl('');
  units: FormControl = new FormControl('metric');
  private destroy$ = new Subject<void>();

  constructor(private weatherService: WeatherService, private weatherDataService: WeatherDataService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.initializeWithPersistedData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeWithPersistedData(): void {
    const savedCity = localStorage.getItem('selectedCity');
    const savedUnits = localStorage.getItem('selectedUnits');

    if (savedCity) {
      this.city.setValue(savedCity);
    }

    if (savedUnits) {
      this.units.setValue(savedUnits);
    }
  }

  updateWeatherData(weatherData: WeatherData): void {
    if (weatherData) {
      localStorage.setItem('selectedCity', weatherData.city);
    }

    this.weatherDataService.updateWeatherData(weatherData);
  }

  searchWeather() {
    this.weatherService.getWeather(this.city.getRawValue(), this.units.getRawValue()).pipe(takeUntil(this.destroy$),)
      .subscribe((weatherData: WeatherData[]) => {
        if (weatherData.length > 1) {
          const dialogRef = this.dialog.open(CitySelectorDialogComponent, {
            data: weatherData,
          });

          dialogRef.afterClosed().subscribe((selectedCityData: WeatherData) => {
            if (selectedCityData) {
              this.updateWeatherData(selectedCityData);
            }
          });
        } else {
          this.updateWeatherData(weatherData[0]);
        }
      });
  }
}
