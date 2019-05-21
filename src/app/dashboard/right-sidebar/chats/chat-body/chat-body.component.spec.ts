import { ChatBodyComponent } from './chat-body.component';
import { CHAT_SERVICE, STORE_STUB, TRACK_STUB } from '../../../../test/stubs/service-stubs';
import { EXPANDED_CHAT_MOCK } from '../../../../test/mocks/chats-mocks';
import { of, BehaviorSubject } from 'rxjs';

describe('', () => {

  let component;

  beforeEach(() => {
    component = new ChatBodyComponent(CHAT_SERVICE, TRACK_STUB, STORE_STUB);
    CHAT_SERVICE.selectedChat = new BehaviorSubject(EXPANDED_CHAT_MOCK);
  });

  it ('should call setChat', () => {
    const setChatSpy = spyOn(component, 'setChat');
    component.ngOnChanges({refresh: true});
    expect(setChatSpy).toHaveBeenCalled();
  });

  describe('setChat', () => {

    beforeEach(() => {
      component.initialMessageCount = 1;
      component.takeCount$ = new BehaviorSubject('');
    });

    it ('should define participants', () => {
      component.setChat();
      expect(component.participants).toBeDefined();
    });

    it ('should set next takeCount$ value', () => {
      component.setChat();
      expect(component.takeCount$.getValue()).toEqual(1);
    });

    it ('should set scrollToNewMessages to true', () => {
      component.setChat();
      expect(component.scrollToNewMessages).toBeTruthy();
    });
  });

  it ('should return chatObj', () => {
    expect(component.chatObj).toEqual(EXPANDED_CHAT_MOCK);
  });

  describe('hasMessages', () => {
    beforeEach(() => {
      component.messages = [1];
      component.total = 2;
    });

    it ('should return true in hasMessages', () => {
      expect(component.hasMessages).toBeTruthy();
    });

    it ('should call loadChatHistory', () => {
      const loadChatHistorySpy = spyOn(TRACK_STUB, 'loadChatHistory');
      component.loadOlderMessages();
      expect(loadChatHistorySpy).toHaveBeenCalled();
    });
  });

  describe('onScroll', () => {
    const eventMock = {target: { scrollTop: 0 } };

    it ('should set scrollToNewMessages to false', () => {
      component.onScroll(eventMock);
      expect(component.scrollToNewMessages).toBeFalsy();
    });

    it ('should set scrollTop to 5', () => {
      component.onScroll(eventMock);
      expect(eventMock.target.scrollTop).toEqual(5);
    });
  });

  describe('getUser', () => {
    let selectSpy;

    beforeEach(() => {
      component.subscriptions = [];
      selectSpy = spyOn(STORE_STUB, 'select').and.returnValue(of({id: 1}));
    });

    it ('should select current-user', () => {
      component.getUser();
      expect(selectSpy).toHaveBeenCalledWith('current-user');
    });

    it ('should set user Id', () => {
      component.getUser();
      expect(component.userId).toEqual(1);
    });
  });

  it ('should call setLastReadMessage', () => {
    const setLastReadMessageSpy = spyOn(CHAT_SERVICE, 'setLastReadMessage');
    component.setLastReadMessage(1);
    expect(setLastReadMessageSpy).toHaveBeenCalled();
  });
});
