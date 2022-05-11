import { Feature, PlacesResponse } from '../interfaces/places';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MapService } from './map.service';
import { PlacesApiClient } from '../api/placesApiClient';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [number, number];
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }

  constructor(private placesApi: PlacesApiClient, private mapService: MapService) {
    this.getUserLocation()
  }

  public async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = [position.coords.longitude, position.coords.latitude];
          resolve(this.userLocation);
        },
        (error) => {
          alert('no se ha podido obtener la geolocalización');
          reject();
        }
      )
    })
  }

  getPlacesByQuery(query: string) {
    if (query.length === 0) {
      this.isLoadingPlaces = false;
      this.places = [];
      return;
    }

    if (!this.userLocation) {
      throw new Error('No se ha obtenido la geolocalización');
    }


    this.isLoadingPlaces = true;

    this.placesApi.get<PlacesResponse>(`${query}.json`, { params: { proximity: this.userLocation.join(',') } })
      .subscribe(resp => {
        this.places = resp.features
        this.isLoadingPlaces = false;
        this.mapService.createMarkersFromPlaces(this.places, this.userLocation!);
      })
  }

  deletePlaces(){
    this.places = [];
  }

}
