import { LocationComponent } from './location.component';
import { GOOGLE_MAPS } from '../../../test/stubs/google-maps';

declare let google: any;

describe('LocationComponent', () => {
  let component: LocationComponent;
  window['google'] = GOOGLE_MAPS;
  let geocoder;
  const location = {
    lat: 1,
    long: 2,
    address: ''
  };

  beforeEach(() => {
    component = new LocationComponent(null);
    component.noLocation = true;
    component.location = location;
    const constructorSpy = spyOn(google.maps, 'Geocoder');
    geocoder = jasmine.createSpyObj('Geocoder', ['geocode']);
    constructorSpy.and.returnValue(geocoder);
  });


  it ('should init', () => {
    const setMapCoordinatesSpy = spyOn(component, 'setMapCoordinates');
    component.ngOnInit();
    expect(component.noLocation).toBeFalsy();
    expect(setMapCoordinatesSpy).toHaveBeenCalled();
  });

  it ('should set noLocation', () => {
    component.noLocation = undefined;
    component.ngOnChanges();
    expect(component.noLocation).toBeDefined();
  });

  it ('should return true if no location', () => {
    const newLocation = {};
    expect(component.getLocationStatus(newLocation)).toBe(true);
  });

  it ('should return false if location exist', () => {
    expect(component.getLocationStatus(location)).toBe(false);
  });

  it ('should set current location', () => {
    location.address = 'address';
    const currentLocation = {
      lat: 1,
      lng: 2,
    };
    spyOn(component, 'initMap');
    spyOn(component, 'codeLatLng');
    component.location = location;
    component.setMapCoordinates();
    expect(component.currentLocation).toEqual(currentLocation);
  });

  it ('should set geocoder', () => {
    component.initMap();
    expect(component.geocoder).toBeDefined();
  });

  it ('should set map', () => {
    component.initMap();
    expect(component.map).toBeDefined();
  });

  it ('should set marker', () => {
    component.initMap();
    expect(component.marker).toBeDefined();
  });

});
