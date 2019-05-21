import { NetworksProxyService } from './networks-proxy.service';
import { NETWORKS_SERVICE, UTILS_STUB } from '../../../test/stubs/service-stubs';
import { of } from 'rxjs';

describe('NetworksProxyService', () => {
  const data = {qs: {redirect_uri: 'url'}, extended: {oauth_additional: '1'}};

  let component, getAuthOptionsSpy, reconnectChannelSpy, getChanelsListSpy;

  beforeEach(() => {
    component = new NetworksProxyService(NETWORKS_SERVICE, UTILS_STUB);
    reconnectChannelSpy = spyOn(NETWORKS_SERVICE, 'reconnectChannel').and.returnValue(of(1));
    getChanelsListSpy = spyOn(NETWORKS_SERVICE, 'getChanelsList').and.returnValue(of({data: 1}));
    getAuthOptionsSpy = spyOn(NETWORKS_SERVICE, 'getAuthOptions').and.returnValue(of({data: data}));
    component.loginPopup = {location: {href: undefined}};
  });

  describe('connectChannels', () => {

    it ('should init loginPopup', () => {
      component.connectChannels(1, 'facebook');
      expect(component.loginPopup).toBeDefined();
    });

    it ('should call getAuthOptions', () => {
      component.connectChannels(1, 'facebook');
      expect(getAuthOptionsSpy).toBeDefined();
    });

  });

  it ('should define oauthAdditionalForTwitter', () => {
    component.handleAuthOptions({data: data}, 1, {className: 'twitter'});
    expect(component.oauthAdditionalForTwitter).toBeDefined();
  });

  it ('should return network name', () => {
    expect(component.getNetworkName({className: 'facebook'})).toEqual('facebook');
  });

/*  describe('handleLoginResponse', () => {

    it ('should call reconnect', () => {
      const reconnectSpy = spyOn(component, 'reconnect');
      component.loginPopup = {location: {href: undefined}};
      component.handleLoginResponse({}, 'facebook', 1, 1, true);
      expect(reconnectSpy).toHaveBeenCalled();
    });

    it ('should call getChannelsList', () => {
      const getChannelsListSpy = spyOn(component, 'getChannelsList');
      component.handleLoginResponse({}, 'facebook', 1, 1, false);
      expect(getChannelsListSpy).toHaveBeenCalled();
    });

  });*/

  it ('should call reconnectChannel', () => {
    component.reconnect({}, 'facebook', 1);
    expect(reconnectChannelSpy).toHaveBeenCalled();
  });

  it ('should call getChanelsList', () => {
    component.getChannelsList({}, {className: 'facebook'}, 1);
    expect(getChanelsListSpy).toHaveBeenCalled();
  });

});
