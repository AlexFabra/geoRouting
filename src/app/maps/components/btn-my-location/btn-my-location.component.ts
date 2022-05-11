import { Component, OnInit } from '@angular/core';

import { MapService } from '../../services/map.service';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent implements OnInit {

  constructor(private mapService: MapService, private placesServices:PlacesService) { }

  ngOnInit(): void {
  }

  goToMyLocation(){
    if(!this.placesServices.isUserLocationReady){
      throw Error('No se ha podido acceder a la localización')
    }
    if(!this.mapService.isMapReady){
      throw Error('El mapa no está inicializado')
    }

    this.mapService.flyTo(this.placesServices.userLocation!);
  }

}
