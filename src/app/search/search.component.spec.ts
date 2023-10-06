import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchComponent} from './search.component';
import {WeatherData} from "../weather-data.model";
import {WeatherService} from "../services/weather.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {WeatherDataService} from "../services/weather-data.service";
import {of} from "rxjs";

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let weatherService: jasmine.SpyObj<WeatherService>;
  let weatherDataService: jasmine.SpyObj<WeatherDataService>;
  let matDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    const weatherServiceSpy = jasmine.createSpyObj('WeatherService', ['getWeather']);
    const weatherDataServiceSpy = jasmine.createSpyObj('WeatherDataService', ['updateWeatherData']);
    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const dialogRefMock = {
      afterClosed: jasmine.createSpy('afterClosed'),
    };

    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      providers: [
        {provide: WeatherService, useValue: weatherServiceSpy},
        {provide: WeatherDataService, useValue: weatherDataServiceSpy},
        {provide: MatDialog, useValue: matDialogSpy},
        {provide: MatDialogRef, useValue: dialogRefMock},
      ]
    });
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;

    weatherService = TestBed.inject(WeatherService) as jasmine.SpyObj<WeatherService>;
    weatherDataService = TestBed.inject(WeatherDataService) as jasmine.SpyObj<WeatherDataService>;
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with persisted data', () => {
    localStorage.setItem('selectedCity', 'London');
    localStorage.setItem('selectedUnits', 'metric');

    component.ngOnInit();

    expect(component.city.value).toBe('London');
    expect(component.units.value).toBe('metric');
  });

  it('should update weather data', () => {
    const weatherData = {city: 'Oulu', temperature: 10} as WeatherData;

    component.updateWeatherData(weatherData);

    expect(localStorage.getItem('selectedCity')).toBe('Oulu');
    expect(weatherDataService.updateWeatherData).toHaveBeenCalledWith(weatherData);
  });

  it('should search weather data when multiple cities available', () => {

    const cityName = 'Helsinki';
    const units = 'metric';

    const weatherData = [{city: 'Helsinki1'}, {city: 'Helsinki2'}] as WeatherData[];
    weatherService.getWeather.and.returnValue(of(weatherData));
    const dialogRefSpyObj = jasmine.createSpyObj({afterClosed: of(weatherData[1])});
    matDialog.open.and.returnValue(dialogRefSpyObj);

    component.city.setValue(cityName);
    component.units.setValue(units);

    component.searchWeather();

    expect(matDialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
      data: weatherData,
    });
    expect(weatherDataService.updateWeatherData).toHaveBeenCalledWith(weatherData[1]);
  });

  it('should search weather data when unique city available', () => {
    const cityName = 'Colombo';
    const units = 'metric';

    const weatherData = [{city: 'Colombo'}] as WeatherData[];
    weatherService.getWeather.and.returnValue(of(weatherData));

    component.city.setValue(cityName);
    component.units.setValue(units);

    component.searchWeather();

    expect(component.city.value).toBe('Colombo');
    expect(weatherDataService.updateWeatherData).toHaveBeenCalledWith(weatherData[0]);
  });
});
