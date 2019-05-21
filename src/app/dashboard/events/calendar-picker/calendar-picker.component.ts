import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject ,  Subscription } from 'rxjs';
import { CalendarDate } from '../../../models/right-sidebar/venue-calendar/calendar-date';
import { DOTS_CLASSES_CONSTANTS } from './calendar-picker.constants';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe';
import { distinctUntilChanged } from 'rxjs/internal/operators';

@AutoUnsubscribe
@Component({
  selector: 'sl-calendar-picker',
  templateUrl: './calendar-picker.component.html',
  styleUrls: ['./calendar-picker.component.scss']
})
export class CalendarPickerComponent implements OnInit, OnChanges {
  private dotsClasses = DOTS_CLASSES_CONSTANTS;
  private currentDate = moment().utc();
  private filter: BehaviorSubject<any>;
  private yearForGettingEvents;
  private monthForGettingEvents;
  private monthRange;

  selectedDay: CalendarDate = { mDate: moment(), selected: false, today: true };
  subscriptions: Array<Subscription>;
  dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  weeks = [];
  maxDate: any;
  minDate: any;
  from: any;
  to: any;
  disableNextDays: boolean;
  disablePrevDays: boolean;
  el;

  @Input() private venueId: string;
  @Input() calendarData;
  @Input() loading;

  @Output() onSelectDate = new EventEmitter<any>();
  @Output() onSetParametersForGettingCalendarData = new EventEmitter<any>();

  @ViewChildren('calendarDay') calendarDays: QueryList<ElementRef>;

  ngOnInit() {
    this.subscriptions = [];
    this.setupFilter();
    this.setupDateFilterRange();
    this.setupDisabledDays();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.calendarData && this.calendarData) {
      this.setCalendarData(this.calendarData);
    }
    if (changes.venueId && this.venueId) {
      this.selectedDay = { mDate: moment(), selected: false, today: true };
      this.setupFilter();
      this.setupDateFilterRange();
      this.selectDate(this.selectedDay);
      this.setDateForGettingEvents();
    }
  }

  private setDateForGettingEvents(year?, month?) {
    if (year && month) {
      this.yearForGettingEvents = year;
      this.monthForGettingEvents =  month;
      this.emitParametersForGettingCalendarData(true);
    } else {
      this.yearForGettingEvents = this.selectedDay.mDate.year();
      this.monthForGettingEvents =  this.selectedDay.mDate.month();
      this.emitParametersForGettingCalendarData();
    }

  }

  private emitParametersForGettingCalendarData(sliderClick?) {
    this.onSetParametersForGettingCalendarData.emit({
      year: this.yearForGettingEvents,
      month: this.monthForGettingEvents,
      sliderClick: sliderClick
    });
  }

  private setCalendarData(data) {
    this.calendarData = data['list'];
    this.setDots();
    this.loading = false;
  }

  private setDots() {
    if (this.calendarData) {
      this.calendarData.forEach (serverDay => {
        const serverDate = serverDay.date;
        this.weeks.forEach( week => {
          const foundDay = week.find( (day) => {
            const calendarDate = day.mDate['_d'].toISOString().substring(0, 10);
            return serverDate === calendarDate;
          });
          const elementId = 'day-' + serverDate.substring(8, 10);
          if (foundDay && this.calendarDays && this.calendarDays['_results']) {
            this.el = this.calendarDays['_results'].find( element => {
              return element.nativeElement.id === elementId;
            });
            if (this.el) {
              // remove dots classes and then add new class
              this.el.nativeElement.classList.forEach((cl) => {
                if (this.dotsClasses.includes(cl)) {
                  this.el.nativeElement.classList.remove(cl);
                }
              });
              this.el.nativeElement.classList.add(this.getDotsClasses(serverDay.top_local_rank));
            }
          }
        });
      });
    }
    this.removeDotClassOnNotLoadedDay();
  }

  removeDotClassOnNotLoadedDay() {
    const serverElemIdArray = this.calendarData.map(serverDay => 'day-' + serverDay.date.substring(8, 10));
    const domElemArray = this.calendarDays['_results'].filter((elem) => !serverElemIdArray.includes(elem.nativeElement.id));
    if (domElemArray.length) {
      domElemArray.forEach(domElement => {
        domElement.nativeElement.classList.forEach((cl) => {
          if (this.dotsClasses.includes(cl)) {
            domElement.nativeElement.classList.remove(cl);
          }
        });
      });
    }
  }

  private getDotsClasses(rank) {
    if (rank < 30) {
      return this.dotsClasses[0];
    }
    if ((rank >= 30) && (rank < 70)) {
      return this.dotsClasses[1];
    }
    if (rank >= 70) {
      return this.dotsClasses[2];
    }
  }

  getClass(day, selectedDay) {
    if (day.mDate.format('LL') === selectedDay.mDate.format('LL')) { return 'selected'; }
    if (day.today) { return 'today'; }
  }

  /* calendar control*/

  private setupFilter () {
    this.filter = new BehaviorSubject<any>({
      date: moment().utc().startOf('months'),
    });
    this.filter
      .pipe (
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentDate = this.filter.value.date;
        this.generateCalendar();
      });
  }

  private setupDateFilterRange () {
    this.maxDate = moment().utc().startOf('months').add(3, 'months');
    this.minDate = moment().utc().startOf('months').add(0, 'months');
    this.from = moment().utc().startOf('months');
    this.to = moment().utc().endOf('months');
    this.monthRange = {from: this.from, to: this.to};
  }

  // date checkers
  private isToday(date: moment.Moment): boolean {
    return moment().utc().isSame(moment(date), 'day');
  }

  isSelectedMonth(date: moment.Moment): boolean {
    return moment(date).utc().isSame(this.currentDate, 'month');
  }

  isPreviousDaysOnSelectedMonth(date) {
    return moment(date).utc().subtract(1, 'months').isSame(this.currentDate, 'month');
  }

  selectDate(date: CalendarDate): void {
    this.onSelectDate.emit({date: date, monthRange: this.monthRange});
    this.selectedDay = date;
  }

  private setupDisabledDays() {
    const previous = this.from.clone();
    previous.add(-1, 'days');
    this.disablePrevDays = !(!this.minDate || this.minDate.diff(previous, 'days') <= 0);
    const next = this.to.clone();
    next.add(1, 'days');
    this.disableNextDays = !(!this.maxDate || next.diff(this.maxDate, 'days') <= 0);
  }

  selectDateForPrevOrNextMonth(day) {
    const selectedDayMonthNumber = day.mDate;
    const currentDayMonthNumber = this.currentDate;
    if (selectedDayMonthNumber < currentDayMonthNumber) {
      this.monthRange.from.add(-1, 'month');
      this.monthRange.to.add(-1, 'month');
    } else {
      this.monthRange.from.add(1, 'month');
      this.monthRange.to.add(1, 'month');
    }
    this.setupDisabledDays();
    this.onSelectDate.emit({date: day, monthRange: this.monthRange});
    this.selectedDay = day;
    this.setDateFilter({from : this.from, to: this.to});
  }

  // generate the calendar grid
  private generateCalendar(): void {
    const dates = this.fillDates(this.currentDate);
    const weeks: CalendarDate[][] = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    this.weeks = weeks;
  }

  private fillDates(currentMoment: moment.Moment): CalendarDate[] {
    const firstOfMonth = moment(currentMoment).utc().startOf('month').isoWeekday();
    const firstDayOfGrid = moment(currentMoment).utc().startOf('month').subtract(firstOfMonth - 1, 'days');
    const start = firstDayOfGrid.date();
    return Array.from({length: 42}, (_, i) => i + start)
      .map((date: number): CalendarDate => {
        const d = moment(firstDayOfGrid).utc().date(date);
        return {
          today: this.isToday(d),
          selected: undefined,
          mDate: d,
        };
      });
  }

  setDateFilter (value) {
    this.from = value.from;
    this.to = value.to;
    this.monthRange = value;
    this.filter.next({date : value.to.utc()});
    const year = value.from._d.getFullYear();
    const month = value.from._d.getMonth();
    this.setDateForGettingEvents(year, month);
    this.setupDisabledDays();
  }

  /* end calendar control*/
}
