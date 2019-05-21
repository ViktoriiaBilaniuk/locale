import { CONSTANTS } from '../../constants';
import { HttpClient } from '@angular/common/http';
import { ChatService } from './chat.service';
import { Store } from '../../store/store';
import { of } from 'rxjs/index';

class MockRouter {
  navigate = function() {} as any;
}

describe ('ChatService', () => {
  let chatService: ChatService;

  const http = new HttpClient(null);
  const store = new Store();
  const router = new MockRouter() as any;

  const tracker = {
    sendChatMessage(t) {}
  } as any;
  const database = {
    list(url) {}
  } as any;
  const chats = [{venue_id: 1, venue_chats: [{venue_chat_model_id: 1}]}];

  const mockChats = {
    venue_id: 1,
    venue_chats: [
      {venue_chat_model_id: 2},
      {venue_chat_model_id: 3},
      {venue_chat_model_id: 4}
    ]
  };

  const mockVenues = [mockChats];

  beforeEach(() => {
    store.set('venue-chats', mockChats);
    chatService = new ChatService(http, store, database, router, tracker);
  });

  it('should call method to send message', () => {
    chatService.postId.next('1');
    const httpSpy = spyOn(http, 'post').and.returnValue(of({}));
    const trackSpy = spyOn(tracker, 'sendChatMessage');

    chatService.sendMessage({ type: 'text', content: 'test' }, 1, 1);

    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}chats/1/message`, { type: 'text', content: 'test', postId: 1 });
    expect(trackSpy).toHaveBeenCalledWith('text');
    expect(chatService.postId.getValue()).toEqual(null);
  });

  it('should call methods to fetch chats and save to store', () => {
    const httpSpy = spyOn(http, 'get').and.returnValue(of({ venue: { id: 1 } }));

    chatService.fetchVenueChats(2);

    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}chats/venues/2`);
  });

  it ('should call method to get presigned url for file', () => {
    const requestFileData = {
      file_name: 'test_name',
      file_type: 'image'
    };
    const httpSpy = spyOn(http, 'post').and.returnValue(of({}));

    chatService.getPreSignedUrl(requestFileData).subscribe();

    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}chats/files/s3-signed-url`, requestFileData);
  });

  it('should call method to upload file', () => {
    const requestFileData = {
      file_name: 'test_name',
      file_type: 'image'
    };
    const httpSpy = spyOn(http, 'put').and.returnValue(of({}));

    chatService.uploadFile('http://path.com/endpoint', {} as any).subscribe();

    expect(httpSpy).toHaveBeenCalledWith('http://path.com/endpoint', {});
  });

  it('should call methods to fetch all chats and set to store', () => {
    const httpSpy = spyOn(http, 'get').and.returnValue(of({ venues: mockVenues}));
    const storeSpy = spyOn(store, 'set');

    chatService.fetchAllChats().subscribe();

    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}chats/venues`);
    expect(storeSpy).toHaveBeenCalledWith('venues-chats', mockVenues);
  });

  it('should call method to set last read message to chat', () => {
    const httpSpy = spyOn(http, 'post').and.returnValue(of({}));
    const serviceUpdateSpy = spyOn(chatService, 'updateUnreadMessagesInStore');

    chatService.setLastReadMessage(11, 22, '1a2b3c4d');

    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}chats/venues/11/read/22`, { lastReadMessageKey: '1a2b3c4d' });
    expect(serviceUpdateSpy).toHaveBeenCalledWith(11, 22);
  });

  it('should call method to get requested chat by ID', () => {
    const dbSpy = spyOn(database, 'list');
    chatService.getChat(123);
    expect(dbSpy).toHaveBeenCalledWith('/chats/123', null);
  });

  it('should call method to get notifications', () => {
    const dbSpy = spyOn(database, 'list');
    chatService.getNotifications(321, undefined);
    expect(dbSpy).toHaveBeenCalledWith(`users/321-VE/notifications/venue_chats`);
  });

  it('should set venues-chats to store', () => {
    store.set('venues-chats', chats);
    const storeSpy = spyOn(store, 'set');
    chatService.updateUnreadMessagesInStore(1, 1);
    expect(storeSpy).toHaveBeenCalledWith('venues-chats', chats);
  });

  it('should call fetchAllChats', () => {
    store.set('venueId', '1');
    const fetchAllChatsSpy = spyOn(chatService, 'fetchAllChats');
    chatService.fetchAllChats();
    expect(fetchAllChatsSpy).toHaveBeenCalled();
  });

  it('should logout', () => {
    const navigateSpy = spyOn(router, 'navigate');
    chatService.logout();
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('should call logout', () => {
    const logoutSpy = spyOn(chatService, 'logout');
    chatService.getInitialVenue([]);
    expect(logoutSpy).toHaveBeenCalled();
  });

  describe('refreshChats', () => {
    let fetchVenueChatsSpy, fetchAllChatsSpy;
    beforeEach(() => {
      store.set('venueId', 1);
      fetchVenueChatsSpy = spyOn(chatService, 'fetchVenueChats').and.returnValue(of({}));
      fetchAllChatsSpy = spyOn(chatService, 'fetchAllChats').and.returnValue(of({}));
      spyOn(http, 'get').and.returnValue(of({venues: []}));
    });

    it('should call fetchVenueChats', () => {
      chatService.refreshChats();
      expect(fetchVenueChatsSpy).toHaveBeenCalledWith(1);
    });

    it('should call fetchAllChats', () => {
      chatService.refreshChats();
      expect(fetchAllChatsSpy).toHaveBeenCalled();
    });

  });

});
