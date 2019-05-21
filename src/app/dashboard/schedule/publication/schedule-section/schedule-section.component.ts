import { Component, OnDestroy, OnInit } from '@angular/core';
import * as  momentTimezone from 'moment-timezone';
import * as  moment from 'moment';
import { PublicationProxyService } from '../../../../core/services/publication/publication-proxy.service';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { CustomDateAdapterMonthName, MONTH_NAME_Format } from '../../../date-formats-constants';
import { fadeInAnimation } from '../../../../shared/animations/fade-in.animation';
import { interval } from 'rxjs';
import { AutoUnsubscribe } from '../../../../shared/decorators/auto-unsubscribe';

@AutoUnsubscribe
@Component({
  selector: 'sl-schedule-section',
  templateUrl: './schedule-section.component.html',
  styleUrls: ['./schedule-section.component.scss'],
  animations: [fadeInAnimation],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapterMonthName},
    {provide: MAT_DATE_FORMATS, useValue: MONTH_NAME_Format},
  ]
})
export class ScheduleSectionComponent implements OnInit, OnDestroy {
  timezone;
  date;
  timeText;
  time;
  crone$;

  constructor(
    private publicationProxy: PublicationProxyService) {
  }

  ngOnInit() {
    this.unsubscribeFromCrone();
    if (this.dataToEdit()) {
      this.setDataForEdit();
      this.validate();
    } else {
      this.clearAllOldData();
      this.initData();
    }
  }

  private dataToEdit() {
    return this.publicationProxy.schedule.dateForEdit;
  }

  private setDataForEdit() {
    const dateForEdit = this.publicationProxy.schedule.dateForEdit;
    const time = dateForEdit.substring(11, 13) + ':' + dateForEdit.substring(14, 16);
    this.timezone = this.publicationProxy.schedule.timezone;
    this.date = new FormControl(dateForEdit);
    if (time !== '00:00') {
      this.time = time;
      this.timeText = time;
    }
  }

  get timeMask() {
    const mask1 = [/[0-2]/, /[0-9]/, ':', /[0-5]/, /\d/];
    const mask2 = [/[0-2]/, /[0-3]/, ':', /[0-5]/, /\d/];
    if (!this.time) {
      return mask1;
    }
    return this.time.substring(0, 1) === '2' ? mask2 : mask1;
  }

  private initData() {
    this.timezone = this.currentUserTimezone();
    this.date = new FormControl();
  }

  private currentUserTimezone() {
    return momentTimezone.tz.guess();
  }

  private clearAllOldData() {
    Object.keys(this.publicationProxy.schedule).forEach(value => {
      this.publicationProxy.schedule[value] = null;
    });
  }

  clearDate() {
    this.date = new FormControl();
    this.setSchedule();
  }

  clearTime() {
    this.timeText = null;
    this.time = null;
    this.setSchedule();
  }

  dateChange() {
    this.setSchedule();
  }

  utcTimestamp() {
    if (!this.localTimestamp()) {
      return null;
    }
    return moment.utc(this.localTimestamp()).valueOf();
  }

  localTimestamp() {
    if (!this.date.value || !this.time) {
      return null;
    }
    const date = momentTimezone(this.date.value);
    const dateString = date.year() + '-' + this.getDateValue((date.month() + 1)) + '-' +
      this.getDateValue(date.date()) + ' ' + this.time;
    return momentTimezone.tz(dateString, this.timezoneValue()).format();
  }

  private getDateValue(value) {
    return value < 10 ? '0' + value : value;
  }

  timeChange(event) {
    const timeString = event.replace(/_/g, 0);
    this.time = timeString.slice();
    this.setSchedule();
  }

  timezoneChange(event) {
    this.timezone = event;
    this.setSchedule();
  }

  private timezoneValue() {
    if (!this.timezone) {
      return null;
    }
    return this.timezone;
  }

  private setSchedule() {
    this.publicationProxy.schedule.utcTimestamp = this.utcTimestamp();
    this.publicationProxy.schedule.timezone = this.timezoneValue();
    this.validate();
  }

  private validate() {
    if (!this.datetimeExist()) {
      this.publicationProxy.schedule.error = false;
      this.unsubscribeFromCrone();
      return;
    }
    this.checkError();
    if (!this.publicationProxy.schedule.error) {
      this.setCrone();
    }
  }

  private unsubscribeFromCrone() {
    if (this.crone$) {
      this.crone$.unsubscribe();
    }
  }

  private checkError() {
    const currentTimeInSelectedTimezone = momentTimezone().tz(this.timezoneValue());
    const selectedUserDate = momentTimezone.tz(this.localTimestamp(), this.timezoneValue());
    this.publicationProxy.schedule.error = !currentTimeInSelectedTimezone.isBefore(selectedUserDate);
  }

  private setCrone() {
    this.unsubscribeFromCrone();
    this.crone$ = interval(5000)
      .subscribe(() => {
        this.checkError();
      });
  }

  datetimeExist() {
    return this.timezone && this.date.value && this.time && this.utcTimestamp();
  }

  scheduleError() {
    return this.publicationProxy.schedule.error;
  }

  ngOnDestroy() {
    this.unsubscribeFromCrone();
  }
}
