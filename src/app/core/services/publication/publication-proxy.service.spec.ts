import { PublicationProxyService } from './publication-proxy.service';
import { DESCRIPTION_TEXT_MOCK, SCHEDULE_MOCK } from '../../../test/mocks/schedule-mocks';
import { BehaviorSubject } from 'rxjs';
import { TWITTER_MAX_DESCRIPTION_COUNT } from '../../../dashboard/schedule/publication/publication.constants';
import { LINKED_POST_SERVICE, LINKIFY_SERVICE } from '../../../test/stubs/service-stubs';

describe('PublicationProxyService', () => {
  let service;
  const emptyScheduleMock = {
    timezone: null,
    utcTimestamp: null,
    error: false,
    dateForEdit: null
  };

  beforeEach(() => {
    service = new PublicationProxyService(LINKIFY_SERVICE);
    service.schedule = SCHEDULE_MOCK;
  });

  describe('clear current post', () => {

    it ('should clear file', () => {
      service.clearCurrentPost();
      expect(service.file).toBeNull();
    });

    it ('should clear albumFiles', () => {
      service.clearCurrentPost();
      expect(service.albumFiles).toEqual([]);
    });

    it ('should clear albumName', () => {
      service.clearCurrentPost();
      expect(service.albumName).toBe('');
    });

    it ('should clear description', () => {
      service.clearCurrentPost();
      expect(service.description).toBeNull();
    });

    it ('should clear selectedChannels', () => {
      service.clearCurrentPost();
      expect(service.selectedChannels).toBeNull();
    });

    it ('should clear schedule', () => {
      service.clearCurrentPost();
      expect(service.schedule).toEqual(emptyScheduleMock);
    });
  });

  it ('should return true in isScheduledPost', () => {
    expect(service.isScheduledPost()).toBeTruthy();
  });

  it('should return true in isImage', () => {
    service.file = {type: 'image'};
    expect(service.isImage()).toBeTruthy();
  });

  it('should return true in isVideo', () => {
    service.file = {type: 'video'};
    expect(service.isVideo()).toBeTruthy();
  });

  it('should return true in isFbAlbumPost', () => {
    service.fbPostType = new BehaviorSubject<any>('album');
    expect(service.isFbAlbumPost()).toBeTruthy();
  });

  it('should return true in isFbStatusPost', () => {
    service.fbPostType = new BehaviorSubject<any>('status');
    expect(service.isFbStatusPost()).toBeTruthy();
  });

  it('should return description value', () => {
    service.description = {value: 'value'};
    expect(service.descriptionValue()).toEqual('value');
  });

  it('should return true in validDescription', () => {
    service.description = {value: 'value', valid: true};
    expect(service.validDescription()).toBeTruthy();
  });

  it('should return true in isValidAlbumPost', () => {
    service.fbPostType = new BehaviorSubject<any>('album');
    service.albumFiles = [1];
    expect(service.isValidAlbumPost()).toBeTruthy();
  });

  it('should return true in validChannels', () => {
    service.selectedChannels = [1];
    expect(service.validChannels()).toBeTruthy();
  });

  it('should return true in isInstagram', () => {
    service.network = new BehaviorSubject<any>('instagram');
    expect(service.isInstagram()).toBeTruthy();
  });

  it('should return true in isFacebook', () => {
    service.network = new BehaviorSubject<any>('facebook');
    expect(service.isFacebook()).toBeTruthy();
  });

  it('should return true in isTwitter', () => {
    service.network = new BehaviorSubject<any>('twitter');
    expect(service.isTwitter()).toBeTruthy();
  });

  describe('should check description', () => {
    const descriptionResult = DESCRIPTION_TEXT_MOCK.slice(0, TWITTER_MAX_DESCRIPTION_COUNT);

    beforeEach(() => {
      service.network = new BehaviorSubject<any>('twitter');
      service.description = {value: DESCRIPTION_TEXT_MOCK, valid: true};
    });

    it('should truncate description', () => {
      service.checkPostData();
      expect(service.description.value).toEqual(descriptionResult);
    });
  });

  it('should return localFileUrl', () => {
    const fileMock = {url: 'url'};
    service.file = fileMock;
    expect(service.localFileUrl()).toEqual(fileMock.url);
  });

});
