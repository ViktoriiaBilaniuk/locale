import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VenueService } from '../../core/services/venue/venue.service';
import * as moment from 'moment';
import { Store } from '../../core/store/store';
import { TrackingSerivce } from './../../core/services/tracking/tracking.service';
import { PermissionsService } from '../../core/services/permissions/permissions.service';
import { fadeInAnimation} from '../../shared/animations/fade-in.animation';
import { STATUS_CONSTANTS } from '../../shared/components/status-filter/status-filter.constants';
import { AutoUnsubscribe } from '../../shared/decorators/auto-unsubscribe';
import { NetworksService } from '../../core/services/networks/networks.service';
import { Permissions } from '../../core/services/permissions/permissions.constant';
import { FunctionalItemComponent } from './functional-item/functional-item.component';
import { distinctUntilChanged, filter, finalize } from 'rxjs/internal/operators';
import { ACTION_TYPE } from './publication/publication.constants';
import { EXPAND, EXPAND_STATUS } from '../header/expand-chat/expand-constants';
import { VIEW_TAB } from './schedule-constants';
import { ViewTabsComponent } from './view-tabs/view-tabs.component';

@Component({
  selector: 'sl-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  animations: [fadeInAnimation],
})

export class ScheduleComponent implements OnInit, OnDestroy {
  @ViewChild(FunctionalItemComponent) functionalItemComponent: FunctionalItemComponent;
  @ViewChild(ViewTabsComponent) viewTabsComponent: ViewTabsComponent;
  posts: Array<any> = [];
  moment: any;
  filter: BehaviorSubject<any>;
  venue: any;
  maxDate: any;
  minDate: any;
  from: any;
  to: any;
  activeDate;
  loading;
  channels = [];
  publicationChannels = [];
  statuses = [];
  venueId;
  subscriptions: Array<Subscription> = [];
  postSubscription$;
  channelLoading;
  postManagementPermission;
  expandStatus;
  loadingOnDeletePost;
  tab = VIEW_TAB;
  activeTab;
  navigateToWeeklyViewFromMonthly = new BehaviorSubject(false);
  navigateToTodayOnWeekly = new BehaviorSubject(0);
  navigateToDay = new BehaviorSubject(0);

  constructor(
    private venueService: VenueService,
    private route: ActivatedRoute,
    private store: Store,
    private track: TrackingSerivce,
    private permissionsService: PermissionsService,
    private router: Router,
    private networksService: NetworksService,
    private cd: ChangeDetectorRef) {
    this.moment = moment;
  }

  ngOnInit() {
    this.subscribeOnExpandStatus();
    this.getVenueId();
    this.getPermissions();
    this.getVenueDetails();
    this.getPosts();
    this.setupDateFilterRange();
  }

  subscribeOnExpandStatus() {
    this.subscriptions.push(this.store.select(EXPAND)
      .pipe(
        filter((res: any) => res)
      )
      .subscribe(status => {
        this.expandStatus = status;
      })
    );
  }

  getVenueId() {
    this.subscriptions.push(this.store.select('venueId')
      .pipe(
        filter((res: any) => res)
      )
      .subscribe(venueId => {
        this.venueId = venueId;
        this.setupDateRange(this.initFromValue, this.initToValue);
      })
    );
  }

  getPermissions() {
    this.subscriptions.push(this.store.select('permissions')
      .pipe(
        filter((res: any) => res)
      )
      .subscribe((permissions) => {
        this.setPermissions(permissions);
      }));
  }

  setPermissions(permissions) {
    if (permissions.indexOf(Permissions.CHANNELS) !== -1) {
      this.getChannels();
    }
    this.postManagementPermission = (
      permissions.indexOf(Permissions.POST_MANAGEMENT) !== -1 &&
      permissions.indexOf(Permissions.CHANNELS) !== -1
    );
  }

  getChannels() {
    this.channelLoading = true;
    this.subscriptions.push(this.networksService.getConnectedChannels(this.venueId)
      .subscribe((data: any) => {
        this.channels = [...this.getSortedChannels(data.list, 'online'), ...this.getSortedChannels(data.list, 'offline') ];
        this.publicationChannels = this.channels.map(channel => ({...channel}));
        this.channels.forEach(item => item.selected = false);
        this.channelLoading = false;
      })
    );
  }

  getSortedChannels(data, status) {
    const channels = data.filter(item => item.status === status);
    return channels.sort((a, b) => a.name > b.name ? 1 : -1);
  }

  allChannelsAreDissconnected() {
    return (this.channels.every(channel => channel.status === 'offline') && this.channels.length);
  }

  private setupDateFilterRange () {
    this.setupMinMaxDateRange();
    this.setupDateRange(this.initFromValue, this.initToValue);
  }

  setupMinMaxDateRange() {
    this.maxDate = this.maxDateValue;
    this.minDate = this.minDateValue;
  }

  get maxDateValue() {
    return this.activeTab === this.tab.WEEKLY ?
      moment().add(1, 'months').endOf('months') :
      moment().add(1, 'months');
  }

  get minDateValue() {
    return this.activeTab === this.tab.WEEKLY ?
      moment().add(-3, 'months').startOf('months').startOf('isoWeek') :
      moment().add(-3, 'months');
  }

  setupDateRange(from, to) {
    this.from = from;
    this.to = to;
  }

  get initFromValue() {
    return this.activeTab === this.tab.WEEKLY ? this.initFromWeekValue : this.initFromMonthValue;
  }

  get initToValue() {
    return this.activeTab === this.tab.WEEKLY ? this.initToWeekValue : this.initToMonthValue;
  }

  get initFromWeekValue() {
    return moment().startOf('isoWeek').startOf('day');
  }

  get initToWeekValue() {
    return moment().startOf('isoWeek').add(1, 'week').add(-1, 'day').endOf('day');
  }

  get initFromMonthValue() {
    return moment().startOf('month').startOf('day');
  }

  get initToMonthValue() {
    return moment().endOf('month').endOf('day');
  }

  onPostCreate() {
    this.getVenuePosts(this.filter.getValue());
  }

  onPostCreateAndCopy() {
    this.fetchVenuePosts(this.filter.getValue());
  }

  private setupFilter() {
    this.filter = new BehaviorSubject<any>({
      from: this.initFromWeekValue,
      to: this.initToWeekValue,
      channels: [],
      statuses: this.initialStatuses
    });
    this.subscriptions.push(this.filter
      .pipe(
        distinctUntilChanged()
      )
      .subscribe(this.getVenuePosts.bind(this)));
  }

  private getVenueDetails () {
    this.subscriptions.push(this.store.select('venue-details')
      .pipe(
        filter((venue: any) => venue)
      )
      .subscribe((venue) => {
        this.venue = Object.assign({}, venue);
        this.channels = [...this.venue.channels];
        this.channels.forEach((channel) => {
          channel.selected = true;
        });
        this.setStatuses();
        this.setupFilter();
      }));
  }

  private setStatuses() {
    this.statuses = [...STATUS_CONSTANTS];
    this.statuses.forEach(status => status.selected = false);
  }

  get initialStatuses() {
    return this.statuses.map(st => st.status);
  }

  private getPosts () {
    this.subscriptions.push(this.store.select('venue-posts')
      .pipe(
        filter((posts: any) => posts)
      )
    .subscribe((posts) => {
      const postsList =  posts.filter((post) => !this.statusesFilter.length || this.statusesFilter.indexOf(post.status) !== -1);
      this.sortPosts(postsList);
    }));
  }

  sortPosts(posts) {
    this.posts = [
      ...this.filteredPosts(posts, 'publish_error'),
      ...this.filteredPosts(posts, 'unapproved'),
      ...this.filteredPosts(posts, 'scheduled'),
      ...this.filteredPosts(posts, 'published')
    ];
  }

  filteredPosts(posts, status) {
    return posts.filter(post => post.status === status);
  }

  private getVenuePosts ({from, to, channels}) {
    this.loading = true;
    this.fetchVenuePosts({from, to, channels});
  }

  private fetchVenuePosts({from, to, channels}) {
    if (this.postSubscription$) {
      this.postSubscription$.unsubscribe();
    }
    const fromDate = from.valueOf();
    const toDate = to.valueOf();
    this.postSubscription$ = this.venueService.fetchPosts(this.venue.id, fromDate, toDate, channels)
      .subscribe(() => {
          this.loading = false;
          this.cd.detectChanges();
        },
        (err) => {
          if (err.status === 403) {
            this.permissionsService.fetchPermissionsByVenue(this.venue.id);
            this.router.navigate(['../details'], { relativeTo: this.route });
          }
        });
  }

  get channelsFilter () {
    return this.filter
      .getValue().channels;
  }

  set channelsFilter (value) {
    this.filter.next({
      from : this.filter.getValue().from,
      to: this.filter.getValue().to,
      channels: value,
      statuses: this.statusesFilter
    });
  }

  get statusesFilter () {
    return this.filter
      .getValue().statuses;
  }

  set statusesFilter (value) {
    this.filter.next({from : this.fromFilter, to: this.toFilter, channels: this.channelsFilter, statuses: value});
  }

  get fromFilter() {
    if (!this.filter) {
      return;
    }
    return this.filter.getValue().from;
  }

  get toFilter() {
    if (!this.filter) {
      return;
    }
    return this.filter.getValue().to;
  }

  setDateFilter (value) {
    this.track.filterPosts('date');
    this.activeDate = value;
    this.setupNewFilter();
  }

  setupNewFilter() {
    if (!this.filter) {
      return;
    }
    this.filter.next({
      from : this.activeDate.from,
      to : this.activeDate.to,
      channels: this.channelsFilter,
      statuses: this.statusesFilter
    });
  }

  get venueName () {
    return this.venue ? this.venue.name : '';
  }

  get venueChannels () {
    return this.venue ? this.channels : [];
  }

  get postStatuses () {
    return this.venue ? this.statuses : [];
  }

  onChangeChannels (channels) {
    this.channelsFilter = channels;
    this.track.filterPosts('channel');
  }

  onChangeStatus (statuses) {
    const filteredStatuses = statuses.map((status) => status.status);
    this.statusesFilter = filteredStatuses;
  }

  onEditPost(post) {
    this.functionalItemComponent.createClick(post, ACTION_TYPE.EDIT);
  }

  onCopyPost(post) {
    this.functionalItemComponent.createClick(post, ACTION_TYPE.COPY);
  }

  onCreatePostClick(date) {
    this.functionalItemComponent.createClick(undefined, undefined, date);
  }

  onDeletePost(post) {
    this.loadingOnDeletePost = true;
    this.subscriptions.push(this.venueService.deleteScheduledPost(this.venueId, post.network, post._id)
      .pipe(
        filter((res: any) => res),
        finalize(() => this.loadingOnDeletePost = false)
      )
      .subscribe(() => this.getVenuePosts(this.filter.getValue())));
  }

  getRightMarginForFilters() {
    switch (this.expandStatus) {
      case EXPAND_STATUS.OPEN: return '0px';
      case EXPAND_STATUS.CLOSED: return '130px';
      case EXPAND_STATUS.EXPANDED: return '0px';
    }
  }

  navigateToToday() {
    this.navigateToTodayOnWeekly.next(Math.random());
    this.setupDateRange(this.initFromValue, this.initToValue);
    this.setDateFilter({from: this.initFromValue, to: this.initToValue});
  }

  onActivateViewTab(tab) {
    this.activeTab = tab;
    if (!this.navigateToWeeklyViewFromMonthly.getValue()) {
      this.setupDateRange(this.initFromValue, this.initToValue);
      this.setDateFilter({from: this.initFromValue, to: this.initToValue});
      this.setTutorialKey(this.activeTab);
    } else {
      this.setupDateRange(this.from, this.to);
      this.setDateFilter({from: this.from, to: this.to});
    }
    this.navigateToWeeklyViewFromMonthly.next(false);
    this.setupMinMaxDateRange();
  }

  onMonthDateClick(date) {
    this.navigateToWeeklyViewFromMonthly.next(true);
    this.navigateToDay.next(date);
    this.setupDateRange(this.getFromValue(date), this.getToValue(date));
    this.navigateToWeeklyView();
  }

  setTutorialKey(tab) {
  switch (tab) {
    case VIEW_TAB.WEEKLY:
      // this.store.set('tutorialKey', 'postsWeeklyView');
      break;
    case VIEW_TAB.MONTHLY:
      // this.store.set('tutorialKey', 'postsMonthlyView');
      break;
    default: return null;
    }
  }

  getFromValue(date) {
    return moment(date).startOf('isoWeek').startOf('day');
  }

  getToValue(date) {
    return moment(date).startOf('isoWeek').add(1, 'week').add(-1, 'day').endOf('day');
  }

  navigateToWeeklyView() {
    this.viewTabsComponent.selectTab(0);
  }

  ngOnDestroy () {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.postSubscription$.unsubscribe();
    this.store.set('tutorialKey', null);
  }
}
