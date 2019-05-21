import { PostComponent } from './post.component';
import { CHAT_SERVICE, TRACK_STUB } from '../../../../test/stubs/service-stubs';
import { ACTION_TYPE } from '../../publication/publication.constants';

describe('PostComponent', () => {
  let component;
  const postMock = {
    status: 'online',
    channels: [
      {network: 'facebook', name: 'name'}
    ],
    message: 'message',
    type: 'picture',
    pictures: [1],
    date: new Date()
  };

  beforeEach(() => {
    component = new PostComponent(CHAT_SERVICE, TRACK_STUB);
    component.post = postMock;
  });

  it ('should define showWarning', () => {
    component.ngOnInit();
    expect(component.showWarning).toBeDefined();
  });

  it ('should define canOpenChat', () => {
    component.ngOnInit();
    expect(component.canOpenChat).toBeDefined();
  });

  it ('should call chatOpenedFromPosts', () => {
    const chatOpenedFromPostsSpy = spyOn(TRACK_STUB, 'chatOpenedFromPosts');
    component.openChat();
    expect(chatOpenedFromPostsSpy).toHaveBeenCalled();
  });

  it ('should return media', () => {
    expect(component.media).toEqual([{ url: 1, type: 'picture' }]);
  });

  it ('should return channelsCount', () => {
    expect(component.channelsCount).toEqual(1);
  });

  it ('should set visibleDetailsWindow to true', () => {
    component.openDetailsModal();
    expect(component.visibleDetailsWindow).toBeTruthy();
  });

  describe('optionClick', () => {
    const option = {title: ACTION_TYPE.EDIT};

    it ('should call emit onEdit', () => {
      const emitSpy = spyOn(component.onEdit, 'emit');
      component.optionClick(option);
      expect(emitSpy).toHaveBeenCalled();
    });

    it ('should call emit onCopy', () => {
      option.title = ACTION_TYPE.COPY;
      const emitSpy = spyOn(component.onCopy, 'emit');
      component.optionClick(option);
      expect(emitSpy).toHaveBeenCalled();
    });

    it ('should call openConfirmModal', () => {
      option.title = ACTION_TYPE.DELETE;
      const openConfirmModalSpy = spyOn(component, 'openConfirmModal');
      component.optionClick(option);
      expect(openConfirmModalSpy).toHaveBeenCalled();
    });

  });

  describe('deleteClick', () => {

    it ('should emit post onDelete', () => {
      const emitSpy = spyOn(component.onDelete, 'emit');
      component.deleteClick();
      expect(emitSpy).toHaveBeenCalled();
    });

    it ('should call closeConfirmModal', () => {
      const closeConfirmModalSpy = spyOn(component, 'closeConfirmModal');
      component.deleteClick();
      expect(closeConfirmModalSpy).toHaveBeenCalled();
    });

  });

  it ('should set visibleDetailsWindow to false', () => {
    component.closeDetailsModal();
    expect(component.visibleDetailsWindow).toBeFalsy();
  });

  it ('should set visibleConfirmWindow to false', () => {
    component.closeConfirmModal();
    expect(component.visibleConfirmWindow).toBeFalsy();
  });

  it ('should set visibleConfirmWindow to true', () => {
    component.openConfirmModal();
    expect(component.visibleConfirmWindow).toBeTruthy();
  });

  describe('getPostStatus', () => {
    it ('should return status', () => {
      expect(component.getPostStatus('status')).toEqual('status');
    });

    it ('should return error status', () => {
      expect(component.getPostStatus('publish_error')).toEqual('Error');
    });

  });

  it ('should return post timezone', () => {
    component.post.timezone = 'timezone';
    expect(component.getPostTimezone()).toEqual(component.post.timezone);
  });

  it ('should return post timezone text', () => {
    component.post.timezone = null;
    expect(component.getPostTimezoneText()).toEqual('Local Time');
  });

  it ('should return true from isErrorPost', () => {
    component.post.status = 'publish_error';
    expect(component.isErrorPost()).toBeTruthy();
  });

});
