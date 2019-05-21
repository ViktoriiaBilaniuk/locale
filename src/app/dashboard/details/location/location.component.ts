import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { VenueLocation } from '../../../models/right-sidebar/venue-details/venue-location';

declare let google: any;

@Component({
  selector: 'sl-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() location: VenueLocation;

  currentLocation;
  marker;
  map;
  noLocation;
  geocoder;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.noLocation = false;
    this.setMapCoordinates();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnChanges() {
    this.noLocation = this.getLocationStatus(this.location);
    this.setMapCoordinates();
  }

  getLocationStatus(location) {
    return (!location || Object.keys(location).length === 0);
  }

  setMapCoordinates() {
    this.currentLocation = new google.maps.LatLng(parseFloat(String(this.location['lat'])), parseFloat(String(this.location['long'])));
    this.initMap();
    if (!this.location.address) {
      this.codeLatLng(this.location['lat'], this.location['long']);
    }
  }

  initMap() {
    this.geocoder = new google.maps.Geocoder;
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: this.currentLocation,
      zoom: 13,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    });
    this.marker = new google.maps.Marker({
      map: this.map,
      position: this.currentLocation,
      anchorPoint: new google.maps.Point(0, -29),
    });
  }

  codeLatLng(lat, lng) {
    this.geocoder.geocode({
      'latLng': this.currentLocation
    },  (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          this.location.address = results[1].formatted_address;
          this.changeDetectorRef.detectChanges();
        }
      }
    });
  }
}
