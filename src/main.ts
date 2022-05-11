import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWZhYnJhIiwiYSI6ImNreTFhNHZ1MzA5bWEybnF0M2VsZDRpdnYifQ.MP6r7FQWpIQ1q35VyiQLRw';


if (!navigator.geolocation) {
  alert('Geolocation is not supported by your browser');
  throw new Error('Geolocation is not available');
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
