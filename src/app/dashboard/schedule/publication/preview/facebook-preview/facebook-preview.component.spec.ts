import { FacebookPreviewComponent } from './facebook-preview.component';
import { LINKED_POST_SERVICE, PUBLICATION_PROXY_SERVICE } from '../../../../../test/stubs/service-stubs';
import { DEFAULT_CHANNEL_NAME, TWITTER_DEFAULT_IMAGE_URL } from '../../publication.constants';

describe('FacebookPreviewComponent', () => {

  let component;

  beforeEach(() => {
    component = new FacebookPreviewComponent(PUBLICATION_PROXY_SERVICE, LINKED_POST_SERVICE);
  });

  it ('should init descriptionLimit', () => {
    component.ngOnChanges({desktopMode: undefined});
    expect(component.descriptionLimit).toBeDefined();
  });

  it ('should return isVideo value', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'isVideo').and.returnValue(true);
    expect(component.isVideo()).toBeTruthy();
  });

  it ('should return isImage value', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'isImage').and.returnValue(true);
    expect(component.isImage()).toBeTruthy();
  });

  it ('should return isImageOrAlbum value', () => {
    spyOn(component, 'isImage').and.returnValue(true);
    spyOn(PUBLICATION_PROXY_SERVICE, 'isValidAlbumPost').and.returnValue(true);
    expect(component.isImageOrAlbum()).toBeTruthy();
  });

  it ('should return localFileUrl value', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'localFileUrl').and.returnValue(true);
    expect(component.localFileUrl()).toBeTruthy();
  });

  describe('showMore', () => {

    it ('should increase descriptionLimit', () => {
      component.showMore();
      expect(component.descriptionLimit).toEqual(100000);
    });

    it ('should increase descriptionLimitRows', () => {
      component.showMore();
      expect(component.descriptionLimitRows).toEqual(10000);
    });

  });

  it ('should return image icon', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'getNetworkAvatarUrl').and.returnValue(TWITTER_DEFAULT_IMAGE_URL);
    expect(component.getImageUrl()).toEqual(TWITTER_DEFAULT_IMAGE_URL);
  });

  it ('should return channel name', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'getNetworkChannelName').and.returnValue(DEFAULT_CHANNEL_NAME);
    expect(component.getChannelName()).toEqual(DEFAULT_CHANNEL_NAME);
  });

  it ('should return channel link', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'getNetworkChannelLink').and.returnValue('link');
    expect(component.getChannelLink()).toEqual('link');
  });

  it ('should return value for isContent ', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'validDescription').and.returnValue(true);
    spyOn(PUBLICATION_PROXY_SERVICE, 'isFbStatusPost').and.returnValue(true);
    spyOn(PUBLICATION_PROXY_SERVICE, 'isValidAlbumPost').and.returnValue(true);
    PUBLICATION_PROXY_SERVICE.file = 1;
    expect(component.isContent()).toBeTruthy();
  });

  it ('should return numberOfPhotos', () => {
    PUBLICATION_PROXY_SERVICE.albumFiles = [1, 2];
    expect(component.numberOfPhotos()).toEqual(2);
  });

  it ('should return getNewPhotosText', () => {
    spyOn(component, 'numberOfPhotos').and.returnValue(2);
    expect(component.getNewPhotosText()).toEqual('newPhotos');
  });

  it ('should return isDate value', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'isScheduledPost').and.returnValue(true);
    expect(component.isDate()).toBeTruthy();
  });

  it ('should return isFbAlbumPost value', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'isFbAlbumPost').and.returnValue(true);
    expect(component.isFbAlbumPost()).toBeTruthy();
  });

  it ('should return isFbStatusPost value', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'isFbStatusPost').and.returnValue(true);
    expect(component.isFbStatusPost()).toBeTruthy();
  });

});
