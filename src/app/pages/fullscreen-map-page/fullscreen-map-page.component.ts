import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { DecimalPipe, JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './fullscreen-map-page.component.html',
  styles: `
  div{
    width:100vw;
    height:calc(100vh - 64px);
  }
  #controls{
    background-color:white;
    padding:10px;
    border-radius:5px;
    position:fixed;
    bottom: 20px;
    right:20px;
    z-index:9999;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    border: 1px solid #e2e8f0;
    width:250px
  }
  `,
})
export class FullscreenMapPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  zoom = signal<number>(14);
  coordinates = signal({
    lng: -74.5,
    lat: 40,
  });

  map = signal<mapboxgl.Map | null>(null);

  zoomEffect = effect(() => {
    if (!this.map()) return;
    this.map()!.setZoom(this.zoom());
    //this.map()!.zoomTo(this.zoom());
  });

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;

    const element = this.divElement()!.nativeElement;

    const { lat, lng } = this.coordinates();

    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: this.zoom(),
    });
    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });

    map.on('moveend', () => {
      const center = map.getCenter();
      this.coordinates.set({ lng: center.lng, lat: center.lat });
    });

    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    this.map.set(map);
  }
}
