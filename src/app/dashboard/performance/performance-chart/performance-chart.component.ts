import { Component, ViewChild, ElementRef, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import * as  moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { DEFAULT_SECTION_COUNT, SECTION_COUNT } from './performance-chart.constants';
import { CHART_CONFIG } from '../../../shared/components/chart/chart.config';

@Component({
  selector: 'sl-main-chart',
  templateUrl: './performance-chart.component.html',
  styleUrls: ['./performance-chart.component.scss'],
})
export class PerformanceChartComponent implements OnChanges {
  @Input() tableSource: BehaviorSubject<any>;
  @Input() booking;
  @Input() webTraffic;
  @Input() startDate;
  @Input() endDate;
  @Input() pastMetrics;
  @Input() currentMetrics;

  initialLabels = [];
  labels = [];
  webTrafficData = [];
  bookingData = [];
  reachData = [];
  likesData = [];
  commentsData = [];
  sharesData = [];
  generalLength;
  intervalLength;
  defaultDotsCount = DEFAULT_SECTION_COUNT;
  reachDataArr = [];
  likesDataArr = [];
  commentsDataArr = [];
  sharesDataArr = [];
  reachOfLastDayPastPeriod;
  likesOfLastDayPastPeriod;
  commentsOfLastDayPastPeriod;
  sharesOfLastDayPastPeriod;
  chartConfig;
  isChart: boolean;
  chartSource = [];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes) {
    if (changes.webTraffic) {
      this.webTraffic = this.webTraffic.map(item => item[2]);
    }
    if (changes.booking) {
      this.booking = this.booking.map(item => item[2]);
    }
    this.resetChartData();
    this.calculateDataForChart();
  }

  getLastDayOfPastPeriod(pastMetrics) {
    if (pastMetrics && pastMetrics.length) {
      const lastDayOfPastPeriod = pastMetrics[pastMetrics.length - 1];
      this.getReachData(lastDayOfPastPeriod);
      this.getLikesData(lastDayOfPastPeriod);
      this.getCommentsData(lastDayOfPastPeriod);
      this.getSharesData(lastDayOfPastPeriod);
    }
  }

  getReachData(lastDayOfPastPeriod) {
    this.reachOfLastDayPastPeriod =
      lastDayOfPastPeriod.post_impressions_organic_unique +
      lastDayOfPastPeriod.post_impressions_paid_unique;
    this.reachData = this.currentMetrics.map(metric => metric.post_impressions_organic_unique + metric.post_impressions_paid_unique);
  }

  getLikesData(lastDayOfPastPeriod) {
    this.likesOfLastDayPastPeriod = (lastDayOfPastPeriod.post_likes || 0);
    this.likesData  = this.currentMetrics.map(metric => (metric.post_likes || 0));
  }

  getCommentsData(lastDayOfPastPeriod) {
    this.commentsOfLastDayPastPeriod = (lastDayOfPastPeriod.post_comments || 0) + (lastDayOfPastPeriod.twitter_mentions || 0);
    this.commentsData = this.currentMetrics.map(metric => {
      return (metric.post_comments || 0) + (metric.twitter_mentions || 0);
    });
  }

  getSharesData(lastDayOfPastPeriod) {
    this.sharesOfLastDayPastPeriod = (lastDayOfPastPeriod.post_shares || 0) + (lastDayOfPastPeriod.twitter_retweets || 0);
    this.sharesData = this.currentMetrics.map(metric => (metric.post_shares || 0) + (metric.twitter_retweets || 0));
  }

  calculateDataForChart() {
    this.setInitValues();
    const countedDots = this.defaultDotsCount * this.intervalLength;
    const missedNumber = this.generalLength - countedDots;
    for (let index = 0; index < this.generalLength - missedNumber; index += this.intervalLength) {
      const reachData = this.reachData.slice(index, this.intervalLength + index);
      this.reachDataArr.push(this.getValue(reachData));

      const likesData = this.likesData.slice(index, this.intervalLength + index);
      this.likesDataArr.push(this.getValue(likesData));

      const commentsData = this.commentsData.slice(index, this.intervalLength + index);
      this.commentsDataArr.push(this.getValue(commentsData));

      const sharesData = this.sharesData.slice(index, this.intervalLength + index);
      this.sharesDataArr.push(this.getValue(sharesData));

      const labels = this.initialLabels.slice(index, this.intervalLength + index);
      this.labels.push(this.getLabel(labels));
    }
    this.calculateWebTrafficAndBookingData();
    this.checkLastInterval(missedNumber);
    this.setChartConfig();
  }

  setChartConfig() {
    this.devideReachData();
    this.chartSource = [
      this.webTrafficData,
      this.bookingData,
      this.reachDataArr,
      this.likesDataArr,
      this.commentsDataArr,
      this.sharesDataArr
    ];
    this.chartConfig = CHART_CONFIG;
    this.chartConfig.data.labels = this.labels;
    this.cd.detectChanges();
  }

  devideReachData() {
    this.reachDataArr = this.reachDataArr.map(value => value / 1000);
  }

  getValue(array) {
    return (array.length === 1) ? array : array[array.length - 1];
  }

  getLabel(array) {
    return (array[0] === array[array.length - 1]) ? array[0] : array[0] + '-' + array[array.length - 1];
  }

  checkLastInterval(missedNumber) {
    if (this.isDividedIntoWhole(this.generalLength, this.defaultDotsCount)) {
      missedNumber < this.defaultDotsCount / 2 ? this.addToPreviousInterval(missedNumber) : this.addToNewInterval(missedNumber);
    } else {
      const entireValue = this.generalLength / this.defaultDotsCount;
      const remainderValue = this.generalLength % this.defaultDotsCount;
      missedNumber < entireValue / remainderValue ? this.addToPreviousInterval(missedNumber) : this.addToNewInterval(missedNumber);
    }
    this.getDiffBetweenValuesReach();
    this.getDiffBetweenValuesLikes();
    this.getDiffBetweenValuesComments();
    this.getDiffBetweenValuesShares();
  }

  isDividedIntoWhole(value1, value2) {
    return value1 % value2 === 0;

  }

  addToPreviousInterval(missedNumber) {
    const reachData = this.reachData.slice(this.reachData.length - missedNumber - this.intervalLength, this.reachData.length);
    this.reachDataArr[this.reachDataArr.length - 1] = this.getValue(reachData);
    const labels = this.initialLabels.slice(this.initialLabels.length - missedNumber - this.intervalLength, this.initialLabels.length);
    this.labels[this.labels.length - 1] = this.getLabel(labels);
    this.addValueToPrevious(missedNumber, 'likesData', 'likesDataArr' );
    this.addValueToPrevious(missedNumber, 'reachData', 'reachDataArr' );
    this.addValueToPrevious(missedNumber, 'commentsData', 'commentsDataArr' );
    this.addValueToPrevious(missedNumber, 'sharesData', 'sharesDataArr' );
    this.addTrafficToPrevious(missedNumber);
    this.addBookingToPrevious(missedNumber);
  }

  addValueToPrevious(missedNumber, from, to) {
    const array = this[from].slice(this[from].length - missedNumber - this.intervalLength, this[from].length);
    this[to][this[to].length - 1] = (this.getValue(array));
  }

  addToNewInterval(missedNumber) {
    const reachData = this.reachData.slice(this.reachData.length - missedNumber, this.reachData.length);
    this.reachDataArr.push(this.getValue(reachData));
    const labels = this.initialLabels.slice(this.initialLabels.length - missedNumber, this.initialLabels.length);
    this.labels.push(this.getLabel(labels));
    this.addValueToNewInterval(missedNumber, 'likesData', 'likesDataArr' );
    this.addValueToNewInterval(missedNumber, 'reachData', 'reachDataArr' );
    this.addValueToNewInterval(missedNumber, 'commentsData', 'commentsDataArr' );
    this.addValueToNewInterval(missedNumber, 'sharesData', 'sharesDataArr' );
    this.addTrafficToNew(missedNumber);
    this.addBookingToNew(missedNumber);
  }

  addValueToNewInterval(missedNumber, from, to) {
    const array = this[from].slice(this[from].length - missedNumber, this[from].length);
    this[to].push(this.getValue(array));
  }

  getDiffBetweenValuesReach() {
    this.reachDataArr = [this.reachOfLastDayPastPeriod, ...this.reachDataArr].map((reach, index, reachArray) => {
      if (reachArray[index + 1] || reachArray[index + 1] === 0) {
        return reachArray[index + 1] - reach;
      }
    }).filter(item => !isNaN(item));

  }

  getDiffBetweenValuesLikes() {
    this.likesDataArr = [this.likesOfLastDayPastPeriod, ...this.likesDataArr].map((like, index, likesArray) => {
      if (likesArray[index + 1] || likesArray[index + 1] === 0) {
        return likesArray[index + 1] - like;
      }
    }).filter(item => !isNaN(item));
  }

  getDiffBetweenValuesComments() {
    this.commentsDataArr = [this.commentsOfLastDayPastPeriod, ...this.commentsDataArr].map((comment, index, commentsArray) => {
      if (commentsArray[index + 1] || commentsArray[index + 1] === 0) {
        return commentsArray[index + 1] - comment;
      }
    }).filter(item => !isNaN(item));
  }

  getDiffBetweenValuesShares() {
    this.sharesDataArr = [this.sharesOfLastDayPastPeriod, ...this.sharesDataArr].map((share, index, sharesArray) => {
      if (sharesArray[index + 1] || sharesArray[index + 1] === 0) {
        return sharesArray[index + 1] - share;
      }
    }).filter(item => !isNaN(item));
  }

  addTrafficToPrevious(missedNumber) {
    const traffic = this.webTraffic.slice(this.webTraffic.length - missedNumber - this.intervalLength, this.webTraffic.length);
    this.webTrafficData[this.webTraffic.length - 1] = this.getTotalValue(traffic);
  }

  addBookingToPrevious(missedNumber) {
    const booking = this.booking.slice(this.booking.length - missedNumber - this.intervalLength, this.booking.length);
    this.bookingData[this.booking.length - 1] = this.getTotalValue(booking);
  }

  addTrafficToNew(missedNumber) {
    const traffic = this.webTraffic.slice(this.webTraffic.length - missedNumber, this.webTraffic.length);
    this.webTrafficData.push(this.getTotalValue(traffic));
  }

  addBookingToNew(missedNumber) {
    const booking = this.booking.slice(this.booking.length - missedNumber, this.booking.length);
    this.bookingData.push(this.getTotalValue(booking));
  }

  setInitValues() {
    this.getLastDayOfPastPeriod(this.pastMetrics);
    this.getDatesRange();
    this.splitChartSections();
  }

  calculateWebTrafficAndBookingData() {
    const countedDots = this.defaultDotsCount * this.intervalLength;
    const missedNumber = this.generalLength - countedDots;

    for (let index = 0; index < this.generalLength - missedNumber; index += this.intervalLength) {
      const webTrafficArray = this.webTraffic.slice(index, this.intervalLength + index);
      const bookingArray = this.booking.slice(index, this.intervalLength + index);
      this.webTrafficData.push(this.getTotalValue(webTrafficArray));
      this.bookingData.push(this.getTotalValue(bookingArray));
    }
  }

  getTotalValue(array) {
    const total = array.reduce((sum, value) => (sum += value), 0);
    return total;
  }

  getDatesRange() {
    this.initialLabels = [];
    const startDate = moment(this.startDate).subtract(1, 'day');
    const endDate = moment(this.endDate);
      while (startDate.add(1, 'days').diff(endDate) < 0) {
          this.initialLabels.push(startDate.clone().format('DD MMM'));
      }
  }

  splitChartSections() {
    this.generalLength = this.initialLabels.length;

    outer_loop:
    for (let index = 0; index < this.generalLength; index++) {
      const genLen = this.generalLength - index;
      for (let i = 0; i < SECTION_COUNT.length; i++ ) {
        if (genLen % SECTION_COUNT[i] === 0 ) {
          this.defaultDotsCount = SECTION_COUNT[i];
            break outer_loop;
        }
      }
    }

    this.intervalLength = Math.round((this.generalLength / this.defaultDotsCount)  - 0.5);
  }

  isData() {
    return ((this.booking && this.booking.length) || (this.webTraffic && this.webTraffic.length) || this.isTableSource() ||
      (this.currentMetrics && this.currentMetrics.length) || (this.pastMetrics && this.pastMetrics.length) )
      && (this.startDate && this.endDate);
  }

  isTableSource() {
    if (this.tableSource.getValue() && this.tableSource.getValue().length) {
      const values = this.tableSource.getValue();
      return values.some((value) => value.number);
    }
  }

  resetChartData() {
    this.labels = [];
    this.defaultDotsCount = 7;
    this.reachDataArr = [];
    this.likesDataArr = [];
    this.commentsDataArr = [];
    this.sharesDataArr = [];
    this.webTrafficData = [];
    this.bookingData = [];
  }

  isChartVisible(chart: boolean) {
    this.isChart = chart;
  }
}
