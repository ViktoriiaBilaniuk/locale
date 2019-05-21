import { CreatePostService } from './create-post.service';
import {
  CHAT_SERVICE,
  PUBLICATION_PROXY_SERVICE,
  PUBLICATION_SERVICE,
  STORE_STUB
} from '../../../test/stubs/service-stubs';
import { BehaviorSubject, of } from 'rxjs';
import { ACTION_TYPE, SRC_TYPE } from '../../../dashboard/schedule/publication/publication.constants';

describe('CreatePostService', () => {
  let service;
  const emptySubject = new BehaviorSubject(undefined);

  beforeEach(() => {
    service = new CreatePostService(STORE_STUB, CHAT_SERVICE, PUBLICATION_SERVICE, PUBLICATION_PROXY_SERVICE );
    service.subscriptions = [];
    service.preSignedUrls$ = [];
  });

  describe('resetData', () => {

    it('should set postCreated to empty subject', () => {
      service.resetData();
      expect(service.postCreated.getValue()).not.toBeDefined();
    });

    it('should set subscriptions to empty array', () => {
      service.resetData();
      expect(service.subscriptions).toEqual([]);
    });

    it('should set preSignedUrls$ to empty array', () => {
      service.resetData();
      expect(service.preSignedUrls$).toEqual([]);
    });

    it('should set preSignedUrls to empty array', () => {
      service.resetData();
      expect(service.preSignedUrls).toEqual([]);
    });

    it('should set preSignedAlbumObjects to empty array', () => {
      service.resetData();
      expect(service.preSignedAlbumObjects).toEqual([]);
    });

  });

  describe('startPostCreating', () => {
    const action = 'copy';
    let createPostSpy;

    beforeEach(() => {
      spyOn(service, 'isSrcToLoad').and.returnValue(false);
      createPostSpy = spyOn(service, 'createPost').and.returnValue(true);
      PUBLICATION_PROXY_SERVICE.selectedChannels = [];
    });

    it('should set action', () => {
      service.startPostCreating(action);
      expect(service.action).toEqual(action);
    });

    it('', () => {
      service.startPostCreating(action);
      expect(createPostSpy).toHaveBeenCalled();
    });

  });

  describe('createPost', () => {
    let createAlbumPostSpy, makeSimplePostSpy;

    beforeEach(() => {
      createAlbumPostSpy = spyOn(service, 'createAlbumPost').and.returnValue(false);
      makeSimplePostSpy = spyOn(service, 'makeSimplePost').and.returnValue(false);
    });

    it('should call makeSimplePostSpy', () => {
      spyOn(service, 'isAlbumPost').and.returnValue(false);
      service.createPost();
      expect(makeSimplePostSpy).toHaveBeenCalled();
    });

    it('should call createAlbumPost', () => {
      spyOn(service, 'isAlbumPost').and.returnValue(true);
      service.createPost();
      expect(createAlbumPostSpy).toHaveBeenCalled();
    });

  });

  describe('makeSimplePost', () => {
    let editSimplePostSpy, createSimplePostSpy;

    beforeEach(() => {
      editSimplePostSpy = spyOn(service, 'editSimplePost').and.returnValue(false);
      createSimplePostSpy = spyOn(service, 'createSimplePost').and.returnValue(false);
    });

    it('should call makeSimplePostSpy', () => {
      spyOn(service, 'editAction').and.returnValue(false);
      service.makeSimplePost();
      expect(createSimplePostSpy).toHaveBeenCalled();
    });

    it('should call createAlbumPost', () => {
      spyOn(service, 'editAction').and.returnValue(true);
      service.makeSimplePost();
      expect(editSimplePostSpy).toHaveBeenCalled();
    });

  });

  it('it should return true from editAction', () => {
    service.action = {actionName: ACTION_TYPE.EDIT};
    expect(service.editAction()).toBeTruthy();
  });

  describe('edit and create post logic', () => {

    beforeEach(() => {
      service.action = {postId: 1};
      service.postCreated = emptySubject;
      spyOn(service, 'simplePost').and.returnValue({});
      spyOn(service, 'network').and.returnValue('facebook');
      spyOn(PUBLICATION_SERVICE, 'editPost').and.returnValue(of(1));
      spyOn(PUBLICATION_SERVICE, 'createPost').and.returnValue(of(1));
    });

    it('should set next value for postCreated from editSimplePost', () => {
      service.editSimplePost();
      expect(service.postCreated.getValue()).toEqual({data: 1});
    });

    it('should set next value for postCreated from createSimplePost', () => {
      service.createSimplePost();
      expect(service.postCreated.getValue()).toEqual({data: 1});
    });

  });

  describe('simplePostToEdit', () => {
    const timezoneMock = {timezone: 'Kiew/Ukraine'};
    const simplePostMock = {
      channels: [],
      ...timezoneMock
    };

    beforeEach(() => {
      spyOn(service, 'simplePost').and.returnValue(simplePostMock);
    });

    it('should return simplePostToEdit', () => {
      expect(service.simplePostToEdit()).toEqual(timezoneMock);
    });
  });

  it('should return description value', () => {
    PUBLICATION_PROXY_SERVICE.description = {value: 'desc'};
    expect(service.descriptionValue()).toEqual('desc');
  });

  describe('file type logic', () => {

    it('should return true for image type', () => {
      PUBLICATION_PROXY_SERVICE.file = {type: SRC_TYPE.IMAGE};
      expect(service.isPicture()).toBeTruthy();
    });

    it('should return true for video type', () => {
      PUBLICATION_PROXY_SERVICE.file = {type: SRC_TYPE.VIDEO};
      expect(service.isVideo()).toBeTruthy();
    });

    it('should return video type inside getSourceType', () => {
      expect(service.getSourceType(SRC_TYPE.VIDEO)).toEqual(SRC_TYPE.VIDEO);
    });

  });

  it('should return timezone', () => {
    PUBLICATION_PROXY_SERVICE.schedule.timezone = '1';
    expect(service.timezone()).toEqual('1');
  });

  it('should call basicPostObject ', () => {
    const basicPostObjectSpy = spyOn(service, 'basicPostObject').and.returnValue({});
    service.simplePost();
    expect(basicPostObjectSpy).toHaveBeenCalled();
  });

  describe('basicPostObject', () => {

    it('should call basicSchedulePost', () => {
      const basicSchedulePostSpy = spyOn(service, 'basicSchedulePost').and.stub();
      spyOn(service, 'isDate').and.returnValue(true);
      service.basicPostObject();
      expect(basicSchedulePostSpy).toHaveBeenCalled();
    });

    it('should call basicPost', () => {
      const basicPostSpy = spyOn(service, 'basicPost').and.returnValue({});
      spyOn(service, 'isDate').and.returnValue(true);
      service.basicPostObject();
      expect(basicPostSpy).toHaveBeenCalled();
    });
  });

  it('should return basic post', () => {
    const postMock = {
      message: '1',
      channels: [1],
      timezone: 1,
    };
    spyOn(service, 'descriptionValue').and.returnValue('1');
    spyOn(service, 'selectedChannelsIds').and.returnValue([1]);
    spyOn(service, 'timezone').and.returnValue(1);
    expect(service.basicPost()).toEqual(postMock);
  });

  it('should return basic scheduled post', () => {
    PUBLICATION_PROXY_SERVICE.schedule.utcTimestamp = 1;
    spyOn(service, 'basicPost').and.returnValue({});
    expect(service.basicSchedulePost()).toEqual({schedule_timestamp: 1});
  });

  it('should return selected channels ids', () => {
    const channelsMock = [{id: 1}];
    PUBLICATION_PROXY_SERVICE.selectedChannels = channelsMock;
    expect(service.selectedChannelsIds()).toEqual([1]);
  });

  describe('getSimplePostWithSrc', () => {
    const postMock = {image: 'url'};
    beforeEach(() => {
      spyOn(service, 'basicPostObject').and.returnValue({});
      spyOn(service, 'file').and.returnValue({url: 'url'});
    });

    it('should return post with file url', () => {
      service.preSignedUrls = [];
      expect(service.getSimplePostWithSrc('image')).toEqual(postMock);
    });

    it('should return post with presigned url', () => {
      service.preSignedUrls = [{file_url: 'url'}];
      expect(service.getSimplePostWithSrc('image')).toEqual(postMock);
    });

  });

  describe('isSrcToLoad', () => {

    beforeEach(() => {
      spyOn(service, 'isAlbumPost').and.returnValue(false);
    });

    it('should return true', () => {
      PUBLICATION_PROXY_SERVICE.file.file = 1;
      expect(service.isSrcToLoad()).toBeTruthy();
    });

    it('should return false', () => {
      PUBLICATION_PROXY_SERVICE.file = {};
      expect(service.isSrcToLoad()).toBeFalsy();
    });

  });


  it('should return true from isSrcToLoadInAlbum', () => {
    PUBLICATION_PROXY_SERVICE.albumFiles = [{file: 1}];
    expect(service.isSrcToLoadInAlbum()).toBeTruthy();
  });

  it('should return true from isAlbumPost', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'isFacebook').and.returnValue(true);
    spyOn(PUBLICATION_PROXY_SERVICE, 'isFbAlbumPost').and.returnValue(true);
    expect(service.isAlbumPost()).toBeTruthy();
  });

  it('should return file', () => {
    const fileMock = {file: 1};
    PUBLICATION_PROXY_SERVICE.file = fileMock;
    expect(service.file()).toEqual(fileMock);
  });

  it('should call getPreSignedUrl method', () => {
    spyOn(service, 'isAlbumPost').and.returnValue(false);
    spyOn(service, 'file').and.returnValue({file: 1});
    spyOn(service, 'getPresignedUrls').and.returnValue(of({}));
    const getPreSignedUrlSpy = spyOn(PUBLICATION_SERVICE, 'getPreSignedUrl').and.returnValue(of({}));
    service.loadSources();
    expect(getPreSignedUrlSpy).toHaveBeenCalled();
  });

  it('should call getPreSignedUrl method for each file', () => {
    PUBLICATION_PROXY_SERVICE.albumFiles = [{file: 1}, {file: 1}];
    const getPreSignedUrlSpy = spyOn(PUBLICATION_SERVICE, 'getPreSignedUrl').and.returnValue(of({}));
    service.loadAlbumSources();
    expect(getPreSignedUrlSpy).toHaveBeenCalledTimes(2);
  });

  it('should define preSignedAlbumObjects', () => {
    PUBLICATION_PROXY_SERVICE.albumFiles = [{file: {desc: 'desc', file: 1}}];
    service.getPreSignedObject([{data: {file_url: 'url'}}]);
    expect(service.preSignedAlbumObjects).toBeDefined();
  });

  it('should define preSignedUrls', () => {
    service.setPreSignedUrls([{data: 1}]);
    expect(service.preSignedUrls).toBeDefined();
  });

  it('should return file object with loadded source', () => {
    const fileMock = {
      desc: 'desc',
      url: 'url'
    };
    const postMock = {
      desc: fileMock.desc,
      url: fileMock.url
    };
    expect(service.getFileObjectWithLoaddedSrc(fileMock)).toEqual(postMock);

  });

  it('should return network value', () => {
    const network = 'facebook';
    PUBLICATION_PROXY_SERVICE.network = new BehaviorSubject(network);
    expect(service.network()).toEqual(network);
  });

});
