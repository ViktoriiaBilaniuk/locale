import { Injectable } from '@angular/core';
import { CONSTANTS } from '../../constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdsService {
  oauthAdditionalForTwitter;
  oauthTokenForTwitter;

  constructor(
    private http: HttpClient) {
  }

  getAuthOptions(venueId, network) {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}marketing/ads/${venueId}/${network}/auth-options`);
  }

  getAdsList(venueId, network, params, oauthAdditionalForTwitter) {
    this.oauthAdditionalForTwitter = oauthAdditionalForTwitter;
    let query;
    if (network === 'twitter') {
      this.oauthTokenForTwitter = params.oauth_token;
      query = `oauth_token=${params.oauth_token}&oauth_additional=${oauthAdditionalForTwitter}&oauth_verifier=${params.oauth_verifier}`;
    } else {
      query = `code=${params.code}`;
    }
    return this.http.get(`${CONSTANTS.API_ENDPOINT}marketing/ads/${venueId}/${network}/assigned-accounts-list?${query}`);
  }

  connectAdsAccount(venueId, network, accounts) {
    return this.http.post(`${CONSTANTS.API_ENDPOINT}marketing/ads/${venueId}/${network}/connect-account`, { ad_accounts: accounts });
  }

  getConnectedAdsAccounts(venueId, datePreset) {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}marketing/ads/${venueId}/facebook/connected-accounts-list?date_preset=${datePreset}`);
  }

  removeAdsAccount(venueId, id) {
    return this.http.delete(`${CONSTANTS.API_ENDPOINT}marketing/ads/${venueId}/facebook/remove/${id}`);
  }


  reconnectAdsAccount(venueId, account, params, oauthAdditionalForTwitter) {
    let body;
    if (account.network === 'twitter') {
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
    return this.http.patch(`${CONSTANTS.API_ENDPOINT}marketing/ads/${venueId}/${account.network}/reconnect-account/${account.id}`, body);
  }
}
