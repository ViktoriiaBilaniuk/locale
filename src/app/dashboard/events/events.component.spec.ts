import { EventsComponent } from './events.component';
import {
  TRACK_STUB,
  STORE_STUB,
  PERMISSION_SERVICE_STUB,
  CALENDAR_SERVICE_STUB
} from '../../test/stubs/service-stubs';
import { of } from 'rxjs/index';

describe('EventsComponent', () => {
  let component: EventsComponent;
  const route = {} as any;
  const router = {} as any;
  const calendarService = CALENDAR_SERVICE_STUB;
  const store = STORE_STUB;
  const track = TRACK_STUB;
  const permissionsService = PERMISSION_SERVICE_STUB;

  beforeEach(() => {
    component = new EventsComponent(
      route,
      calendarService,
      store,
      track,
      router,
      permissionsService
    );
    store.select = (key) => {
      if (key === 'venueId') {
        return of('id' as any);
      } else if (key === 'categories') {
        return of('category' as any);
      }
    };
  });

  afterEach(() => {
    component = null;
  });

  describe('Fetch data', () => {

    let storeSelectVenueId;

    describe('logic needs venueId', () => {

      beforeEach(() => {
        storeSelectVenueId = spyOn(store, 'select').and.returnValue(of('id' as any));
        component.eventSettings = {radius: null, sortOption: null, filters: null};
        component.availableOptions = [{selected: null}, {selected: null}] as any;
      });
      it('should get venueId from store', () => {
        component.ngOnInit();
        expect(storeSelectVenueId).toHaveBeenCalledWith('venueId');
      });

      it('should init venueId', () => {
        component.ngOnInit();
        expect(component.venueId).toBeDefined();
      });

      it ('should define subscriptions', () => {
        component.ngOnInit();
        expect(component.subscriptions).toBeDefined();
      });

      it ('should define sliderValue', () => {
        component.ngOnInit();
        expect(calendarService.sliderValue).toBeDefined();
      });

      it ('should define radius of eventSettings', () => {
        component.ngOnInit();
        expect(component.eventSettings.radius).toBeDefined();
      });

      it ('should define sortOption of eventSettings', () => {
        component.ngOnInit();
        expect(component.eventSettings.sortOption).toBeDefined();
      });

      it ('should set first availableOptions to true', () => {
        component.ngOnInit();
        expect(component.availableOptions[0].selected).toBeTruthy();
      });

      it ('should set second availableOptions to false', () => {
        component.ngOnInit();
        expect(component.availableOptions[1].selected).toBeFalsy();
      });
    });


    it('should get events categories from store', () => {
      const storeSelectCategoriesSpy = spyOn(store, 'select').and.returnValue(of('category' as any));
      component.ngOnInit();
      expect(storeSelectCategoriesSpy).toHaveBeenCalledWith('categories');
    });

    it('should track calendar opening', () => {
      const trackSpy = spyOn(TRACK_STUB, 'calendarOpened');
      component.ngOnInit();
      expect(trackSpy).toHaveBeenCalled();
    });

  });


  describe('Init data', () => {

    it('should reset sorting to default', () => {
      const options = [
        { value: 'distance', title: 'Events.distance', selected: true },
        { value: 'relevance', title: 'Events.relevance', selected: false},
      ];
      component.availableOptions = [
        { value: 'distance', title: 'Events.distance', selected: false },
        { value: 'relevance', title: 'Events.relevance', selected: true},
      ];
      component.ngOnInit();
      expect(component.availableOptions).toEqual(options);
    });

  });

});
