import {Component, Input, OnChanges, OnInit, Output, EventEmitter} from '@angular/core';
import {FB_COLUMN_NAMES, INSTAGRAM_COLUMN_NAMES, TWITTER_COLUMN_NAMES} from '../performance.constants';
import {fadeInAnimation} from '../../../shared/animations/fade-in.animation';

@Component({
  selector: 'sl-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss'],
  animations: [fadeInAnimation],
})
export class SocialMediaComponent implements OnInit, OnChanges {
  @Input() mediaType;
  @Input() data;
  @Output() selectChannel = new EventEmitter();
  facebookColumns = FB_COLUMN_NAMES;
  instagramColumns = INSTAGRAM_COLUMN_NAMES;
  tweetterColumns = TWITTER_COLUMN_NAMES;
  calculated;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if (changes.data && this.data && this.data.length) {
      this.calculateMetrics();
    } else {
      this.calculated = true;
    }
  }

  onViewPosts(selectedChannel) {
    if (selectedChannel.metrics.fb_post_count) {
      this.selectChannel.emit(selectedChannel);
    }
  }

  calculateMetrics() {
    this.calculated = false;
    this.data.map(item => {
      item.name = item.channel.name;
      item.metrics = this.convertMetricsToObject(item.metrics);

      const paidCount = item.metrics.page_impressions_paid_unique || 0;
      const organicCount = item.metrics.page_impressions_organic_unique || 0;
      const totalCount = paidCount + organicCount;

      item.paidPercent = Math.round((paidCount / (totalCount || 1) * 100));
      item.metrics.facebook_total_reach = totalCount;
      item.metrics.facebook_total_reach_gain = this.calculateTotalReachGain(totalCount, item.metrics);
    });
    this.calculated = true;
  }

  private convertMetricsToObject(metrics: {metric: string, total: number}[]): any {
    return metrics.reduce((memo, item, index) => {
      if (this.isMetric(item.metric)) {
        const gain = metrics.find((metric) => metric.metric === `${item.metric}_gain`);
        memo[`${item.metric}_gain_percent`] = this.calculateMetricGain(item.total, (gain ? gain.total : 0));
      }
      memo[item.metric] = item.total;
      return memo;
    }, {});
  }

  private isMetric (metric) {
    return metric.indexOf('gain') < 0;
  }

  private calculateTotalReachGain (total, metrics) {
    const uniqueGain = metrics.page_impressions_organic_unique_gain || 0;
    const paidGain = metrics.page_impressions_paid_unique_gain || 0;
    const gain = uniqueGain + paidGain;
    return this.calculateMetricGain(total, gain);
  }

  private calculateMetricGain (total, gain) {
    const present = total;
    const past = present - gain;
    if (past === 0 && present === 0) {
      return 0;
    } else if (past === 0) {
      return 100;
    } else {
      return Math.round(((present - past) / past) * 100);
    }
  }

  get columnNames() {
    switch (this.mediaType) {
      case 'fb': return this.facebookColumns;
      case 'instagram': return this.instagramColumns;
      case 'twitter': return this.tweetterColumns;
    }

  }

  getHeaderIcon(column) {
    switch (column.className) {
      case 'Facebook Channels': return 'facebook.svg';
      case 'Instagram Channels': return 'instagram.svg';
      case 'Twitter Channels': return 'twitter.svg';
    }
  }

  getHeaderClass(title) {
    return title.className.replace(/ /g, '-').toLowerCase();
  }

  get isTwitter() {
    return this.mediaType === 'twitter';
  }

  get isFacebook() {
    return this.mediaType === 'fb';
  }

  get isInstagram() {
    return this.mediaType === 'instagram';
  }

  getClassNameForGain(value) {
    if (value < 0) {
      return 'decrease';
    }
    if (value > 0 ) {
      return 'increase';
    }
  }

  isPaidOrganic(column) {
    return column.className === 'Paid Organic';
  }

}
