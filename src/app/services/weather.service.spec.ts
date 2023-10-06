import {TestBed} from '@angular/core/testing';

import {WeatherService} from './weather.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('WeatherService', () => {
  let service: WeatherService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService],
    });
    service = TestBed.inject(WeatherService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch weather data', () => {
    const city = 'London';
    const units = 'metric';

    const mockResponse = {
      list: [
        {
          id: 2643743,
          name: 'London',
          sys: {country: 'GB'},
          main: {temp: 20, humidity: 50},
          weather: [{description: 'Partly cloudy'}],
        },
      ],
    };

    service.getWeather(city, units).subscribe((weatherData) => {
      expect(weatherData.length).toBe(1);
      expect(weatherData[0].city).toBe('London');
      expect(weatherData[0].country).toBe('GB');
      expect(weatherData[0].temperature).toBe(20);
      expect(weatherData[0].weather).toBe('Partly cloudy');
    });

    const req = httpTestingController.expectOne((request) =>
      request.url.includes('https://api.openweathermap.org/data/2.5/find')
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
