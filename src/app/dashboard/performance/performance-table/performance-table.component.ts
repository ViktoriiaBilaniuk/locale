import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import {
  COLUMNS_CONSTANTS,
  TABLE_CONSTANTS,
  SOURCE
} from './performance-table.constants';
import { PerformanceService } from '../../../core/services/performance/performance.service';

@Component({
  selector: 'sl-performance-table',
  templateUrl: './performance-table.component.html',
  styleUrls: ['./performance-table.component.scss']
})
export class PerformanceTableComponent implements OnChanges {

  @Input() booking;
  @Input() landing;
  @Input() metricsGroupedByDate;
  @Input() metricsGroupedByDateInPast;
  @Input() lastDayOfPastPeriodAfterPastPeriod;
  @Output() tableData =  new EventEmitter();
  @Output() metricsGroupedByDateArray =  new EventEmitter();

  currentSocialReachNumber: number;
  pastSocialReachNumber: number;
  currentSocialLikesNumber: number;
  pastSocialLikesNumber: number;
  currentSocialCommentsNumber: number;
  pastSocialCommentsNumber: number;
  currentSocialSharesNumber: number;
  pastSocialSharesNumber: number;
  comparedPrev;
  comparisonPrev;
  tableSource = [];
  columnsLabel: string[] = COLUMNS_CONSTANTS;
  currentDateKeys = [];
  pastDateKeys = [];
  currentMetricsGroupedByDateArray = [];
  pastMetricsGroupedByDateArray = [];

  constructor(private performanceService: PerformanceService) {}

  ngOnChanges() {
    this.getMetricsGroupedByDate(this.metricsGroupedByDate, this.metricsGroupedByDateInPast);
    this.setTableSource();
    this.onSetMetrics();
  }

  getMetricsGroupedByDate(currentMetrics, pastMetrics) {
    this.getMetricsDateKeys(currentMetrics, pastMetrics);
    this.parseMetricsGroupedByDate(currentMetrics, pastMetrics);
    this.getSocialReachNumber();
    this.getSocialLikesNumber();
    this.getSocialComments();
    this.getSocialShares();
  }

  getSocialReachNumber() {
    const organic = this.currentMetricsGroupedByDateArray.map((item) => this.safeValue(item.post_impressions_organic_unique));
    const paid = this.currentMetricsGroupedByDateArray.map((item) => this.safeValue(item.post_impressions_paid_unique));
    this.currentSocialReachNumber = this.safeValue(organic[organic.length - 1] + paid[paid.length - 1]);

    const pastOrganic = this.pastMetricsGroupedByDateArray.map((item) => this.safeValue(item.post_impressions_organic_unique));
    const pastPaid = this.pastMetricsGroupedByDateArray.map((item) => this.safeValue(item.post_impressions_paid_unique));
    this.pastSocialReachNumber = this.safeValue(pastOrganic[pastOrganic.length - 1] + pastPaid[pastPaid.length - 1]);
  }

  getSocialLikesNumber() {
    const socialLikes = this.currentMetricsGroupedByDateArray.map((item) => this.safeValue(item.post_likes));
    this.currentSocialLikesNumber = this.safeValue(socialLikes[socialLikes.length - 1]);

    const pastSocialLikes = this.pastMetricsGroupedByDateArray.map((item) => this.safeValue(item.post_likes));
    this.pastSocialLikesNumber = this.safeValue(pastSocialLikes[pastSocialLikes.length - 1]);
  }

  getSocialComments() {
    const fbComments = this.currentMetricsGroupedByDateArray.map((item) => this.safeValue(item.post_comments));
    const twMentions = this.currentMetricsGroupedByDateArray.map((item) => this.safeValue(item.twitter_mentions));
    this.currentSocialCommentsNumber = this.safeValue(fbComments[fbComments.length - 1] + twMentions[twMentions.length - 1]);

    const pastFbComments = this.pastMetricsGroupedByDateArray.map((item) => this.safeValue(item.post_comments));
    const pastTwMentions = this.pastMetricsGroupedByDateArray.map((item) => this.safeValue(item.twitter_mentions));
    this.pastSocialCommentsNumber = this.safeValue(pastFbComments[pastFbComments.length - 1] + pastTwMentions[pastTwMentions.length - 1]);
  }

  getSocialShares() {
    const fbShares = this.currentMetricsGroupedByDateArray.map((item) => this.safeValue(item.post_shares));
    const twTweets = this.currentMetricsGroupedByDateArray.map((item) => this.safeValue(item.twitter_retweets));
    this.currentSocialSharesNumber = this.safeValue(fbShares[fbShares.length - 1] + twTweets[twTweets.length - 1]);

    const pastFbShares = this.pastMetricsGroupedByDateArray.map((item) => this.safeValue(item.post_shares));
    const pastTwTweets = this.pastMetricsGroupedByDateArray.map((item) => this.safeValue(item.twitter_retweets));
    this.pastSocialSharesNumber = this.safeValue(pastFbShares[pastFbShares.length - 1] + pastTwTweets[pastTwTweets.length - 1]);
  }

  parseMetricsGroupedByDate(currentMetrics, pastMetrics) {

    const reduceMetrics = (metricsObject) => {
      return (arr, key) => {
        arr.push(metricsObject[key]);
        return arr;
      };
    };

    this.currentMetricsGroupedByDateArray = this.currentDateKeys.reduce(reduceMetrics(currentMetrics), []);
    this.pastMetricsGroupedByDateArray = this.pastDateKeys.reduce(reduceMetrics(pastMetrics), []);
  }

  getMetricsDateKeys(currentMetrics, pastMetrics) {
    this.currentDateKeys = Object.keys(currentMetrics);
    this.pastDateKeys = Object.keys(pastMetrics);
  }

  selectSource(source) {
    source.selected = !source.selected;
    this.tableData.emit(this.tableSource);
  }

  get currentWebTrafficNumber() {
    const currentWebTrafficNumberArr = this.landing.map(item => item[2]);
    return this.getSum(currentWebTrafficNumberArr);
  }

  get prevWebTrafficNumber() {
    const prevWebTrafficNumberArr = this.landing.map(item => item[1]);
    return this.getSum(prevWebTrafficNumberArr);
  }


  get currentBookingNumber() {
    const currentBookingNumberArr = this.booking.map(item => item[2]);
    return this.getSum(currentBookingNumberArr);
  }

  get prevBookingNumber() {
    const prevBookingNumberArr = this.booking.map(item => item[1]);
    return this.getSum(prevBookingNumberArr);
  }

  getSum(array) {
    const total = array.reduce((sum, value) => (sum += value), 0);
    return total;
  }

  get selectedSourcesFromService() {
    return this.performanceService.selectedPerformanceSources.getValue();
  }

  getSourceValue(sourceName) {
    const value = TABLE_CONSTANTS.find(item => item.name === sourceName);
    const selectedState = this.selectedSourcesFromService.find(item => item.name === sourceName);
    if (selectedState && value) {
      value.selected = selectedState.selected;
    }
    const currentValue = this.safeValue(this.getCurrentValueNumber(sourceName));
    const lastPrevDiff = this.safeValue(this.calculateComparedToPrevious(
      this.getPreviousValueNumber(sourceName),
      this.getLastValueNumber(sourceName)
    ));
    const lastValue = this.safeValue(this.getLastValue(sourceName, currentValue, lastPrevDiff));
    const comparedPrev = this.calculateComparedToPrevious(
      currentValue,
      lastValue
    );
    const comparedLast = this.safeValue(this.calculateComparedToPrevious(
      this.getPreviousValueNumber(sourceName),
      this.getLastValueNumber(sourceName)
    ));

    const comparisonPrev = this.safeValue(this.getComparisonPrev(sourceName, comparedPrev, comparedLast, currentValue, lastValue));
    const className = this.getClass(currentValue, lastValue);
    return {
      ...value,
      number: currentValue,
      comparedPrev,
      comparisonPrev,
      className
    };
  }

  getLastValue(sourceName, currentValue, lastPrevDiff) {
    switch (sourceName) {
      case SOURCE.WEB_TRAFFIC || SOURCE.BOOKING: return this.getPreviousValueNumber(sourceName);
      default: return lastPrevDiff;
    }
  }

  getComparisonPrev(sourceName, comparedPrev, comparedLast, currentValue, lastValue) {
    switch (sourceName) {
      case SOURCE.WEB_TRAFFIC || SOURCE.BOOKING: return this.calculateComparisonToPreviousFprBookingAndLanding(
        currentValue,
        lastValue
      );
      default: return this.calculateComparisonToPrevious(
        comparedPrev,
        comparedLast
      );
    }
  }

  getCurrentValueNumber(sourceName) {
    switch (sourceName) {
      case SOURCE.WEB_TRAFFIC: return this.currentWebTrafficNumber;
      case SOURCE.BOOKING: return this.currentBookingNumber;
      case SOURCE.REACH: return this.currentSocialReachNumber - this.pastSocialReachNumber;
      case SOURCE.LIKES: return this.currentSocialLikesNumber - this.pastSocialLikesNumber;
      case SOURCE.COMMENTS: return this.currentSocialCommentsNumber - this.pastSocialCommentsNumber;
      case SOURCE.SHARES: return this.currentSocialSharesNumber - this.pastSocialSharesNumber;
    }
  }

  getPreviousValueNumber(sourceName) {
    switch (sourceName) {
      case SOURCE.WEB_TRAFFIC: return this.prevWebTrafficNumber;
      case SOURCE.BOOKING: return this.prevBookingNumber;
      case SOURCE.REACH: return this.pastSocialReachNumber;
      case SOURCE.LIKES: return this.pastSocialLikesNumber;
      case SOURCE.COMMENTS: return this.pastSocialCommentsNumber;
      case SOURCE.SHARES: return this.pastSocialSharesNumber;
    }
  }

  getLastValueNumber(sourceName) {
    if (!this.lastDayOfPastPeriodAfterPastPeriod) {
      return;
    }
    switch (sourceName) {
      case SOURCE.WEB_TRAFFIC: return this.prevWebTrafficNumber;
      case SOURCE.BOOKING: return this.prevBookingNumber;
      case SOURCE.REACH: return this.lastReach();
      case SOURCE.LIKES: return this.lastLikes();
      case SOURCE.COMMENTS: return this.lastComments();
      case SOURCE.SHARES: return this.lastShares();
    }
  }

  lastReach() {
    return this.safeValue(this.lastDayOfPastPeriodAfterPastPeriod.post_impressions_organic_unique) +
    this.safeValue(this.lastDayOfPastPeriodAfterPastPeriod.post_impressions_paid_unique);
  }

  lastLikes() {
    return this.safeValue(this.lastDayOfPastPeriodAfterPastPeriod.post_likes);
  }

  lastComments() {
    return this.safeValue(this.lastDayOfPastPeriodAfterPastPeriod.post_comments) +
      this.safeValue(this.lastDayOfPastPeriodAfterPastPeriod.twitter_mentions);
  }

  lastShares() {
    return this.safeValue(this.lastDayOfPastPeriodAfterPastPeriod.post_shares) +
      this.safeValue(this.lastDayOfPastPeriodAfterPastPeriod.twitter_retweets);
  }


  safeValue(value) {
    return value || 0;
  }

  calculateComparedToPrevious(currentNumber, pastNumber) {
    return currentNumber - pastNumber;
  }

  calculateComparisonToPrevious(currentNumber, pastNumber) {
    if (currentNumber === 0 && pastNumber === 0) {
      return 0;
    }
    return pastNumber === 0 ? 100 : currentNumber / pastNumber * 100;
  }

  calculateComparisonToPreviousFprBookingAndLanding(currentNumber, pastNumber) {
    if (currentNumber === 0 && pastNumber === 0) {
      return 0;
    }
    return pastNumber === 0 ? 100 : (currentNumber - pastNumber) / pastNumber * 100;
  }

  getClass(currentNumber, pastNumber) {
    return currentNumber > pastNumber ? 'green' : 'red';
  }

  setTableSource () {
    this.tableSource = [
      this.getSourceValue(SOURCE.WEB_TRAFFIC),
      this.getSourceValue(SOURCE.BOOKING),
      this.getSourceValue(SOURCE.REACH),
      this.getSourceValue(SOURCE.LIKES),
      this.getSourceValue(SOURCE.COMMENTS),
      this.getSourceValue(SOURCE.SHARES),
    ];
    this.tableData.emit(this.tableSource);
  }

  onSetMetrics() {
    this.metricsGroupedByDateArray.emit({
      pastMetricsArray: this.pastMetricsGroupedByDateArray,
      currentMetricsArray: this.currentMetricsGroupedByDateArray,
    });
  }

  get isData() {
    return Object.keys(this.metricsGroupedByDate).length &&
           Object.keys(this.metricsGroupedByDateInPast).length;
  }

}
