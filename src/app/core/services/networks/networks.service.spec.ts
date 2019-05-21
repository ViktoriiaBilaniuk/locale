import { NetworksService } from './networks.service';
import { HttpClient } from '@angular/common/http';
import { CONSTANTS } from '../../constants';

describe('NetworksService', () => {

  let service;
  const http = new HttpClient(null);

  beforeEach(() => {
    service = new NetworksService(http);
  });

  it ('should get auth options', () => {
    const getAuthOptionsSpy = spyOn(http, 'get');
    service.getAuthOptions(1, 'facebook');
    expect(getAuthOptionsSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}channels/1/connect/facebook/auth-options`);
  });

  describe('getChanelsList', () => {
    it ('should get channels list for twitter', () => {
      const params = {
        oauth_token: 'oauth_token',
        oauth_additional: 'oauth_additional',
        oauth_verifier: 'oauth_verifier',
      };
      const getChanelsListSpy = spyOn(http, 'get');
      service.getChanelsList(1, 'twitter', params, 'oauthAdditionalForTwitter');
      const query = `oauth_token=${params.oauth_token}&oauth_additional=oauthAdditionalForTwitter&oauth_verifier=${params.oauth_verifier}`;
      expect(getChanelsListSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}channels/1/connect/twitter/list?${query}`);
    });

    it ('should get channels list for fb&instagram', () => {
      const params = {
        code: 'code',
      };
      const getChanelsListSpy = spyOn(http, 'get');
      service.getChanelsList(1, 'facebook', params, 'oauthAdditionalForTwitter');
      const query = `code=${params.code}`;
      expect(getChanelsListSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}channels/1/connect/facebook/list?${query}`);
    });

  });

  it ('should connect channel', () => {
    const connectChannelsSpy = spyOn(http, 'post');
    service.connectChannels(1, 'facebook', []);
    expect(connectChannelsSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}channels/1/facebook/connect`, { channels: [] });
  });

  it ('should return connected channels', () => {
    const getConnectedChannelsSpy = spyOn(http, 'get');
    service.getConnectedChannels(1);
    expect(getConnectedChannelsSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}channels/1/list`);
  });

  it ('should remove channel', () => {
    const removeChannelSpy = spyOn(http, 'delete');
    service.removeChannel(1, {id: 1, network: 'facebook'});
    expect(removeChannelSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}channels/1/facebook/remove/1`);
  });

  describe('reconnectChannel', () => {
    it ('should reconnect twitter channel', () => {
      const params = {
        oauth_token: 'oauth_token',
        oauth_verifier: 'oauth_verifier',
      };
      const channel = {
        network: 'twitter',
        id: 1
      };
      const body = {
        oauth_token: 'oauth_token',
        oauth_additional: 'oauthAdditionalForTwitter',
        oauth_verifier: 'oauth_verifier',
      };
      const reconnectSpy = spyOn(http, 'patch');
      service.reconnectChannel(1, channel, params, 'oauthAdditionalForTwitter');
      expect(reconnectSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}channels/1/${channel.network}/reconnect/1`, body);
    });

    it ('should reconnect fb & insta channel', () => {
      const params = {
        code: 'code',
      };
      const channel = {
        network: 'facebook',
        id: 1
      };
      const reconnectSpy = spyOn(http, 'patch');
      service.reconnectChannel(1, channel, params, 'oauthAdditionalForTwitter');
      expect(reconnectSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}channels/1/${channel.network}/reconnect/1`, params);
    });
  });
});
