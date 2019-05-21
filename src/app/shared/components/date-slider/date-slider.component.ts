import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'sl-date-slider',
  templateUrl: './date-slider.component.html',
  styleUrls: ['./date-slider.component.scss']
})
export class DateSliderComponent {
  @Input() max: any;
  @Input() min: any;
  @Input() baseFrom: any;
  @Input() baseTo: any;
  @Input() type: any;
  @Output() onChange = new EventEmitter();
  private types = {
    'week': {
      unit: 'days',
      step: 7,
      format: (from, to) => {
        return `${from.format('DD MMMM YYYY')} - ${to.format('DD MMMM YYYY')}`;
      }
    },
    'month': {
      unit: 'months',
      step: 1,
      format: (from, to) => {
        return from.format('MMMM YYYY');
      }
    }
  };

  next () {
    if (!this.canMoveNext) {
      return;
    }
    this.baseFrom.add(this.types[this.type].step, this.types[this.type].unit);
    this.baseTo.add(this.types[this.type].step, this.types[this.type].unit);
    this.notifyChange();
  }

  back () {
    if (!this.canMoveBack) {
      return;
    }
    this.baseFrom.add(- this.types[this.type].step, this.types[this.type].unit);
    this.baseTo.add(- this.types[this.type].step, this.types[this.type].unit);
    this.notifyChange();
  }

  private notifyChange () {
    this.onChange.emit({ from: this.baseFrom.clone(), to: this.baseTo.clone() });
  }

  get displayDate () {
    return this.types[this.type].format(this.baseFrom, this.baseTo);
  }

  get canMoveNext () {
    const next = this.baseTo.clone();
    next.add(1, 'days');
    return !this.max || next.diff(this.max, 'days') <= 0;
  }

  get canMoveBack () {
    const previous = this.baseFrom.clone();
    previous.add(-1, 'days');
    return !this.min || this.min.diff(previous, 'days') <= 0;
  }

}
