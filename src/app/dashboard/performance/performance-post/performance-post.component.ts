import { Component, OnInit, Input } from '@angular/core';
import { PERFORMACE_CONSTANTS } from '../performance.constants';
import * as moment from 'moment';

@Component({
  selector: 'sl-performance-post',
  templateUrl: './performance-post.component.html',
  styleUrls: ['./performance-post.component.scss']
})
export class PerformancePostComponent implements OnInit {
  @Input() post;

  moment: any;
  organicPercentage: number;
  paidPercentage: number;

  constructor() {
    this.moment = moment;
  }

  ngOnInit() {
    this.getPercentagesDiff();
  }

  get paid() {
    return this.post.metrics.map((postMetric) => {
      if (postMetric.metric === PERFORMACE_CONSTANTS.PAID) {
        return postMetric.total;
      }
    }).filter((metric) => metric !== undefined);
  }

  get organic() {
    return this.post.metrics.map((postMetric) => {
      if (postMetric.metric === PERFORMACE_CONSTANTS.ORGANIC) {
        return postMetric.total;
      }
    }).filter((metric) => metric !== undefined);
  }

  getPercentagesDiff() {
    const organic = this.organic[0];
    const paid = this.paid[0];
    const sum = organic + paid;
    this.organicPercentage = (organic / sum) * 100;
    this.paidPercentage = (paid / sum) * 100;
  }

  get totalReach() {
    return parseFloat(this.paid) + parseFloat(this.organic);
  }

  get likes() {
    return this.post.metrics.map((postMetric) => {
      if (postMetric.metric === PERFORMACE_CONSTANTS.LIKES) {
        return postMetric.total;
      }
    }).filter((metric) => metric !== undefined);
  }

  get comments() {
    return this.post.metrics.map((postMetric) => {
      if (postMetric.metric === PERFORMACE_CONSTANTS.COMMENTS) {
        return postMetric.total;
      }
    }).filter((metric) => metric !== undefined);
  }

  get shares() {
    return this.post.metrics.map((postMetric) => {
      if (postMetric.metric === PERFORMACE_CONSTANTS.SHARES) {
        return postMetric.total;
      }
    }).filter((metric) => metric !== undefined);
  }
}
