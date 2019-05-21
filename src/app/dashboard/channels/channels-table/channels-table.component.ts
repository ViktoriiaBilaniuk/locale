import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { CHANNELS_COLUMN_NAMES } from '../channels.constant';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ChannelListFilter } from '../../../models/channelsListFilter';
import { NetworksService } from '../../../core/services/networks/networks.service';
import { NetworksProxyService } from '../../../core/services/networks/networks-proxy.service';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe';
import { filter } from 'rxjs/internal/operators';

@AutoUnsubscribe
@Component({
  selector: 'sl-channels-table',
  templateUrl: './channels-table.component.html',
  styleUrls: ['./channels-table.component.scss'],
})

export class ChannelsTableComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() totalCount;
  @Input() venueId;
  @Input() loading = true;
  @Output() onRefresh  = new EventEmitter();
  @Output() onAddChannelClick  = new EventEmitter();
  @ViewChild('channelTable') channelTable: ElementRef;
  columnNames = CHANNELS_COLUMN_NAMES;
  visibleConfirmWindow = false;
  private channelToDelete;
  private filter: BehaviorSubject<ChannelListFilter>;
  subscriptions: Array<Subscription> = [];

  constructor(
    private networksService: NetworksService,
    private networksProxy: NetworksProxyService,
    private cd: ChangeDetectorRef,
  ) {
    this.setupFilter();
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if (changes.data) {
      setTimeout(() => {
        this.getChannels();
      }, 0);
    }
  }

  private getChannels() {
    this.subscriptions.push(this.filter
      .pipe(
        filter((v: any) => v)
      )
      .subscribe((v) => {
        this.sorting(this.data, v.sortBy, v.sortOrder);
      })
    );
  }

  private sorting (array, sortOption, sortDirection) {
    sortOption = this.getSortBy(sortOption);
    if (sortDirection === 'asc') {
      array.sort((a, b) => {
        if (a[sortOption] > b[sortOption]) { return 1; }
        if (a[sortOption] < b[sortOption]) { return -1; }
      });
    } else {
      array.sort((a, b) => {
        if (b[sortOption] > a[sortOption]) { return 1; }
        if (b[sortOption] < a[sortOption]) { return -1; }
      });
    }
  }

  getSortBy(sortBy) {
    return sortBy === 'channel' ? 'name' : sortBy;
  }

  private setupFilter () {
    this.filter = new BehaviorSubject({
      sortBy: 'status',
      sortOrder: 'asc',
    });
  }

  get sortBy () {
    return this.filter.value.sortBy;
  }

  get sortOrder () {
    return this.filter.value.sortOrder;
  }

  getOrder(columnName) {
    return this.sortBy === columnName ? this.sortOrder : '';
  }

  getStatusName(status) {
    if (!status) {
      return;
    }
    return 'Channels.' + status;
  }

  sort (sortBy) {
    const filterValue = this.filter.value;
    if (filterValue.sortBy === sortBy) {
      filterValue.sortOrder = filterValue.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      filterValue.sortBy = sortBy;
      filterValue.sortOrder = 'asc';
    }
    this.filter.next(filterValue);
  }

  openConfirmModal(channelToDelete) {
    this.channelToDelete = channelToDelete;
    this.visibleConfirmWindow = true;
  }

  closeConfirmModal() {
    this.channelToDelete = undefined;
    this.visibleConfirmWindow = false;
  }

  removeChannel() {
    this.subscriptions.push(this.networksService.removeChannel(this.venueId, this.channelToDelete)
      .subscribe(() => {
        this.refreshData();
        this.closeConfirmModal();
      })
    );
  }

  reconnectClick(channel) {
    this.networksProxy.connectChannels(this.venueId, channel.network, true, channel);
    this.subscribeOnReconectStatus();
  }

  subscribeOnReconectStatus() {
    this.networksProxy.reconnectStatus
      .pipe(filter((res: any) => res))
      .subscribe(() => {
        this.cd.detectChanges();
        this.refreshData();
        this.networksProxy.reconnectStatus.next(false);
        this.emulateClick();
      });
  }

  emulateClick() {
    this.channelTable.nativeElement.click();
  }

  addChannelClick() {
    this.onAddChannelClick.emit();
  }

  refreshData() {
    this.onRefresh.emit();
  }
}
