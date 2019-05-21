import { throwError, BehaviorSubject, combineLatest } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as  moment from 'moment';
import * as  momentTimezone from 'moment-timezone';
import * as  jstz from 'jstimezonedetect';
import { VenueService } from '../../core/services/venue/venue.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackingSerivce } from '../../core/services/tracking/tracking.service';
import { Store } from '../../core/store/store';
import { PermissionsService } from '../../core/services/permissions/permissions.service';
import { CustomMetric } from '../../models/right-sidebar/customMetric';
import { MetricsResponse } from '../../models/metricsResponse';
import { fadeInAnimation } from '../../shared/animations/fade-in.animation';
import { AutoUnsubscribe } from '../../shared/decorators/auto-unsubscribe';
import { filter } from 'rxjs/internal/operators';
import { PerformanceService } from '../../core/services/performance/performance.service';
import { METRICS } from './performance-table/performance-table.constants';
import { PERIOD } from './performance.constants';

@Component({
  selector: 'sl-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss'],
  animations: [fadeInAnimation],
})
export class PerformanceComponent implements OnInit, OnDestroy {
  selectedChannel;
  venueServiceSubscription;
  postSubscription;
  posts: Array<any>;
  postsLoading;
  groupedPosts: Array<any>;
  postsIsOpen: Boolean;
  currentPostFilter = 'date';
  metrics$;
  fbMetrics = [];
  twitterMetrics = [];
  instagramMetrics = [];
  booking: any;
  landing: any;
  startDate: any;
  endDate: any;
  startDatePastUTC: any;
  endDatePastUTC: any;
  startDateUTC: any;
  endDateUTC: any;
  venueId: string;
  subscriptions = [];
  metricsLoaded = false;
  analiticsLoaded = false;
  isViewCodeModal = false;
  noLandingData;
  noBookingData;
  venuePublicId: string;
  type: string;
  tableSource: BehaviorSubject<any> = new BehaviorSubject(1);
  metricsGroupedByDate;
  metricsGroupedByDateInPast;
  currentMetricsArray;
  pastMetricsArray;
  metricsStream$;
  lastDayOfPastPeriodAfterPastPeriod;

  constructor(
    private venueService: VenueService,
    private route: ActivatedRoute,
    private router: Router,
    private track: TrackingSerivce,
    private store: Store,
    private permissionsService: PermissionsService,
    private performanceService: PerformanceService
  ) { }

  ngOnInit() {
    this.resetSeletedSources();
    this.subscriptions.push(this.store.select('venueId')
      .pipe(
        filter((res: any) => res)
      )
      .subscribe(venueId => {
        this.venueId = venueId;
        if (this.startDate && this.endDate) {
          this.showLoading();
          this.resetSeletedSources();
          this.resetMetricsGroupedByDate();
          this.fetchPerformanceMetrics();
          this.fetchCustomMetrics();
          this.fetchPerformanceMetricsGroupedByDate();
          this.fetchVenuePublicId();
        }
      }),
    );
    // this.store.set('tutorialKey', 'perfomance');
  }

  private unsubscribeFromMetrics() {
    if (this.metricsStream$) {
      this.metricsStream$.unsubscribe();
    }
  }

  private fetchPerformanceMetricsGroupedByDate() {
    this.unsubscribeFromMetrics();
    const currentMetrics$ = this.fetchPerformanceGroupByDate();
    const oneDayBeforeLastDayOfPastPeriod = moment.utc(this.startDatePastUTC).add(-1, 'days').valueOf();
    // const oneDayBeforeLastDayOfPastPeriod = this.startDatePastUTC;
    const pastMetrics$ = this.fetchPerformanceGroupByDateInPast(oneDayBeforeLastDayOfPastPeriod);
    const stream$ = combineLatest(currentMetrics$, pastMetrics$);
    this.metricsStream$ = stream$
      .subscribe((data: any) => {
        this.calculatePerformanceMetricsGroupedByDate(data, oneDayBeforeLastDayOfPastPeriod);
      }, (err) => this.handleError(err));
  }

  calculatePerformanceMetricsGroupedByDate(data, oneDayBeforeLastDayOfPastPeriod) {
    const pastData = data[1].list;
    const firstKey = Object.keys(data[1].list)[0];
    const lastDate = this.formatedDate(moment(oneDayBeforeLastDayOfPastPeriod));
    this.lastDayOfPastPeriodAfterPastPeriod = pastData[lastDate];
    if ( firstKey === lastDate) {
      delete pastData[lastDate];
    }
    this.fillMetricsGroupedByDateInPast(pastData);
    this.fillMetricsGroupedByDate(data[0].list);
  }

  private fetchPerformanceGroupByDate() {
    return this.venueService.fetchPerformance(this.venueId, this.startDateUTC, this.endDateUTC, true);
  }

  resetSeletedSources() {
    this.performanceService.selectedPerformanceSources.getValue().forEach((item: any) => item.selected = true);
  }

  private fetchPerformanceGroupByDateInPast(oneDayBeforeLastDayOfPastPeriod) {
    return this.venueService.fetchPerformance(this.venueId, oneDayBeforeLastDayOfPastPeriod, this.endDatePastUTC, true);
  }

  fillMetricsGroupedByDate(metrics) {
    this.fillFirstDate(metrics);
    const lastDate = this.getLastDate(PERIOD.CURRENT);
    this.metricsGroupedByDate = this.fillEmptyDates(metrics, lastDate, PERIOD.CURRENT);
  }

  fillMetricsGroupedByDateInPast(metrics) {
    this.fillFirstDateInPast(metrics);
    const lastDate = this.getLastDate(PERIOD.PAST);
    this.metricsGroupedByDateInPast = this.fillEmptyDates(metrics, lastDate, PERIOD.PAST);
  }

  private fillEmptyDates(metrics, lastDate, period) {
    const firstKey = this.getFirstDateKey(period);
    const filledMetrics = {};
    filledMetrics[firstKey] = metrics[firstKey];
    // dates
    const currentDate = this.getFirstDate(period);
    const previousDate = moment(currentDate).add(-1, 'days');

    // keys according to dates
    const currentDateKey = this.formatedDate(currentDate);
    const previousDateKey = this.formatedDate(previousDate);
    const lastDateKey = this.formatedDate(lastDate);

    return this.calculateEmptyDates(currentDate, previousDate, currentDateKey, previousDateKey, lastDateKey, filledMetrics, metrics);
  }

  calculateEmptyDates(currentDate, previousDate, currentDateKey, previousDateKey, lastDateKey, filledMetrics, metrics) {
    let i = 1;
    while ( currentDateKey !== lastDateKey ) {

      if (!this.isAllMetrics(metrics[currentDateKey])) {
        metrics[currentDateKey] = metrics[previousDateKey];
        filledMetrics[currentDateKey] = metrics[previousDateKey];
      } else {
        filledMetrics[currentDateKey] = metrics[currentDateKey];
      }
      // move current date to next day
      currentDate.add(1, 'days');
      currentDateKey = this.formatedDate(currentDate);

      // calculate previous day according to current day
      previousDate = moment(currentDate).add(-1, 'days');
      previousDateKey = this.formatedDate(previousDate);
      i++;
      if (i === 90) {
        break;
      }
    }
    return filledMetrics;
  }

  formatedDate(date) {
    return moment(date).format('YYYY-MM-DD');
  }

  private fillFirstDate(metrics) {
    const firstDate = this.getFirstDateKey(PERIOD.CURRENT);
    if (this.isAllMetrics(metrics[firstDate])) {
      return;
    }
    const reversedPastKeys = Object.keys(this.metricsGroupedByDateInPast).slice().reverse();
    let dateInPastWithAllMetrics;
    for ( const pastKey of reversedPastKeys) {
      if (this.isAllMetrics(this.metricsGroupedByDateInPast[pastKey])) {
        dateInPastWithAllMetrics = this.metricsGroupedByDateInPast[pastKey];
        break;
      }
    }
    metrics[firstDate] = dateInPastWithAllMetrics ? dateInPastWithAllMetrics : this.getEmptyMetrics();
  }

  getFirstDateKey(period) {
    return period === PERIOD.CURRENT ? this.formatedDate(this.startDateUTC) : this.formatedDate(this.startDatePastUTC);
  }

  getFirstDate(period) {
    return period === PERIOD.CURRENT ? moment(this.startDateUTC) : moment(this.startDatePastUTC);
  }

  getLastDate(period) {
    return period === PERIOD.CURRENT ? moment(this.endDateUTC) : moment(this.endDatePastUTC);
  }

  private fillFirstDateInPast(metrics) {
    const firstPastKey = this.getFirstDateKey(PERIOD.PAST);
    if (!this.isAllMetrics(metrics[firstPastKey])) {
      metrics[firstPastKey] = this.getEmptyMetrics();
    }
  }

  getEmptyMetrics() {
    const emptyMetrics = {};
    METRICS.forEach(metricName => {
      emptyMetrics[metricName] = 0;
    });
    return emptyMetrics;
  }



  isAllMetrics(metricsList) {
    if (!metricsList) {
      return false;
    }
    return METRICS.every(metric => {
      return !!Object.keys(metricsList).find(dayMetric => {
        return  dayMetric === metric;
      });
    });
  }

  private fetchVenuePublicId() {
    this.subscriptions.push(this.store.select('venue-details')
      .pipe(
        filter((res: any) => res.venue),
      )
      .subscribe((res: any) => this.venuePublicId = res.venue.public_id,
        (err) => console.log(err))
    );
  }

  get showSpinner() {
    return !this.metricsLoaded || !this.analiticsLoaded;
  }

  showLoading() {
    this.metricsLoaded = false;
    this.analiticsLoaded = false;
  }

  onViewPostClick(selectedChannel) {
    this.postsLoading = true;
    this.postsIsOpen = true;
    this.selectedChannel = selectedChannel;
    this.venueServiceSubscription = this.venueService
    .fetchPerformancePosts(this.venueId, this.startDate, this.endDate, 'date', selectedChannel.channel._id)
    .pipe(
      filter((posts: any) => posts)
    )
    .subscribe((posts: any) => {
      this.posts = posts.list;
      this.sortByDate();
      this.venueServiceSubscription.unsubscribe();
      this.postsLoading = false;
    });
  }

  private sortByDate() {
    this.groupedPosts = this.posts.sort((a, b) => moment(a.post.date).isAfter(b.post.date) ? 1 : -1);
  }

  closePerformanceModal() {
    this.postsIsOpen = false;
    this.currentPostFilter = 'date';
  }

  private fetchNewPosts(filterType) {
    this.postSubscription = this.venueService
      .fetchPerformancePosts(
        this.venueId,
        this.startDate,
        this.endDate,
        filterType,
        this.selectedChannel.channel._id
      )
      .subscribe((posts: any) => {
        this.posts = posts.list;
        this.postSubscription.unsubscribe();
      }, (err) => this.handleError(err));
  }

  onApplyFilter(filterType) {
    this.currentPostFilter = filterType;
    switch (filterType) {
      case 'date':
        this.sortByDate();
        break;
      case 'performance':
        this.fetchNewPosts('total_performing');
        this.groupedPosts = this.posts;
        break;
      case 'likes':
        this.fetchNewPosts('total_likes');
        this.groupedPosts = this.posts;
        break;
      case 'reach':
        this.fetchNewPosts('total_reach');
        this.groupedPosts = this.posts;
        break;
      default:
        break;
    }
  }

  private fetchPerformanceMetrics() {
    if (this.metrics$) {
      this.metrics$.unsubscribe();
    }
    this.metrics$ = this.venueService.fetchPerformance(this.venueId, this.startDate, this.endDate)
      .subscribe((data: MetricsResponse) => {
        this.instagramMetrics = data.list.filter(channel => channel.network === 'instagram');
        this.fbMetrics = data.list.filter(channel => channel.network === 'facebook');
        this.twitterMetrics = data.list.filter(channel => channel.network === 'twitter');
        this.metricsLoaded = true;
      }, (err) => this.handleError(err));
  }

  private handleError (err) {
    if (err.status === 403) {
      this.permissionsService.fetchPermissionsByVenue(this.venueId);
      this.router.navigate(['../details'], { relativeTo: this.route });
    }
    if (err.status === 404) {
      if (err.message.includes('landing')) {
        this.noLandingData = true;
        this.analiticsLoaded = true;
      }
      if (err.message.includes('booking')) {
        this.noBookingData = true;
      }
    }
    return throwError(err);
  }

  private fetchCustomMetrics () {
    this.resetData();
    this.fetchSLAnalytics('booking');
    this.fetchSLAnalytics('landing');
  }

  private fetchSLAnalytics(eventType) {
    const analyticsSubscription = this.venueService
      .fetchSlAnalytics(
        this.venueId,
        this.startDateUTC,
        this.endDateUTC,
        eventType
      )
      .subscribe((analytics: {list: Array<CustomMetric>}) => {
        this[eventType] = this.mapCustomAnalytics(analytics.list);
        analyticsSubscription.unsubscribe();
        this.analiticsLoaded = true;
        }, (err) => this.handleError(err)
      );
  }

  private mapCustomAnalytics (list: Array<CustomMetric>) {
    const localTimezone = (jstz as any).determine().name();
    return list.map((item) => {
      return ([ momentTimezone(item.date).tz(localTimezone).format('DD MMM'), item.previousValue, item.currentValue]);
    });
  }

  resetData() {
    this.noBookingData = false;
    this.noLandingData = false;
    this.booking = [];
    this.landing = [];
  }

  resetMetricsGroupedByDate() {
    this.metricsGroupedByDate = {};
    this.metricsGroupedByDateInPast = {};
  }

  onDateChange(event) {
    this.resetMetricsGroupedByDate();
    this.showLoading();

    const startDateString = event.startDate.year() + '-' + this.getDateValue((event.startDate.month() + 1)) + '-' +
      this.getDateValue(event.startDate.date());
    const endDateString = event.endDate.year() + '-' + this.getDateValue((event.endDate.month() + 1)) + '-' +
      this.getDateValue(event.endDate.date());

    this.startDate = moment(event.startDate).clone().startOf('day').valueOf();
    this.startDateUTC = moment.utc(startDateString).valueOf();

    this.endDate = moment(event.endDate).clone().endOf('day').valueOf();
    this.endDateUTC = moment.utc(endDateString).endOf('day').valueOf();

    this.setPastDateRange(this.startDateUTC, this.endDateUTC);
    this.track.socialPerformanceDateFiltered();
    this.fetchPerformanceMetrics();
    this.fetchPerformanceMetricsGroupedByDate();
    this.fetchCustomMetrics();
  }

  setPastDateRange(start, end) {
    const diff = moment(end).startOf('day').diff(moment(start).startOf('day'), 'days');

    this.endDatePastUTC = moment.utc(start).valueOf();
    this.startDatePastUTC = moment.utc(start).subtract(diff, 'days').valueOf();
  }

  getDateValue(value) {
    return value < 10 ? '0' + value : value;
  }

  get hasBookings () {
    return this.booking && this.booking.length && this.booking.filter((metric) => metric[1] || metric[2]).length;
  }

  get hasLandings () {
    return this.landing && this.landing.length && this.landing.filter((metric) => metric[1] || metric[2]).length;
  }

  showViewCodeModal(type: string) {
    this.type = type;
    this.isViewCodeModal = true;
  }

  closeViewCodeModal() {
    this.isViewCodeModal = false;
  }

  onSetTableSource(data) {
    this.tableSource.next(data);
    this.setSelectedSourcesIntoService();
  }

  setSelectedSourcesIntoService() {
    this.performanceService.selectedPerformanceSources.next(this.tableSource.getValue());
  }

  setMetricsGroupedByDate(data) {
    this.pastMetricsArray = data.pastMetricsArray;
    this.currentMetricsArray = data.currentMetricsArray;
  }

  ngOnDestroy () {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    // this.store.set('tutorialKey', null);
  }
}
