import { ChatsComponent } from './chats.component';
import { CHAT_SERVICE, TRACK_STUB } from '../../../test/stubs/service-stubs';
import { Store } from '../../../core/store/store';
import { of , BehaviorSubject} from 'rxjs';
import {
  ALL_CHATS,
  CHATS, CHATS_MOCK, CHATS_MOCK_EXPANDED, CHATS_MOCK_EXPANDED_SORTED, CHATS_MOCK_SORTED_BY_TIME, EXPANDED_CHAT_MOCK,
  GENERAL_CHAT_MOCK, SORTED_CHATS
} from '../../../test/mocks/chats-mocks';

describe('ChatsComponent', () => {
  let component;
  const store = new Store();

  beforeEach(() => {
    component = new ChatsComponent(TRACK_STUB, store, CHAT_SERVICE);
    store.set('selectedChatId', 1);
    store.set('selectedChat', 1);
  });

  describe('checkChatInfo', () => {

    it ('should select selectedChatId from store', () => {
      const selectSpy = spyOn(store, 'select').and.returnValue(of(1));
      component.checkChatInfo();
      expect(selectSpy).toHaveBeenCalledWith('selectedChatId');
    });

    it ('should select selectedChat from store', () => {
      const selectedChatSpy = spyOn(store, 'select').and.returnValue(of(1));
      component.checkChatInfo();
      expect(selectedChatSpy).toHaveBeenCalledWith('selectedChat');
    });

    it ('should define selectedChatId', () => {
      component.checkChatInfo();
      expect(CHAT_SERVICE.selectedChatId).toBeDefined();
    });

    it ('should set next value for selectedChat', () => {
      component.checkChatInfo();
      expect(CHAT_SERVICE.selectedChat.value).toEqual(1);
    });

  });

  describe('fetchChats', () => {
    const venueChatsMock = {
      user_id: 1,
      venue_chats: [1, 2]
    };

    let selectSpy;

    beforeEach(() => {
      selectSpy = spyOn(store, 'select').and.returnValue(of(venueChatsMock));
      store.set('current-user', {type: 'admin'});
      spyOn(CHAT_SERVICE, 'getNotifications').and.returnValue({
        valueChanges() {
          return of({});
        }
      });
    });

    it ('sould select venue chats from store', () => {
      component.fetchChats();
      expect(selectSpy).toHaveBeenCalledWith('venue-chats');
    });

    it ('sould set loading to false', () => {
      component.fetchChats();
      expect(component.loading).toBeFalsy();
    });

    it ('sould set userType', () => {
      component.fetchChats();
      expect(component.userType).toEqual('admin');
    });

    it ('sould set userId', () => {
      component.fetchChats();
      expect(component.userId).toEqual(venueChatsMock.user_id);
    });

    it ('sould set chats', () => {
      component.fetchChats();
      expect(component.chats).toEqual(venueChatsMock.venue_chats);
    });

    it ('should call subscribeForNotifications', () => {
      const subscribeForNotificationsSpy = spyOn(component, 'subscribeForNotifications');
      component.fetchChats();
      expect(subscribeForNotificationsSpy).toHaveBeenCalled();
    });

  });

  describe('subscribeForPost', () => {

    let sendMessageSpy;

    beforeEach(() => {
      component.subscriptions = [];
      component.chats = CHATS;
      CHAT_SERVICE.postId = new BehaviorSubject(1);
      sendMessageSpy = spyOn(CHAT_SERVICE, 'sendMessage').and.returnValue(of({}));
    });

    it ('should call sendMessage', () => {

      component.subscribeForPost();
      expect(sendMessageSpy).toHaveBeenCalled();
    });

    it ('should call selectGeneralChat', () => {
      const selectGeneralChatSpy = spyOn(component, 'selectGeneralChat');
      component.subscribeForPost();
      expect(selectGeneralChatSpy).toHaveBeenCalled();
    });

  });

  describe('selectGeneralChat', () => {
    const generalChatMock = GENERAL_CHAT_MOCK;
    beforeEach(() => {
      component.chats = CHATS;
    });

    it ('should call openChat', () => {
      const openChatSpy = spyOn(TRACK_STUB, 'openChat');
      component.selectGeneralChat();
      expect(openChatSpy).toHaveBeenCalled();
    });

    it ('should set selectedChat', () => {
      component.selectGeneralChat();
      expect(CHAT_SERVICE.selectedChat.value).toEqual(generalChatMock);
    });

    it ('should set selectedChatId', () => {
      component.selectGeneralChat();
      expect(CHAT_SERVICE.selectedChatId).toEqual(1);
    });

  });

  it ('should return openedChatId', () => {
    expect(component.openedChatId).toEqual(1);
  });

  it ('should return openedChat', () => {
    CHAT_SERVICE.selectedChat.next(1);
    expect(component.openedChat).toEqual(1);
  });

  it ('should return chatBodyHeight', () => {
    const actionAreaMock = {
      nativeElement: {
        offsetHeight: 10
      }
    };
    component.actionArea = actionAreaMock;
    expect(component.chatBodyHeight).toEqual(`calc(100vh - 48px - 48px - 80px - ${actionAreaMock.nativeElement.offsetHeight}px)`);
  });

  it ('should reset selectedChatId', () => {
    spyOn(CHAT_SERVICE, 'fetchVenueChats').and.returnValue(of({}));
    component.goToChatList();
    expect(component.selectedChatId).not.toBeDefined();
  });

  it ('should call fetchVenueChats', () => {
    const fetchVenueChatsSpy = spyOn(CHAT_SERVICE, 'fetchVenueChats').and.returnValue(of({}));
    component.refrechChates();
    expect(fetchVenueChatsSpy).toHaveBeenCalled();
  });

  it ('should return true in isGeneralChat', () => {
    expect(component.isGeneralChat(GENERAL_CHAT_MOCK)).toBeTruthy();
  });

  it ('should return name for general chat', () => {
    CHAT_SERVICE.selectedChat.next(GENERAL_CHAT_MOCK);
    expect(component.currentChatName).toEqual('Chat.general');
  });

  it ('should return chat name', () => {
    expect(component.getChatName(EXPANDED_CHAT_MOCK)).toEqual('name');
  });

  it ('should sort chats by time', () => {
    expect(component.timeSort(CHATS_MOCK)).toEqual(CHATS_MOCK_SORTED_BY_TIME);
  });

  it ('should sort chats by name', () => {
    expect(component.textSorting(CHATS_MOCK_EXPANDED)).toEqual(CHATS_MOCK_EXPANDED_SORTED);
  });

  it ('should return sorted chats', () => {
    component.chats = ALL_CHATS;
    expect(component.SortedChats).toEqual(SORTED_CHATS);
  });

});
