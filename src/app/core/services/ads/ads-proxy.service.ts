import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AdsService } from './ads.service';
import { UtilsService } from '../utils/utils.service';
import { CustomWindow } from '../../../models/custom-window-model';

@Injectable({
  providedIn: 'root'
})
export class AdsProxyService {

  adsList = new BehaviorSubject({});
  reconnectStatus = new BehaviorSubject(false);
  oauthAdditionalForTwitter;
  loginPopup;
  loadingState = new BehaviorSubject(true);

  constructor(
    private adsService: AdsService,
    private utils: UtilsService
  ) { }

  connectAdsAccounts(venueId, network, reconnect?, channel?) {
    this.loginPopup = window.open('', '',
      `width=1200,height=800,resizable,scrollbars=yes,status=1,fullscreen=no,top=100,` +
      `left=300,toolbar=0,location=0, directories=0, status=0,location=no,menubar=0`);
    this.adsService.getAuthOptions(venueId, this.getNetworkName(network, reconnect))
      .subscribe((data: any) => {
        this.handleAuthOptions(data, venueId, network, reconnect, channel);
      });
  }

  getNetworkName(network, reconnect?) {
    return reconnect ? network : network.className;
  }

  handleAuthOptions(data, venueId, network, reconnect?, channel?) {
    if (this.getNetworkName(network, reconnect) === 'twitter') {
      this.oauthAdditionalForTwitter = data.data.extended.oauth_additional;
    }
    this.networkLogin(data.data, network, venueId, reconnect, channel);
  }

  networkLogin(data, network, venueId, reconnect?, channel?) {
    this.loginPopup.location.href = `${data.qs.redirect_uri}?url=${data.url}&` +
      `${this.getQuery(this.getNetworkName(network, reconnect), data)}`;
    (window as CustomWindow).setValue = (params) => {
      this.handleLoginResponse(params, network, venueId, this.oauthAdditionalForTwitter, reconnect, channel);
    };
  }

  handleLoginResponse(params, network, venueId, oauthAdditionalForTwitter?, reconnect?, channel?) {
    if (this.allParams(network, params)) {
      if (reconnect) {
        this.reconnect(params, network, venueId, oauthAdditionalForTwitter, reconnect, channel);
      } else {
        this.getAdsList(params, network, venueId, oauthAdditionalForTwitter);
      }
    } else {
      this.stopLoading();
    }
  }

  allParams(network, params) {
    if (network === 'twitter') {
      return !!params.oauth_token && !!params.oauth_verifier;
    } else {
      return !!params.code;
    }
  }

  stopLoading() {
    this.loadingState.next(false);
  }

  reconnect(params, network, venueId, oauthAdditionalForTwitter?, reconnect?, channel?) {
    this.adsService.reconnectAdsAccount(venueId, channel, params, oauthAdditionalForTwitter)
      .subscribe(() => {
        this.reconnectStatus.next(true);
      }, (err) => {
        if (err.status === 404) {
          this.utils.showErrorModal( `Channel not found. Please, login to ${this.getNetworkName(network, reconnect)} `
            + 'as channel`s admin.' );
          window.focus();
          self.focus();
          parent.focus();
          setTimeout(() => {
            document.getElementById('channelsHeader').click();
          });
        }
      });
  }

  getAdsList(params, network, venueId, oauthAdditionalForTwitter?) {
    this.adsService.getAdsList(venueId,  network.className, params, oauthAdditionalForTwitter)
      .subscribe( (res: any) => {
        const channels = {
          list: res.data,
          network: network
        };
        this.adsList.next(channels);
        window.focus();
        self.focus();
        parent.focus();
      });
  }


  private getQuery(network, data) {
    const redir = encodeURIComponent(data.qs.redirect_uri);
    if (network === 'twitter') {
      return `network=${network}&oauth_token=${data.qs.oauth_token}`;
    } else {
      return `network=${network}&client_id=${data.qs.client_id}&scope=${data.qs.scope}&state=${data.qs.state}&redirect_uri=${redir}`;
    }
  }
}
