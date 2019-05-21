import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'sl-date-tabs',
  templateUrl: './date-tabs.component.html',
  styleUrls: ['./date-tabs.component.scss']
})
export class DateTabsComponent implements OnInit, OnChanges {
  @Input() venue: any;
  @Input() max: any;
  @Input() min: any;
  @Input() baseFrom: any;
  @Input() baseTo: any;
  @Input() type: any;
  @Output() onChange = new EventEmitter();
  private from: any;
  private to: any;
  initialMonthIndex = 3;
  months = [];
  activeMonth = moment().format('MMM').toString();
  private types = {
    'month': {
      unit: 'months',
      step: 1,
      format: (from, to) => {
        return from.format('MMM');
      }
    }
  };

  ngOnInit() {
    this.getMonthRange();
    this.currentMonth();
    this.from = this.baseFrom.clone();
    this.to = this.baseTo.clone();
  }

  ngOnChanges() {
    this.currentMonth();
  }

  next () {
    if (!this.canMoveNext) {
      return;
    }
    this.from.add(this.types[this.type].step, this.types[this.type].unit);
    this.to.add(this.types[this.type].step, this.types[this.type].unit);
    this.notifyChange();
    let activeIndex;
    this.months.forEach((mm) => mm.selected = false);
    this.months.forEach((mm, index) => {
      if (mm.month === this.activeMonth) {
        this.months[index + 1].selected = true;
        activeIndex = index;
      }
    });
    this.activeMonth = this.months[activeIndex + 1].month;
    this.initialMonthIndex = this.initialMonthIndex + 1;
  }

  back () {
    if (!this.canMoveBack) {
      return;
    }
    this.from.add(- this.types[this.type].step, this.types[this.type].unit);
    this.to.add(- this.types[this.type].step, this.types[this.type].unit);
    this.notifyChange();
    this.months.forEach((mm) => mm.selected = false);
    this.months.forEach((mm, index) => {
      if (mm.month === this.activeMonth) {
        this.months[index - 1].selected = true;
        this.activeMonth = this.months[index - 1].month;
      }
    });
    this.initialMonthIndex = this.initialMonthIndex - 1;
  }

  get displayDate () {
    return this.types[this.type].format(this.from, this.to);
  }

  get canMoveNext () {
    const next = this.to.clone();
    next.add(1, 'days');
    return !this.max || next.diff(this.max, 'days') <= 0;
  }

  get canMoveBack () {
    const previous = this.from.clone();
    previous.add(-1, 'days');
    return !this.min || this.min.diff(previous, 'days') <= 0;
  }

  getMonthRange() {
    const max = this.max.clone();
    const min = this.min.clone();
    while (max > min || max.format('M') === min.format('M')) {
      this.months.push({month: min.format('MMM'), selected: false});
      min.add(1, 'month');
   }
  }

  currentMonth () {
    this.months.forEach(mm => {
      mm.selected = false;
      if (moment().format('MMM').toString() === mm.month) {
        mm.selected = true;
      }
    });
  }

  private notifyChange () {
    this.onChange.emit({ from: this.from.clone(), to: this.to.clone() });
  }

  selectMonth(month, index) {
    if (this.initialMonthIndex > index) {
      const step = this.initialMonthIndex - index;
      this.from.add(- step, 'month');
      this.to.add(- step, 'month');
    } else {
      const step = index - this.initialMonthIndex;
      this.from.add(step, 'month');
      this.to.add(step, 'month');
    }
    this.notifyChange();
    this.initialMonthIndex = index;
    this.months.forEach((mm) => mm.selected = false);
    month.selected = true;
    this.activeMonth = month.month;
  }

}
