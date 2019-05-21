import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'sl-reach-chart',
  templateUrl: './reach-chart.component.html',
  styleUrls: ['./reach-chart.component.scss']
})
export class ReachChartComponent implements OnInit, OnChanges {

  @Input() paidPercent;
  organicPercent;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.paidPercent === undefined) {
      return;
    }
    this.organicPercent = Math.round(100 - this.paidPercent);
  }

  get paidWidth() {
    return this.paidPercent + '%';
  }

  get paidRadius() {
    return this.paidPercent === 100 ? '5px 5px 5px 5px' : '5px 0px 0px 5px';
  }

  get organicRadius() {
    return this.organicPercent === 100 ? '5px 5px 5px 5px' : '0px 5px 5px 0px';
  }

  get organicWidth() {
    return this.organicPercent + '%';
  }

  get paidMinWidth() {
    return this.paidPercent ? '25px' : '0px';
  }

  get organicMinWidth() {
    return this.organicPercent ? '25px' : '0px';
  }

  get paidStyle() {
    return {
      'width': this.paidWidth,
      'min-width': this.paidMinWidth,
      'border-radius': this.paidRadius
    };
  }

  get organicStyle() {
    return {
      'width': this.organicWidth,
      'min-width': this.organicMinWidth,
      'border-radius': this.organicRadius
    };
  }

}
