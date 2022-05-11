import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { MapService } from '../../services';
import { PlacesService } from '../../services';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('mapDiv') mapDivElement!: ElementRef;

  constructor(private placesService: PlacesService, private mapService: MapService) { }

  ngAfterViewInit() {
    if (!this.placesService.userLocation) {
      throw Error('No se ha podido acceder a la localización')
    }
    const map = new mapboxgl.Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.placesService.userLocation, // starting position [lng, lat]
      zoom: 9 // starting zoom
    });

    const popup = new mapboxgl.Popup()
      .setHTML(`<h6>mi ubicación</h6>`)

    new mapboxgl.Marker({ color: 'blue' })
      .setLngLat(this.placesService.userLocation)
      .setPopup(popup)
      .addTo(map);

    this.mapService.setMap(map);
  }

}
