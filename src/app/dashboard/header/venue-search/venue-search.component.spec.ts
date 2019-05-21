import { VenueSearchComponent } from './venue-search.component';
import { CHAT_SERVICE, PERMISSION_SERVICE_STUB, ROUTER, STORE_STUB, TRACK_STUB } from '../../../test/stubs/service-stubs';
import { of } from 'rxjs';

describe('VenueSearchComponent', () => {
  let component;
  const allPErmissionsMock = [{ venue_id: 1, permissions: ['reach_out']}];
  const venueChatsMock = [ {venue_id: 1, reachOutReason: '1', venue: {name: ''}, venue_chats: [], } ];
  const threadsMock = [{title: 'Leftbar.active', venues: [{messages: 1}]}];

  beforeEach(() => {
    component = new VenueSearchComponent(STORE_STUB, ROUTER, TRACK_STUB, CHAT_SERVICE, PERMISSION_SERVICE_STUB);
    component.venueChats = venueChatsMock;
    component.reachOut = [];
    component.allPermissions = allPErmissionsMock;
  });

  describe('fetchChatsAndAccess', () => {
    let selectSpy, getNotificationsSpy;
    beforeEach(() => {
      selectSpy = spyOn(STORE_STUB, 'select').and.returnValue(of({type: 'type', id: 1}));
      getNotificationsSpy = spyOn(CHAT_SERVICE, 'getNotifications').and.returnValue({
        valueChanges: function() {
          return of([1]);
        },
      });
    });

    it('should select current user ', () => {
      component.fetchChatsAndAccess();
      expect(selectSpy).toHaveBeenCalled();
    });

    it('should select firebase-login', () => {
      component.fetchChatsAndAccess();
      expect(selectSpy).toHaveBeenCalled();
    });

    it('should define userType', () => {
      component.fetchChatsAndAccess();
      expect(component.userType).toBeDefined();
    });

    it('should define userId', () => {
      component.fetchChatsAndAccess();
      expect(component.userId).toBeDefined();
    });

    it('should define notificationSubscription', () => {
      component.fetchChatsAndAccess();
      expect(component.notificationSubscription).toBeDefined();
    });

    it('should call getNotifications', () => {
      component.fetchChatsAndAccess();
      expect(getNotificationsSpy).toHaveBeenCalled();
    });

  });
});
