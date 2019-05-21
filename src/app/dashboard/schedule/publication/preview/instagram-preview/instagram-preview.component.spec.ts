import { InstagramPreviewComponent } from './instagram-preview.component';
import { PUBLICATION_PROXY_SERVICE } from '../../../../../test/stubs/service-stubs';
import { DEFAULT_CHANNEL_NAME, TWITTER_DEFAULT_IMAGE_URL } from '../../publication.constants';

describe('InstagramPreviewComponent', () => {

  let component;

  beforeEach(() => {
    component = new InstagramPreviewComponent(PUBLICATION_PROXY_SERVICE);
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

  it ('should return isDate value', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'isScheduledPost').and.returnValue(true);
    expect(component.isDate()).toBeTruthy();
  });

  it ('should return true for isContent', () => {
    PUBLICATION_PROXY_SERVICE.file = 1;
    PUBLICATION_PROXY_SERVICE.albumFiles = [1];
    expect(component.isContent()).toBeTruthy();
  });
});
