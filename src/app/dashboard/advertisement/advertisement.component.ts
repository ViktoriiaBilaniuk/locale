import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { fadeInAnimation } from '../../shared/animations/fade-in.animation';
import { Store } from '../../core/store/store';
import { Subscription } from 'rxjs';
import { ADS_NETWORKS, CONNECTION_TYPE } from '../connection-constants';
import { AdsService } from '../../core/services/ads/ads.service';
import { PermissionsService } from '../../core/services/permissions/permissions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from '../../shared/decorators/auto-unsubscribe';
import { ADS_DATE_TABS } from './ads-constants';

@Component({
  selector: 'sl-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss'],
  animations: [fadeInAnimation],
})
export class AdvertisementComponent implements OnInit, OnDestroy {
  @ViewChild('header') header: ElementRef;
  networks = ADS_NETWORKS;
  adsConnection = CONNECTION_TYPE.ADS;
  subscriptions: Array<Subscription> = [];
  venueId;
  visibleAddModal;
  loading;
  adsAccounts = [];
  datePreset = ADS_DATE_TABS[0].value;

  constructor(
    private adsService: AdsService,
    private permissionsService: PermissionsService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store) {
  }

  ngOnInit() {
    this.getVenueId();
    this.store.set('tutorialKey', 'ads');
  }

  getVenueId() {
    this.subscriptions.push(
      this.store.select('venueId')
        .subscribe((data) => {
          this.venueId = data;
          this.getAdsAccounts();
        })
    );
  }

  getAdsAccounts() {
    this.loading = true;
    this.subscriptions.push(this.adsService.getConnectedAdsAccounts(this.venueId, this.datePreset)
      .subscribe((data: any) => {
        this.setAccounts(data);
      }, (err: any) => {
        this.loading = false;
        this.handleError(err);
      })
    );
  }

  private handleError(err) {
    if (err.status === 403) {
      this.permissionsService.fetchPermissionsByVenue(this.venueId);
      this.router.navigate(['../details'], { relativeTo: this.route });
    }
  }

  setAccounts(data) {
    this.adsAccounts = data.list;
    this.loading = false;
    this.emulateClick();
  }

  emulateClick() {
    this.header.nativeElement.click();
  }

  openModal() {
    this.visibleAddModal = true;
  }

  closeModal() {
    this.visibleAddModal = false;
  }

  onConnectAdsAccounts() {
    this.getAdsAccounts();
    this.closeModal();
    this.emulateClick();
  }

  onDeleteAccount(id) {
    this.subscriptions.push(this.adsService.removeAdsAccount(this.venueId, id)
      .subscribe(() => {
        this.getAdsAccounts();
      })
    );
  }

  activateTab(datePreset) {
    this.datePreset = datePreset;
    this.getAdsAccounts();
  }

  ngOnDestroy () {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.store.set('tutorialKey', null);
  }
}
