import { Injectable } from '@angular/core';
import { NetworksService } from '../networks/networks.service';
import { NetworksProxyService } from '../networks/networks-proxy.service';
import { AdsService } from '../ads/ads.service';
import { AdsProxyService } from '../ads/ads-proxy.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionAdapterService {

  constructor(
    private networkService: NetworksService,
    private networkProxy: NetworksProxyService,
    private adsService: AdsService,
    private adsProxy: AdsProxyService) {
  }

  // channels logic

  fetchChannels(venueId, network) {
    this.networkProxy.connectChannels(venueId, network);
  }

  getChannelsList() {
    return this.networkProxy.channelsList;
  }

  setChannelsListValue(value) {
    this.networkProxy.channelsList.next(value);
  }

  connectChannels(venueId, network, channels) {
    return this.networkService.connectChannels(venueId, network, channels);
  }

  getChannelLoadingState() {
    return this.networkProxy.loadingState;
  }

  // ads accounts logic

  fetchAdsAccounts(venueId, network) {
    this.adsProxy.connectAdsAccounts(venueId, network);
  }

  getAdsList() {
    return this.adsProxy.adsList;
  }

  setAdsAccountValue(value) {
    this.adsProxy.adsList.next(value);
  }

  connectAdsAccounts(venueId, network, channels) {
    return this.adsService.connectAdsAccount(venueId, network, channels);
  }

  getAdsLoadingState() {
    return this.adsProxy.loadingState;
  }
}
