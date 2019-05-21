import * as moment from 'moment';
import { SimpleChange } from '@angular/core';
import { CalendarPickerComponent } from './calendar-picker.component';

describe('CalendarPickerComponent', () => {
  let component: CalendarPickerComponent;

  beforeEach(() => {
    component = new CalendarPickerComponent();
  });

  describe('Init data', () => {

    it('should setup date filter range', () => {
      const maxDate = moment().utc().startOf('months').add(3, 'months');
      const minDate = moment().utc().startOf('months').add(0, 'months');
      const from = moment().utc().startOf('months');
      const to = moment().utc().endOf('months');
      component.ngOnInit();
      expect(component.maxDate).toEqual(maxDate);
      expect(component.minDate).toEqual(minDate);
      expect(component.from).toEqual(from);
      expect(component.to).toEqual(to);
    });

    it('should setup disabled days', () => {
      component.from = moment().utc().startOf('months');
      component.to = moment().utc().endOf('months');
      component.ngOnInit();
      expect(component.disablePrevDays).toBeDefined();
      expect(component.disableNextDays).toBeDefined();
    });

  });

  describe('Set css classes', () => {

    beforeEach(() => {
      component.el = {
        nativeElement: {
          className: '1'
        }
      };
      component.calendarDays = {_results: []} as any;
    });

    it('should set calendar dots class', () => {
      // set initial calendarData and weeeks
      component.calendarData = {
        list: [
          {date: '2018-11-01', count: 8, top_rank: 51, top_local_rank: 2}
        ]
      };
      component.weeks = [
          [{today: false, selected: undefined, mDate: {_d: 'Thu Nov 01 2018 02:00:00 GMT+0200 (Eastern European Standard Time)'}}]
      ];

      // Call setDots method by hooks
      component.ngOnInit();
      component.ngOnChanges({
        calendarData: new SimpleChange(null, component.calendarData, component.calendarData)
      });

      // change calendarData
      component.calendarData = {
        list: [
          {date: '2018-11-01', count: 8, top_rank: 51, top_local_rank: 92}
        ]
      };

      // Call setDots method by hooks with new calendarData
      component.ngOnInit();
      component.ngOnChanges({
        calendarData: new SimpleChange(null, component.calendarData, component.calendarData)
      });

      // should delete previous dot class and set new class based on new calendarData
      expect(component.el.nativeElement.className).toBe('1');
    });

    it('should set today class', () => {
      const todayClass = 'today';
      const day = { mDate: moment(), selected: false, today: true };
      const selectedDay = {
        mDate: moment().add(10, 'days'),
        selected: false,
        today: true
      };
      const dayClass = component.getClass(day, selectedDay);
      expect(dayClass).toBe(todayClass);
    });

    it('should set selected class', () => {
      const selectedClass = 'selected';
      const day = { mDate: moment().add(10, 'days'), selected: false, today: true };
      const selectedDay = {
        mDate: moment().add(10, 'days'),
        selected: false,
        today: true
      };
      const dayClass = component.getClass(day, selectedDay);
      expect(dayClass).toBe(selectedClass);
    });

  });

  describe('Date checkers', () => {

    it('should check is it selected month', () => {
      const currentMonth = moment();
      const isCurrentMonth = component.isSelectedMonth(currentMonth);
      expect(isCurrentMonth).toBeTruthy();

    });

    it('should check is it not selected month', () => {
      const nextMonth = moment().add(1, 'month');
      const isNextMonth = component.isSelectedMonth(nextMonth);
      expect(isNextMonth).toBeFalsy();
    });

    it('should check is it previous day of selected month', () => {
      const day = moment().subtract(31, 'days');
      const isPrevDay = component.isPreviousDaysOnSelectedMonth(day);
      expect(isPrevDay).toBeFalsy();
    });

  });

});
