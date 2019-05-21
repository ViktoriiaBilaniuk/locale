import { ScheduleComponent } from './schedule.component';
import {
  CHANGE_DETECTION,
  NETWORKS_SERVICE,
  PERMISSION_SERVICE_STUB,
  ROUTE,
  ROUTER,
  STORE_STUB,
  TRACK_STUB,
  VENUE_SERVICE_STUB
} from '../../test/stubs/service-stubs';
import { of, BehaviorSubject } from 'rxjs';

describe('ScheduleComponent', () => {

  let component;
  let selectSpy;
  const postsMock = [{status: 1}];
  const venueMock = {
    channels: [{selected: false}],
  };
  const spyParams = {
    'venue-details': venueMock,
    'venue-posts': postsMock
  };

  beforeEach(() => {
    component = new ScheduleComponent(
      VENUE_SERVICE_STUB,
      ROUTE,
      STORE_STUB,
      TRACK_STUB,
      PERMISSION_SERVICE_STUB,
      ROUTER,
      NETWORKS_SERVICE,
      CHANGE_DETECTION);
    selectSpy = spyOn(STORE_STUB, 'select').and.callFake((param) => {
      return of(spyParams[param]);
    });
    spyOn(VENUE_SERVICE_STUB, 'fetchPosts').and.returnValue(of(1));
    spyOn(NETWORKS_SERVICE, 'getConnectedChannels').and.returnValue(of([]));
    spyOn(VENUE_SERVICE_STUB, 'deleteScheduledPost').and.returnValue(of([]));
  });

  describe('setupDateFilterRange', () => {

    beforeEach(() => {
      component.filter = new BehaviorSubject({});
      component.navigateToWeeklyViewFromMonthly = new BehaviorSubject(false);
      component.navigateToTodayOnWeekly = new BehaviorSubject(0);
      component.navigateToDay = new BehaviorSubject(0);
    });

    it ('should init maxDate', () => {
      component.ngOnInit();
      expect(component.maxDate).toBeDefined();
    });

    it ('should init minDate', () => {
      component.ngOnInit();
      expect(component.minDate).toBeDefined();
    });

    it ('should init from', () => {
      component.ngOnInit();
      expect(component.from).toBeDefined();
    });

    it ('should init to', () => {
      component.ngOnInit();
      expect(component.to).toBeDefined();
    });

  });

  describe('getVenueDetails', () => {

    it ('should select venie details', () => {
      component.ngOnInit();
      expect(selectSpy).toHaveBeenCalled();
    });

    it ('should define venue', () => {
      component.ngOnInit();
      expect(component.venue).toBeDefined();
    });

    it ('should define channels', () => {
      component.ngOnInit();
      expect(component.channels).toBeDefined();
    });

    it ('should define statuses', () => {
      component.ngOnInit();
      expect(component.statuses).toBeDefined();
    });

    it ('should define filter', () => {
      component.ngOnInit();
      expect(component.filter).toBeDefined();
    });

    it ('should set loading to false', () => {
      component.ngOnInit();
      expect(component.loading).toBeFalsy();
    });

  });

  describe('filter logic', () => {

    const filter = {date: 1, channels: [1, 2], statuses: [2, 3]};
    const activeDateMock = {to: 1};

    beforeEach(() => {
      component.filter = new BehaviorSubject(filter);
      component.activeDate = activeDateMock;
    });

    it ('should return channels', () => {
      expect(component.channelsFilter).toEqual(filter.channels);
    });

    it ('should return statuses', () => {
      expect(component.statusesFilter).toEqual(filter.statuses);
    });

    it ('should set channelsFilter', () => {
      component.filter = new BehaviorSubject(filter);
      expect(component.filter.getValue()).toEqual(filter);
    });

  });

  describe('setDateFilter', () => {
    const value = {to: 1};

    beforeEach(() => {
      component.filter = new BehaviorSubject({});
    });

    it ('should call filterPosts', () => {
      const filterPostsSpy = spyOn(TRACK_STUB, 'filterPosts');
      component.setDateFilter(value);
      expect(filterPostsSpy).toHaveBeenCalled();
    });

    it ('should define activeDate', () => {
      component.setDateFilter(value);
      expect(component.activeDate).toBeDefined();
    });
  });

  describe('venue logic', () => {

    beforeEach(() => {
      component.venue = {name: 'name'};
      component.channels = [1, 2];
      component.statuses = [1, 2];
    });

    it ('should return venueName', () => {
      expect(component.venueName).toEqual('name');
    });

    it ('should return channels', () => {
      expect(component.venueChannels).toEqual([1, 2]);
    });

    it ('should return statuses', () => {
      expect(component.postStatuses).toEqual([1, 2]);
    });

    it ('should call filterPosts', () => {
      component.filter = new BehaviorSubject({});
      const filterPostsSpy = spyOn(TRACK_STUB, 'filterPosts');
      component.onChangeChannels([]);
      expect(filterPostsSpy).toHaveBeenCalled();
    });

  });

});
