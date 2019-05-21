import { NotificationsService } from './notifications.service';
import { AUTH, CHAT_SERVICE, ROUTER, STORE_STUB } from '../../../test/stubs/service-stubs';
import { of } from 'rxjs';

describe('NotificationsService', () => {

  let service, selectSpy;
  const userMock = {
    id: 1,
    type: 2
  };
  const spyParams = {
    'current-user': userMock,
    'firebaseToken': '1'
  };

  beforeEach(() => {
    service = new NotificationsService(STORE_STUB, CHAT_SERVICE, ROUTER, AUTH);
    STORE_STUB.set('firebaseToken', '1');
    selectSpy = spyOn(STORE_STUB, 'select').and.callFake((param) => {
      return of(spyParams[param]);
    });
  });

  it ('should call loginToFirebase', () => {
    const loginToFirebaseSpy = spyOn(AUTH, 'loginToFirebase');
    service.getFirebaseToken();
    expect(loginToFirebaseSpy).toHaveBeenCalled();
  });

  describe('subscribeForPushNotifications', () => {
    const notificationsMock = [
      {
        last_message: {
          type: 'text',
          content: {text: 'text'}
        },
        venue_id: 1,
        chat_id: 1,
      }
    ];

    const notificationResponseMock =  {
      valueChanges: function () {
        return of(notificationsMock);
      },
    };

    let getNotificationsSpy;

    beforeEach(() => {
      getNotificationsSpy = spyOn(CHAT_SERVICE, 'getNotifications').and.returnValue(notificationResponseMock);
    });

    it ('should select values from store', () => {
      service.subscribeForPushNotifications();
      expect(selectSpy).toHaveBeenCalledTimes(2);
    });

    it ('should call getNotifications', () => {
      service.subscribeForPushNotifications();
      expect(getNotificationsSpy).toHaveBeenCalled();
    });
  });

});
