import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';

import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: "root"
})
export class PlacesApiClient extends HttpClient {
    
    //link funcional
    //https://api.mapbox.com/geocoding/v5/mapbox.places/car.json?country=es&limit=1&types=place%2Cpostcode%2Caddress&language=es&access_token=pk.eyJ1IjoiYWZhYnJhIiwiYSI6ImNreTFhNHZ1MzA5bWEybnF0M2VsZDRpdnYifQ.MP6r7FQWpIQ1q35VyiQLRw
    
    public baseUrl: string = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
    
    constructor(handler: HttpHandler) {
        super(handler)
    }

    public override get<T>(url: string, options: {
        params?: HttpParams | {
            [param: string]: string | number | boolean | ReadonlyArray <string | number | boolean>
        }
    }) {
        url = this.baseUrl + url;
        return super.get<T>(url, {
            params: {
                limit: 7,
                types:'place',
                postcode:'adress',
                language: 'es',
                ...options.params,
                access_token: environment.apiKey
            }
        });
    }
}