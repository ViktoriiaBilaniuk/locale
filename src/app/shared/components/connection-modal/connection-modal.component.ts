import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ConnectionAdapterService } from '../../../core/services/connection-adapter/connection-adapter.service';
import { CONNECTION_TYPE } from '../../../dashboard/connection-constants';

@Component({
  selector: 'sl-connection-modal',
  templateUrl: './connection-modal.component.html',
  styleUrls: ['./connection-modal.component.scss']
})
export class ConnectionModalComponent {
  @ViewChild('modal') modal: ElementRef;
  @Output() close = new EventEmitter();
  @Output() onConnect = new EventEmitter();
  @Input() venueId;
  @Input() networks;
  @Input() connectionType;
  subscriptions: Array<Subscription> = [];
  networkSelected;
  selectedNetwork;
  list = [];
  loadingList;
  loadingStateSubscription;

  constructor(
    private connectionAdapterService: ConnectionAdapterService,
    private cd: ChangeDetectorRef) {
  }

  hideModal() {
    this.close.emit();
  }

  isChannelConnection() {
    return this.connectionType === CONNECTION_TYPE.CHANNELS;
  }

  isAdsConnection() {
    return this.connectionType === CONNECTION_TYPE.ADS;
  }

  startLoading() {
    this.loadingList = true;
  }

  endLoading() {
    this.loadingList = false;
  }

  connectClick(network) {
    this.startLoading();
    this.connectChannel(network);
  }

  connectChannel(network) {
    if (this.isChannelConnection()) {
      this.subscribeOnChannelLoadingState();
      this.connectionAdapterService.fetchChannels(this.venueId, network);
      this.subscribeOnChannelsList();
    }
    if (this.isAdsConnection()) {
      this.subscribeOnAdsLoadingState();
      this.connectionAdapterService.fetchAdsAccounts(this.venueId, network);
      this.subscribeOnAdsList();
    }
  }

  private subscribeOnChannelLoadingState() {
    this.loadingStateSubscription = this.connectionAdapterService.getChannelLoadingState()
      .subscribe((state) => {
        this.loadingList = state;
        this.cd.detectChanges();
      });
  }

  private subscribeOnAdsLoadingState() {
    this.loadingStateSubscription = this.connectionAdapterService.getAdsLoadingState()
      .subscribe((state) => {
        this.loadingList = state;
        this.cd.detectChanges();
      });
  }

  private subscribeOnChannelsList() {
    this.subscriptions.push(this.connectionAdapterService.getChannelsList()
      .pipe(
        filter((res: any) => res.list && res.network)
      )
      .subscribe(( data: any) => {
        this.setList(data.list, data.network);
      })
    );
  }

  set allListItemsChecked (value) {
    this.list.forEach((channel) => { channel.selected = value; });
  }

  getSelected () {
    return this.list.filter((value) => value.selected);
  }

  select (item) {
    item.selected = !item.selected;
  }

  selectChannelsClick() {
    if (this.getSelected().length) {
      this.startLoading();
      const list = Object.assign(this.getSelected().slice().map(item => {
        delete item.selected;
        return item;
      }));
      this.connectItems(list);
    }
  }

  private connectItems(list) {
    if (this.isChannelConnection()) {
      this.connectChannels(list);
    }
    if (this.isAdsConnection()) {
      this.connectAdsAccounts(list);
    }
  }

  private connectChannels(channels) {
    this.subscriptions.push(this.connectionAdapterService.connectChannels(this.venueId, this.selectedNetwork.className, channels)
      .subscribe(() => {
        this.onConnect.emit();
        this.endLoading();
      }, (err) => {
        this.emulateModalClick();
        this.hideModal();
      })
    );
  }

  private connectAdsAccounts(accounts) {
    this.subscriptions.push(this.connectionAdapterService.connectAdsAccounts(this.venueId, this.selectedNetwork.className, accounts)
      .subscribe(() => {
        this.onConnect.emit();
        this.endLoading();
      }, (err) => {
        this.emulateModalClick();
        this.hideModal();
      })
    );
  }

  emulateModalClick() {
    this.modal.nativeElement.click();
  }

  private subscribeOnAdsList() {
    this.subscriptions.push(this.connectionAdapterService.getAdsList()
      .pipe(
        filter((res: any) => res.list && res.network)
      )
      .subscribe((data: any) => {
        this.setList(data.list, data.network);
      })
    );
  }

  private setList(list, network) {
    this.setServiceListValue({});
    this.endLoading();
    this.list = list;
    this.selectedNetwork = network;
    this.networkSelected = true;
    this.cd.detectChanges();
  }

  private setServiceListValue(value) {
    if ( this.isChannelConnection() ) {
      this.connectionAdapterService.setChannelsListValue(value);
    }
    if (this.isAdsConnection()) {
      this.connectionAdapterService.setAdsAccountValue(value);
    }
  }

  getTitle() {
    if (this.isChannelConnection()) {
      return 'Channels.addChannel';
    }
    if (this.isAdsConnection()) {
      return 'Ads.addAdsAccount';
    }
  }

  getNoListTitle() {
    if (this.isChannelConnection()) {
      return 'Channels.noChannels';
    }
    if (this.isAdsConnection()) {
      return 'Ads.noAds';
    }
  }

  getNoListText() {
    if (this.isChannelConnection()) {
      return 'Channels.noLinkedChannelsText';
    }
    if (this.isAdsConnection()) {
      return 'Ads.noLinkedAdsText';
    }
  }

  getSelectText() {
    if (this.isChannelConnection()) {
      return 'Channels.selectChannel';
    }
    if (this.isAdsConnection()) {
      return 'Ads.selectAccount';
    }
  }

}
