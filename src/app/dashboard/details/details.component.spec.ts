import { DetailsComponent } from './details.component';
import { Store } from '../../core/store/store';
import { TRACK_STUB, VENUE_SERVICE_STUB } from '../../test/stubs/service-stubs';
import { VENUE_DETAILS_MOCK } from '../../test/mocks/details-mocks';
import { of } from 'rxjs/index';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  const store = new Store();
  const venueServiceStub = VENUE_SERVICE_STUB;
  const trackServiceStup = TRACK_STUB;
  const venueDetailsMock = VENUE_DETAILS_MOCK;

  beforeEach(() => {
    component = new DetailsComponent(venueServiceStub, store, trackServiceStup);
    component.venueDetails = venueDetailsMock;
    // component.permissions = ['profile'];
  });

  it('should get venue details from store', () => {
    const storeSelectDetailsSpy = spyOn(store, 'select').and.callFake((value) => {
      return of(value);
    });
    component.ngOnInit();
    expect(storeSelectDetailsSpy).toHaveBeenCalled();
    expect(storeSelectDetailsSpy).toHaveBeenCalledWith('venue-details');
  });

  it('should get permissions from store', () => {
    const storeSelectDetailsSpy = spyOn(store, 'select').and.callFake((value) => {
      return of(value);
    });
    component.ngOnInit();
    expect(storeSelectDetailsSpy).toHaveBeenCalled();
    expect(storeSelectDetailsSpy).toHaveBeenCalledWith('permissions');

  });

  it('should set venue details', () => {
    const venueDetails = Object.assign({id: '1'}, venueDetailsMock);
    spyOn(store, 'select').and.callFake(() => {
      return of(venueDetails);
    });
    component.ngOnInit();
    expect(component.venueDetails).toEqual(venueDetails);
  });

  it('should edit current_objective property and make API call', () => {
    const serviceSpy = spyOn(venueServiceStub, 'updateDetails').and.returnValue(of({}));
    component.updateVenueDetails('current_objective', 'new objective');
    expect(serviceSpy).toHaveBeenCalledWith('1', { current_objective: 'new objective' });
  });

  it('should edit brand_guidelines property and make API call', () => {
    const serviceSpy = spyOn(venueServiceStub, 'updateDetails').and.returnValue(of({}));
    component.updateVenueDetails('brand_guidelines', 'new guidelines');
    expect(serviceSpy).toHaveBeenCalledWith('1', { brand_guidelines: 'new guidelines' });
  });

  it('should edit special_offers property and make API call', () => {
    const serviceSpy = spyOn(venueServiceStub, 'updateDetails').and.returnValue(of({}));
    component.updateVenueDetails('special_offers', 'new offers');
    expect(serviceSpy).toHaveBeenCalledWith('1', { special_offers: 'new offers' });
  });

  it('should edit opening_hours property and make API call', () => {
    const serviceSpy = spyOn(venueServiceStub, 'updateDetails').and.returnValue(of({}));
    component.updateVenueDetails('opening_hours', []);
    expect(serviceSpy).toHaveBeenCalledWith('1', { opening_hours: [] });
  });

  it('should edit menus property and make API call', () => {
    const serviceSpy = spyOn(venueServiceStub, 'updateDetails').and.returnValue(of({}));
    component.updateVenueDetails('menus', []);
    expect(serviceSpy).toHaveBeenCalledWith('1', { menus: [] });
  });

  describe('permissions', () => {
    beforeEach(() => {
      store.set('permissions', ['profile']);
    });

    it('should return true for canEditDetails', () => {
      component.ngOnInit();
      expect(component.canEditDetails).toBeTruthy();
    });
  });

  describe('unsubscribe', () => {
    beforeEach(() => {
      const spiesOnSubscriptions = [];
      (component as any).subscriptions.forEach(s => {
        spiesOnSubscriptions.push(spyOn(s, 'unsubscribe'));
      });
    });
  });
});
