import { DashboardComponent } from './dashboard.component';
import {
  CHANGE_DETECTION, CHAT_SERVICE, NOTIFICATIONS, PERMISSION_SERVICE_STUB, ROUTE, STORE_STUB,
  VENUE_SERVICE_STUB
} from '../test/stubs/service-stubs';
import { of } from 'rxjs';

describe('DashboardComponent', () => {

  let component;
  const venueDataMock = {
    venueData: {
      openGeneralChat: 2,
      firstVenueId: 1
    }
  };
  const venueChatsMock = {
    venue: {venue_chats: [
        {venue_chat_model_id: {_id: 1}},
        {venue_chat_model_id: {_id: 2}},
      ]
    }
  };
  let fetchVenueChatsSpy, dataSpy;

  beforeEach(() => {
    component = new DashboardComponent(VENUE_SERVICE_STUB, ROUTE, NOTIFICATIONS, PERMISSION_SERVICE_STUB,
      STORE_STUB, CHANGE_DETECTION, CHAT_SERVICE);
    dataSpy = spyOn(ROUTE, 'data').and.returnValue(of(venueDataMock));
    fetchVenueChatsSpy = spyOn(CHAT_SERVICE, 'fetchVenueChats').and.returnValue(of(venueChatsMock));
  });

/*  describe('ngOnInit', () => {
    let subscribeOnExpandStatusSpy, checkPermissionsSpy, openChatSectionSpy, setVenueSpy;

    beforeEach(() => {
      subscribeOnExpandStatusSpy = spyOn(component, 'subscribeOnExpandStatus');
      checkPermissionsSpy = spyOn(component, 'checkPermissions');
      openChatSectionSpy = spyOn(component, 'openChatSection');
      setVenueSpy = spyOn(component, 'setVenue');
      spyOn(component, 'chatSectionIsClosed').and.returnValue(true);
    });

    it('should call subscribeOnExpandStatus', () => {
      component.ngOnInit();
      expect(subscribeOnExpandStatusSpy).toHaveBeenCalled();
    });

    it('should call checkPermissions', () => {
      component.ngOnInit();
      expect(checkPermissionsSpy).toHaveBeenCalled();
    });

  });*/

  describe('set venue logic', () => {

    it ('should call setVenue', () => {
      const setVenueSpy = spyOn(component, 'setVenue');
      component.onVenueSelect(1);
      expect(setVenueSpy).toHaveBeenCalled();
    });

    it ('should define venueId', () => {
      component.setVenue(1, true);
      expect(component.venueId).toBeDefined();
    });

    it ('should set venueId to store', () => {
      const setSpy = spyOn(STORE_STUB, 'set');
      component.setVenue(1, true);
      expect(setSpy).toHaveBeenCalled();
    });

    it ('should call fetchVenueChats', () => {
      component.setVenue(1, true);
      expect(fetchVenueChatsSpy).toHaveBeenCalled();
    });

    it ('should set selectedChatId to chatId', () => {
      component.setVenue(1, true, 2);
      expect(CHAT_SERVICE.selectedChatId).toEqual(2);
    });
  });

  describe('fetchVenueDetails', () => {
    it ('should call fetchDetails', () => {
      const fetchDetailsSpy = spyOn(VENUE_SERVICE_STUB, 'fetchDetails').and.returnValue(of(1));
      component.fetchVenueDetails(1);
      expect(fetchDetailsSpy).toHaveBeenCalled();
    });

    it ('should call fetchVenueChats', () => {
      component.fetchVenueDetails(1);
      expect(fetchVenueChatsSpy).toHaveBeenCalled();
    });

    it ('should call fetchPermissionsByVenue', () => {
      const fetchPermissionsByVenueSpy = spyOn(PERMISSION_SERVICE_STUB, 'fetchPermissionsByVenue');
      component.fetchVenueDetails(1);
      expect(fetchPermissionsByVenueSpy).toHaveBeenCalled();
    });

  });

});
