import {ScheduleSectionComponent} from './schedule-section.component';
import {PUBLICATION_PROXY_SERVICE} from '../../../../test/stubs/service-stubs';
import * as  moment from 'moment';
import {FormControl} from '@angular/forms';

describe('ScheduleSectionComponent', () => {

  let component;

  beforeEach(() => {
    component = new ScheduleSectionComponent(PUBLICATION_PROXY_SERVICE);
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      PUBLICATION_PROXY_SERVICE.schedule.dateForEdit = null;
    });
    it ('should init timezone', () => {
      component.ngOnInit();
      expect(component.timezone).toBeDefined();
    });

    it ('should init date', () => {
      component.ngOnInit();
      expect(component.date).toBeDefined();
    });
  });

  describe('clearDate', () => {
    it ('should init date', () => {
      component.clearDate();
      expect(component.date).toBeDefined();
    });

    it ('should set utcTimestamp in service to null', () => {
      component.clearDate();
      expect(PUBLICATION_PROXY_SERVICE.schedule.utcTimestamp).toEqual(null);
    });

    it ('should set timezone in service to null', () => {
      component.clearDate();
      expect(PUBLICATION_PROXY_SERVICE.schedule.timezone).toEqual(null);
    });

  });

  describe('clearTime', () => {

    beforeEach(() => {
      component.date = new FormControl();
    });

    it ('should init time', () => {
      component.clearTime();
      expect(component.time).toBeDefined();
    });

    it ('should set utcTimestamp in service to null', () => {
      component.clearTime();
      expect(PUBLICATION_PROXY_SERVICE.schedule.utcTimestamp).toEqual(null);
    });

    it ('should set timezone in service to null', () => {
      component.clearTime();
      expect(PUBLICATION_PROXY_SERVICE.schedule.timezone).toEqual(null);
    });

  });

  describe('datetime change logic', () => {

    const dateTimeMock = [
      {
        date: '2019-01-01', time: '01:01', timezoneValue: 'Europe/Kiev', utcTimestamp: 1546297260000
      },
      {
        date: '2019-01-02', time: '02:02', timezoneValue: 'Canada/Pacific', utcTimestamp: 1546423320000
      },
      {
        date: '2019-01-03', time: '03:03', timezoneValue: 'Canada/Pacific', utcTimestamp: 1546513380000},
      {
        date: '2019-01-04', time: '04:04', timezoneValue: 'Indian/Cocos', utcTimestamp: 1546551240000
      },
      {
        date: '2019-01-05', time: '05:05', timezoneValue: 'Africa/Bangui', utcTimestamp: 1546661100000
      },
      {
        date: '2019-01-06', time: '06:06', timezoneValue: 'America/Santiago', utcTimestamp: 1546765560000
      },
      {
        date: '2019-01-07', time: '07:07', timezoneValue: 'Chile/EasterIsland', utcTimestamp: 1546862820000
      },
      {
        date: '2019-01-08', time: '08:08', timezoneValue: 'Asia/Chongqing', utcTimestamp: 1546906080000
      },
      {
        date: '2019-01-09', time: '09:09', timezoneValue: 'Atlantic/Cape_Verde', utcTimestamp: 1547028540000
      },
      {
        date: '2019-01-10', time: '10:10', timezoneValue: 'Europe/Prague', utcTimestamp: 1547111400000
      },
    ];

    dateTimeMock.forEach(item => {

      it ('should check timezoneValue', () => {
        component.time = item.time;
        component.date = {value: moment(item.date)};
        component.timezone = item.timezoneValue;
        component.dateChange();
        expect(component.timezoneValue()).toBe(item.timezoneValue);
      });

      it ('should check utcTimestamp', () => {
        component.time = item.time;
        component.date = {value: moment(item.date)};
        component.timezone = item.timezoneValue;
        component.dateChange();
        expect(component.utcTimestamp()).toBe(item.utcTimestamp);
      });
    });
  });

  describe('datetimeExist', () => {

    beforeEach(() => {
      component.timezone = 'Europe/Kiev';
      component.time = '10:10';
      component.date = {value: new Date()};
    });

    it ('should return true in datetimeExist', () => {
      expect(component.datetimeExist()).toBeTruthy();
    });
  });

  it ('should set timezone', () => {
    component.date = {value: 1};
    const timezoneMock = 'Europe/Kiev';
    component.timezoneChange(timezoneMock);
    expect(component.timezone).toEqual(timezoneMock);
  });

});
