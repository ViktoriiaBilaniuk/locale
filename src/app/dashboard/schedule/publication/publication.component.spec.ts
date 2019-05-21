import { PublicationComponent } from './publication.component';
import {
  CHAT_SERVICE, CREATE_POST_SERVICE, LINKED_POST_SERVICE,
  POST_ERROR_HANDLER_SERVICE,
  PUBLICATION_PROXY_SERVICE,
  STORE_STUB,
  UTILS_STUB
} from '../../../test/stubs/service-stubs';
import { of } from 'rxjs';
import { NETWORKS } from './publication.constants';

describe('PublicationComponent', () => {

  let component;
  const channelsSectionComponentMock = {
    clearSelectedChannels() {}
  };

  beforeEach(() => {
    component = new PublicationComponent(
      PUBLICATION_PROXY_SERVICE,
      STORE_STUB,
      UTILS_STUB,
      CHAT_SERVICE,
      POST_ERROR_HANDLER_SERVICE,
      CREATE_POST_SERVICE,
      LINKED_POST_SERVICE);
    component.channelsSectionComponent = channelsSectionComponentMock;
  });

  describe('clearCurrentPost', () => {
    let clearCurrentPostSpy;
    const changesMock = {closedWindow: true};

    beforeEach(() => {
      component.postToEdit = null;
      PUBLICATION_PROXY_SERVICE.schedule.dateForEdit = false;
      clearCurrentPostSpy = spyOn(component, 'clearCurrentPost');
    });

    it('should call clearCurrentPost', () => {
      component.ngOnChanges(changesMock);
      expect(clearCurrentPostSpy).toHaveBeenCalled();
    });

  });

  describe('getVenueId', () => {

    beforeEach(() => {
      spyOn(STORE_STUB, 'select').and.returnValue(of('1'));
    });

    it ('should assign venueId', () => {
      component.ngOnInit();
      expect(component.venueId).toBeDefined();
    });

    it ('should assign venueId in createPostService', () => {
      component.ngOnInit();
      expect(CREATE_POST_SERVICE.venueId).toBeDefined();
    });

  });

  describe('activateTab', () => {

    beforeEach(() => {
      component.selectedNetwork = 'facebook';
    });

    it ('should set next value for network in publicationProxyService', () => {
      component.activateTab();
      expect(PUBLICATION_PROXY_SERVICE.network.getValue()).toEqual(component.selectedNetwork);
    });

  });

  it ('should return true from isFacebook', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'isFacebook').and.returnValue(true);
    expect(component.isFacebook()).toBeTruthy();
  });

  it ('should return true from isInstagram', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'isInstagram').and.returnValue(true);
    expect(component.isInstagram()).toBeTruthy();
  });

  it ('should return true from isTwitter', () => {
    spyOn(PUBLICATION_PROXY_SERVICE, 'isTwitter').and.returnValue(true);
    expect(component.isTwitter()).toBeTruthy();
  });

  it ('should return description', () => {
    const desc = 'desc';
    PUBLICATION_PROXY_SERVICE.description = desc;
    expect(component.description()).toEqual(desc);
  });

  it ('should return mentions', () => {
    const mentions = [];
    PUBLICATION_PROXY_SERVICE.mentions = mentions;
    expect(component.mentions()).toEqual(mentions);
  });

  describe('validStatus', () => {

    it ('should call fbValidStatus', () => {
      const fbValidStatusSpy = spyOn(component, 'fbValidStatus');
      spyOn(PUBLICATION_PROXY_SERVICE, 'networkValue').and.returnValue(NETWORKS.FACEBOOK);
      component.validStatus();
      expect(fbValidStatusSpy).toHaveBeenCalled();
    });

    it ('should call instaValidStatus', () => {
      const instaValidStatusSpy = spyOn(component, 'instaValidStatus');
      spyOn(PUBLICATION_PROXY_SERVICE, 'networkValue').and.returnValue(NETWORKS.INSTAGRAM);
      component.validStatus();
      expect(instaValidStatusSpy).toHaveBeenCalled();
    });

    it ('should call twitterValidStatus', () => {
      const twitterValidStatusSpy = spyOn(component, 'twitterValidStatus');
      spyOn(PUBLICATION_PROXY_SERVICE, 'networkValue').and.returnValue(NETWORKS.TWITTER);
      component.validStatus();
      expect(twitterValidStatusSpy).toHaveBeenCalled();
    });

  });

});
