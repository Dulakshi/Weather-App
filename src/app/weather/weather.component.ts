import {Component, OnInit} from '@angular/core';
import {WeatherDataService} from "../services/weather-data.service";
import {WeatherData} from "../weather-data.model";
import {Observable} from "rxjs";


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  data$: Observable<WeatherData> = this.weatherDataService.weatherData$;

  constructor(private weatherDataService: WeatherDataService) {
  }

  ngOnInit(): void {
    this.weatherDataService.weatherData$.pipe().subscribe((weatherData) => {
      console.log(weatherData)
    });
  }
}
