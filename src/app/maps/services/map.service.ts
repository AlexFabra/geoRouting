import { AnySourceData, LngLat, LngLatBounds, LngLatLike, Marker, Popup } from 'mapbox-gl';
import { DirectionsResponse, Route } from '../interfaces/directions';

import { DirectionsApiClient } from '../api/directionsApiClient';
import { Feature } from '../interfaces/places';
import { Injectable } from '@angular/core';
import { PlacesApiClient } from '../api/placesApiClient';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map?: mapboxgl.Map;
  private markers: Marker[] = [];

  constructor(private directionsApi: DirectionsApiClient) { }

  get isMapReady() {
    return !!this.map;
  }

  setMap(map: mapboxgl.Map) {
    this.map = map;
  }

  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) {
      throw Error('El mapa no está inicializado')
    }
    this.map?.flyTo({
      zoom: 14,
      center: coords
    })
  }

  createMarkersFromPlaces(places: Feature[], userLocation: [number, number]) {
    if (!this.map) {
      throw Error('El mapa no está inicializado')
    }

    //purgamos los marcadores en el mapa:
    this.markers.forEach(marker => marker.remove());
    const newMarkers = [];

    //creamos nuevos marcadores
    for (const place of places) {

      const [lng, lat] = place.center;
      const popup = new Popup()
        .setHTML(`<h6>${place.place_name}</h6>`);
      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);
      newMarkers.push(newMarker)
    }
    this.markers = newMarkers;

    if (places.length === 0) return;

    //adaptamos el mapa para que muestre los marcadores:
    const bounds = new LngLatBounds();
    //obtenemos los límites de todos los  marcadores:
    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation)
    this.map.fitBounds(bounds, { padding: 50 })
  }

  getRouteBetweenPlaces(start: [number, number], end: [number, number]) {
    this.directionsApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe(response => {
        this.drawPolyline(response.routes[0]);
      })
  }

  private drawPolyline(route: Route) {
    console.log({ kms: route.distance / 1000, duration: route.duration / 60 })
    if (!this.map) throw Error('El mapa no está inicializado');
    const coords = route.geometry.coordinates;
    const bounds = new LngLatBounds();
    coords.forEach(([lng, lat]) => {
      bounds.extend([lng, lat]);
    })
    this.map?.fitBounds(bounds, { padding: 50 });

    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }
    //para actualizar la ruta una vez buscada otra:
    if(this.map.getLayer('RouteString')){
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }

    this.map.addSource('RouteString', sourceData);
    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        "line-cap": 'round',
        "line-join": 'round'
      },
      paint: {
        "line-color": "black",
        "line-width": 3
      }
    })
  }
}
