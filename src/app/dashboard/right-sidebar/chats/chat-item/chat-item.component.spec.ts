import { ChatItemComponent } from './chat-item.component';
import { CHAT_SERVICE, TRACK_STUB } from '../../../../test/stubs/service-stubs';
import * as moment from 'moment';
import { CHAT_MOCK, EXPANDED_CHAT_MOCK } from '../../../../test/mocks/chats-mocks';

describe('ChatItemComponent', () => {

  let component;

  beforeEach(() => {
    component = new ChatItemComponent(CHAT_SERVICE, TRACK_STUB);
  });

  describe('getFormattedDate', () => {

    it('should return empty string', () => {
      expect(component.getFormattedDate()).toEqual('');
    });

    it('should return formated date', () => {
      expect(component.getFormattedDate(1541581997223)).toEqual('07/11/2018');
    });

  });

  it('should return formated false', () => {
    const date = moment.unix(1541581997223 / 1000);
    expect(component.getIsTodaysMessage(date)).toBeFalsy();
  });



  describe('getChatName', () => {

    beforeEach(() => {
      component.userId = 1;
    });

    it('should return name for general chat', () => {
      expect(component.getChatName(EXPANDED_CHAT_MOCK)).toEqual('Chat.general');
    });

    it('should return chat name', () => {
      expect(component.getChatName(CHAT_MOCK)).toEqual('name');
    });

  });

  it('should return image url', () => {
    expect(component.getUserImage(CHAT_MOCK)).toEqual('url');
  });



  describe('chatClick', () => {

    beforeEach(() => {
      component.chat = CHAT_MOCK;
    });

    it('should call openChat', () => {
      const openChatSpy = spyOn(TRACK_STUB, 'openChat');
      component.chatClick();
      expect(openChatSpy).toHaveBeenCalled();
    });

    it('should set new selectedChat value', () => {
      component.chatClick();
      expect(CHAT_SERVICE.selectedChat.getValue()).toEqual(CHAT_MOCK);
    });

    it('should set new selectedChatId value', () => {
      component.chatClick();
      expect(CHAT_SERVICE.selectedChatId).toEqual(1);
    });

  });

  it('should return last message', () => {
    component.chat = CHAT_MOCK;
    expect(component.lastMessage).toEqual('content');
  });

});
