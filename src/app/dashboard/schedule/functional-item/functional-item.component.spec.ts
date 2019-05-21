import { FunctionalItemComponent } from './functional-item.component';
import { PUBLICATION_PROXY_SERVICE, ROUTE, ROUTER } from '../../../test/stubs/service-stubs';
import { PUBLICATION_COMPONENT } from '../../../test/stubs/comopnent-stubs';
import { FACEBOOK_DEFAULT_POST_TYPE, SRC_TYPE } from '../publication/publication.constants';

describe('FunctionalItemComponent', () => {

  let component;

  beforeEach(() => {
    component = new FunctionalItemComponent(ROUTER, PUBLICATION_PROXY_SERVICE, ROUTE);
    component.channels = [];
  });

  describe('closePostModal', () => {
    it ('should set visiblePostWindow to false', () => {
      component.closePostModal();
      expect(component.visiblePostWindow).toBeFalsy();
    });

    it ('should set closedWindow to true', () => {
      component.closePostModal();
      expect(component.closedWindow).toBeTruthy();
    });
  });

  describe('createClick', () => {
    it ('should set new value for fbPostType', () => {
      component.createClick();
      expect(PUBLICATION_PROXY_SERVICE.fbPostType.getValue()).toEqual(FACEBOOK_DEFAULT_POST_TYPE.title);
    });

    it ('should call setDateForPost', () => {
      const setDateForPostSpy = spyOn(component, 'setDateForPost');
      component.createClick(null, null, new Date());
      expect(setDateForPostSpy).toHaveBeenCalled();
    });

    it ('should init postAction', () => {
      component.createClick({_id: 1}, true, null);
      expect(component.postAction).toBeDefined();
    });

    it ('should call setPost', () => {
      const setPostSpy = spyOn(component, 'setPost');
      component.createClick({_id: 1}, true, null);
      expect(setPostSpy).toHaveBeenCalled();
    });

    it ('should define postToEdit', () => {
      spyOn(component, 'setPost');
      component.createClick({_id: 1}, true, null);
      expect(component.postToEdit).toBeDefined();
    });
  });

  it ('should call setDateForPost', () => {
    const setDateForPostSpy = spyOn(PUBLICATION_PROXY_SERVICE, 'setDateForPost');
    component.setDateForPost();
    expect(setDateForPostSpy).toHaveBeenCalled();
  });

  it ('should return channels length', () => {
    expect(component.channelsExists).toEqual(0);
  });

  it ('should set visiblePostWindow to true', () => {
    component.openPostModal();
    expect(component.visiblePostWindow).toBeTruthy();
  });

  it ('should set visibleConfirmWindow to false', () => {
    component.closeConfirmModal();
    expect(component.visibleConfirmWindow).toBeFalsy();
  });

  it ('should set visibleConfirmWindow to true', () => {
    component.openConfirmModal();
    expect(component.visibleConfirmWindow).toBeTruthy();
  });


  describe('onWindowClose', () => {
    let openConfirmModalSpy;

    beforeEach(() => {
      component.publicationComponent = PUBLICATION_COMPONENT;
      openConfirmModalSpy = spyOn(component, 'openConfirmModal');
    });

    it ('should call openConfirmModal', () => {
      component.openConfirmModal();
      expect(openConfirmModalSpy).toHaveBeenCalled();
    });
  });

  describe('setAlbumPost', () => {
    const postMock = {
      subtype: 'status',
      message: 'mess',
      subtype_meta: {album_name: 'album name'},
      date: new Date(),
      timezone: 'Europe/Kiev',
      mentions: []
    };

    beforeEach(() => {
      spyOn(component, 'albumFiles').and.returnValue([]);
    });

    it ('should set next value for post type', () => {
      component.setAlbumPost(postMock);
      expect(PUBLICATION_PROXY_SERVICE.fbPostType.getValue()).toEqual(postMock.subtype);
    });

    it ('should set description', () => {
      component.setAlbumPost(postMock);
      expect(PUBLICATION_PROXY_SERVICE.description).toEqual({value: postMock.message, valid: true});
    });

    it ('should set albumFiles', () => {
      component.setAlbumPost(postMock);
      expect(PUBLICATION_PROXY_SERVICE.albumFiles).toEqual([]);
    });

    it ('should set album name', () => {
      component.setAlbumPost(postMock);
      expect(PUBLICATION_PROXY_SERVICE.albumName).toEqual(postMock.subtype_meta.album_name);
    });

    it ('should set schedule date', () => {
      spyOn(PUBLICATION_PROXY_SERVICE, 'getTimezoneDate').and.returnValue(1);
      component.setAlbumPost(postMock);
      expect(PUBLICATION_PROXY_SERVICE.schedule.dateForEdit).toEqual(1);
    });

    it ('should set schedule timezone', () => {
      component.setAlbumPost(postMock);
      expect(PUBLICATION_PROXY_SERVICE.schedule.timezone).toEqual(postMock.timezone);
    });

    it ('should set mentions', () => {
      component.setAlbumPost(postMock);
      expect(PUBLICATION_PROXY_SERVICE.mentions).toEqual(postMock.mentions);
    });

  });

  describe('setSimplePost', () => {
    const postMock = {
      subtype: 'status',
      message: 'mess',
      date: new Date(),
      timezone: 'Europe/Kiev',
      mentions: []
    };

    beforeEach(() => {
      spyOn(component, 'fileObject').and.returnValue({});
    });

    it ('should set description', () => {
      component.setSimplePost(postMock);
      expect(PUBLICATION_PROXY_SERVICE.description).toEqual({value: postMock.message, valid: true});
    });

    it ('should set file', () => {
      component.setSimplePost(postMock);
      expect(PUBLICATION_PROXY_SERVICE.file).toEqual({});
    });

    it ('should set schedule date', () => {
      spyOn(PUBLICATION_PROXY_SERVICE, 'getTimezoneDate').and.returnValue(1);
      component.setSimplePost(postMock);
      expect(PUBLICATION_PROXY_SERVICE.schedule.dateForEdit).toEqual(1);
    });

    it ('should set schedule timezone', () => {
      component.setSimplePost(postMock);
      expect(PUBLICATION_PROXY_SERVICE.schedule.timezone).toEqual(postMock.timezone);
    });

    it ('should set mentions', () => {
      component.setSimplePost(postMock);
      expect(PUBLICATION_PROXY_SERVICE.mentions).toEqual(postMock.mentions);
    });

  });

  it ('should return true for isAlbumPost', () => {
    const postMock = {subtype: 'album'};
    expect(component.isAlbumPost(postMock)).toBeTruthy();
  });

  describe('fileObject', () => {
    const postMock = {
      type: 'picture',
      pictures: [1],
      video: 'video'
    };

    it ('should return object for picture', () => {
      const result = {url: postMock.pictures[0], type: SRC_TYPE.IMAGE, name: SRC_TYPE.IMAGE};
      expect(component.fileObject(postMock)).toEqual(result);
    });

    it ('should return object for video', () => {
      postMock.type = 'video';
      const result = {url: postMock.video, type: postMock.type};
      expect(component.fileObject(postMock)).toEqual(result);
    });

    it('should return null for text post', () => {
      postMock.type = 'text';
      expect(component.fileObject(postMock)).toEqual(null);
    });

  });

  it('should navigate to channels', () => {
    const navigationSpy = spyOn(ROUTER, 'navigate');
    component.redirectToChannels();
    expect(navigationSpy).toHaveBeenCalled();
  });

  describe('onCreatePost', () => {

    it ('should call emit on onPostCreate', () => {
      const emitSpy = spyOn(component.onPostCreate, 'emit');
      component.onCreatePost();
      expect(emitSpy).toHaveBeenCalled();
    });

    it ('should call closePostModal', () => {
      const closePostModalSpy = spyOn(component, 'closePostModal');
      component.onCreatePost();
      expect(closePostModalSpy).toHaveBeenCalled();
    });

  });

  describe('onCreateAndCopyPost', () => {

    it ('should call emit on onPostCreate', () => {
      const emitSpy = spyOn(component.onPostCreateAndCopy, 'emit');
      component.onCreateAndCopyPost();
      expect(emitSpy).toHaveBeenCalled();
    });

    it ('should set postAction to null', () => {
      component.onCreateAndCopyPost();
      expect(component.postAction).toEqual(null);
    });

  });

});
