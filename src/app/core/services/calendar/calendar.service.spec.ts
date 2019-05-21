import { CalendarService } from './calendar.service';
import { CHAT_SERVICE, HTTP, TRACK_STUB } from '../../../test/stubs/service-stubs';
import { CONSTANTS } from '../../constants';
import { of } from 'rxjs';

describe('CalendarService', () => {
  let service, getSpy;

  beforeEach(() => {
    service = new CalendarService(HTTP, CHAT_SERVICE, TRACK_STUB);
    getSpy = spyOn(HTTP, 'get');
  });

  it ('should set categories', () => {
    expect(service.setCategories([1])).toEqual('&categories[]=1');
  });

  it ('should fetch all events', () => {
    service.fetchAllEvents(1, 2, 3, [4]);
    expect(getSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}events/1/all/?selected_date=
    2&radius=3&categories[]=4`);
  });

  it ('should fetch events for venue', () => {
    service.fetchMyEventsMonthly(1, 2, 3, 4, [5]);
    expect(getSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}events/1/saved/?from=
    2&to=3&radius=4&categories[]=5`);
  });

  describe('addEvent', () => {
    let postSpy, trackSpy, refreshSpy;

    beforeEach(() => {
      trackSpy = spyOn(TRACK_STUB, 'addEvent');
      refreshSpy = spyOn(CHAT_SERVICE, 'refreshChats');
      postSpy = spyOn(HTTP, 'post').and.returnValue(of(1));
    });

    it ('should call addEvent', () => {
      service.addEvent(1, 2, 3);
      expect(trackSpy).toHaveBeenCalled();
    });

    it ('should post event', () => {
      service.addEvent(1, 2, 3);
      expect(postSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}events/1/2`, 3);
    });
  });

  describe('removeEvent', () => {
    let deleteSpy, trackSpy, refreshSpy;

    beforeEach(() => {
      trackSpy = spyOn(TRACK_STUB, 'removeEvent');
      refreshSpy = spyOn(CHAT_SERVICE, 'refreshChats');
      deleteSpy = spyOn(HTTP, 'delete').and.returnValue(of(1));
    });

    it ('should call removeEvent', () => {
      service.removeEvent(1, 2 );
      expect(trackSpy).toHaveBeenCalled();
    });

    it ('should delete event', () => {
      service.removeEvent(1, 2 );
      expect(deleteSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}events/1/2`);
    });
  });

  it ('should get calendar data for all events', () => {
    service.getCalendarDataForAllEvents(1, 2, 3, 4, [5]);
    expect(getSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}events/1/all/calendar?year=2&month=
    3&radius=4&categories[]=5`);
  });

  it ('should get calendar data for my events', () => {
    service.getCalendarDataForMyEvents(1, 2, 3, 4, [5]);
    expect(getSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}events/1/saved/calendar?year=2&month=
    3&radius=4&categories[]=5`);
  });
});
