import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Datepicker } from '../../../models/datepicker.model';
import * as  moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material';
import { fadeInAnimation } from '../../../shared/animations/fade-in.animation';

@Component({
  selector: 'sl-performance-filters',
  templateUrl: './performance-filters.component.html',
  styleUrls: ['./performance-filters.component.scss'],
  animations: [fadeInAnimation],
})
export class PerformanceFiltersComponent implements OnInit {

  fromDatepickerSettings: Datepicker;
  toDatepickerSettings: Datepicker;
  @Output() onDateChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
    const startOfMonth = moment([moment().toDate().getFullYear(), moment().toDate().getMonth()]);
    this.fromDatepickerSettings = this.initDatePicker(moment().add(-6, 'days'),
      startOfMonth.clone().add(-3, 'month'), moment().add(-6, 'days'));
    this.toDatepickerSettings = this.initDatePicker(moment(),
      startOfMonth.clone().add(-3, 'month').add(6, 'days'), moment());
    this.emitDate();
  }

  private initDatePicker(value: moment.Moment, min: moment.Moment, max: moment.Moment): Datepicker {
    return { value, min, max };
  }

  onDatepickerChangeDate(type: string, event: MatDatepickerInputEvent<Date>) {
    switch (type) {
      case 'from':
        this.fromDatepickerSettings.value = moment(event.value);
        if (moment(event.value).isAfter(this.toDatepickerSettings.value.clone().add(-6, 'days'))) {
          this.toDatepickerSettings.value = moment(event.value).add(6, 'days');
        }
        break;
      case 'to':
        this.toDatepickerSettings.value = moment(event.value);
        if (moment(event.value).isBefore(this.fromDatepickerSettings.value.clone().add(6, 'days'))) {
          this.fromDatepickerSettings.value = moment(event.value).add(-6, 'days');
        }
        break;
      default: break;
    }
    this.emitDate();
  }

  emitDate() {
    this.onDateChange.emit({startDate: this.startDate, endDate: this.endDate});
  }

  private get startDate () {
    return this.fromDatepickerSettings.value.clone();
  }

  private get endDate () {
    return this.toDatepickerSettings.value.clone();
  }

}
