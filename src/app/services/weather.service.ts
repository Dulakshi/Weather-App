import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {WeatherData} from "../weather-data.model";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '1cb6ace31e50401f28b864f0b23fdc68';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/find';

  constructor(private http: HttpClient) {
  }

  getWeather(city: string, units: string): Observable<WeatherData[]> {
    const params = new HttpParams()
      .set('q', city)
      .set('units', units)
      .set('appid', this.apiKey);

    return this.http.get<any>(`${this.apiUrl}`, {params})
      .pipe(
        map((response: any) => {
          return response.list.map((item: any) => ({
            id: item.id,
            city: item.name,
            country: item.sys.country,
            temperature: item.main.temp,
            weather: item.weather[0].description
          }));
        }),
        catchError((error: any) => {
          const errorMessage = 'Error fetching weather data. Please try again later.';
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}
