import { Subscription } from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { fadeInAnimation } from '../../shared/animations/fade-in.animation';
import { ALL_CHANNELS_FILTER } from './channels.constant';
import { NetworksService } from '../../core/services/networks/networks.service';
import { Store } from '../../core/store/store';
import { ChannelResponse } from '../../models/responses';
import { PermissionsService } from '../../core/services/permissions/permissions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators';
import { CHANNELS_NETWORKS, CONNECTION_TYPE } from '../connection-constants';

@Component({
  selector: 'sl-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
  animations: [fadeInAnimation],
})
export class ChannelsComponent implements OnInit, OnDestroy {

  @ViewChild('header') header: ElementRef;

  subscriptions: Array<Subscription> = [];
  networks = CHANNELS_NETWORKS;
  allNetworks = ALL_CHANNELS_FILTER;
  channelsConnection = CONNECTION_TYPE.CHANNELS;
  allChannels = [];
  channels = this.allChannels;
  visibleAddModal = false;
  loading;
  venueId;
  selectedNetworks = [];

  constructor(
    private networkService: NetworksService,
    private permissionsService: PermissionsService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store) {
  }

  ngOnInit() {
    this.allNetworks.forEach(network => network['selected'] = false);
    this.getVenueId();
    this.store.set('tutorialKey', 'channels');
  }

  getVenueId() {
    this.subscriptions.push(this.store.select('venueId')
      .pipe (
        filter((res: any) => res)
      )
      .subscribe(venueId => {
        this.venueId = venueId;
        this.getChannels();
      })
    );
  }

  private getChannels() {
    this.loading = true;
    this.subscriptions.push(this.networkService.getConnectedChannels(this.venueId)
      .subscribe((data: ChannelResponse) => {
        this.setChannels(data);
        this.checkRouteParams();
      }, (err: any) => {
        this.handleError(err);
      })
    );
  }

  private setChannels(data) {
    this.allChannels = data.list;
    this.setFilteredChannels();
    this.loading = false;
    this.emulateClick();
  }

  checkRouteParams() {
    this.route.queryParams
      .subscribe((params: any) => {
        if (params.openAddModal) {
          this.openModal();
          this.router.navigate([]);
        }
    });
  }

  private handleError(err) {
    if (err.status === 403) {
      this.permissionsService.fetchPermissionsByVenue(this.venueId);
      this.router.navigate(['../details'], { relativeTo: this.route });
    }
  }

  onChangeChannels(event) {
    this.selectedNetworks = event.map(item => item.network);
    this.setFilteredChannels();
  }

  setFilteredChannels() {
    if (this.selectedNetworks.length) {
      this.channels = this.allChannels.filter(channel => this.isSelectedNetwork(channel.network, this.selectedNetworks));
    } else {
      this.channels = this.allChannels;
    }
  }

  private isSelectedNetwork(channelType, selectedNetworks) {
    return selectedNetworks.filter(network => network === channelType).length;
  }

  openModal() {
    this.visibleAddModal = true;
  }

  closeModal() {
    this.visibleAddModal = false;
  }

  onConnectChannels() {
    this.getChannels();
    this.closeModal();
    this.emulateClick();
  }

  onRefreshData() {
    this.getChannels();
  }

  emulateClick() {
    this.header.nativeElement.click();
  }

  ngOnDestroy () {
    this.store.set('tutorialKey', null);
  }
}
