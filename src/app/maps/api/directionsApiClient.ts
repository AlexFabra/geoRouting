import { HttpClient, HttpHandler } from '@angular/common/http';

import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: "root"
})
export class DirectionsApiClient extends HttpClient {

    //link funcional
    //https://api.mapbox.com/directions/v5/mapbox/driving/-73.98317771377279%2C40.737258659648404%3B-73.99615298523636%2C40.732114074050145%3B-73.9952681842147%2C40.73011347584571%3B-73.97375198078795%2C40.72680790211126?alternatives=false&geometries=geojson&language=en&overview=simplified&steps=true&access_token=pk.eyJ1IjoiYWZhYnJhIiwiYSI6ImNreTFhNHZ1MzA5bWEybnF0M2VsZDRpdnYifQ.MP6r7FQWpIQ1q35VyiQLRw

    public baseUrl: string = "https://api.mapbox.com/directions/v5/mapbox/driving";

    constructor(handler: HttpHandler) {
        super(handler)
    }

    public override get<T>(url: string) {
        url = this.baseUrl + url;
        return super.get<T>(url, {
            params: {
                alternatives: false,
                geometries: 'geojson',
                language: 'es',
                steps: false,
                overview: 'simplified',
                access_token: environment.apiKey
            }
        });
    }
}