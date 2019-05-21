import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONSTANTS } from '../../constants';

@Injectable()
export class NetworksService {
  oauthAdditionalForTwitter;
  oauthTokenForTwitter;

  constructor(
    private http: HttpClient) {
  }

  getAuthOptions(venueId, network) {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}channels/${venueId}/connect/${network}/auth-options`);
  }

  getChanelsList(venueId, network, params, oauthAdditionalForTwitter) {
    this.oauthAdditionalForTwitter = oauthAdditionalForTwitter;
    let query;
    if (network === 'twitter') {
      this.oauthTokenForTwitter = params.oauth_token;
      query = `oauth_token=${params.oauth_token}&oauth_additional=${oauthAdditionalForTwitter}&oauth_verifier=${params.oauth_verifier}`;
    } else {
      query = `code=${params.code}`;
    }
    return this.http.get(`${CONSTANTS.API_ENDPOINT}channels/${venueId}/connect/${network}/list?${query}`);
  }

  connectChannels(venueId, network, channels) {
    return this.http.post(`${CONSTANTS.API_ENDPOINT}channels/${venueId}/${network}/connect`, { channels: channels });
  }

  getConnectedChannels(venueId) {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}channels/${venueId}/list`);
  }

  removeChannel(venueId, channel) {
    return this.http.delete(`${CONSTANTS.API_ENDPOINT}channels/${venueId}/${channel.network}/remove/${channel.id}`);
  }

  reconnectChannel(venueId, channel, params, oauthAdditionalForTwitter) {
    let body;
    if (channel.network === 'twitter') {
      body = {
        oauth_token: params.oauth_token,
        oauth_additional: oauthAdditionalForTwitter,
        oauth_verifier: params.oauth_verifier
      };
    } else {
      body = {
        code: params.code,
      };
    }
    return this.http.patch(`${CONSTANTS.API_ENDPOINT}channels/${venueId}/${channel.network}/reconnect/${channel.id}`, body);
  }
}
