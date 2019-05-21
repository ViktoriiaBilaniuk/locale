import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONSTANTS } from '../../constants';
import { TrackingSerivce } from '../tracking/tracking.service';
import { EVENTS_CONSTANTS } from '../../../dashboard/events/events.constants';
import { ChatService } from '../chat/chat.service';
import { tap } from 'rxjs/internal/operators';

@Injectable()
export class CalendarService {

  constructor(
    private http: HttpClient,
    private chats: ChatService,
    private track: TrackingSerivce ) { }

  sliderValue = EVENTS_CONSTANTS.RADIUS_DEFAULT;

  setCategories(categories = []) {
    return categories.map((category) => '&categories[]=' + category).join('');
  }

  fetchAllEvents( venueId, selected_date, radius?, categories?) {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}events/${venueId}/all/?selected_date=
    ${selected_date}&radius=${radius}${this.setCategories(categories)}`);
  }

  fetchMyEventsMonthly( venueId, from, to, radius?, categories? ) {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}events/${venueId}/saved/?from=
    ${from}&to=${to}&radius=${radius}${this.setCategories(categories)}`);
  }

  addEvent(venueId, phqEventId, body) {
    this.track.addEvent(phqEventId);
    return this.http.post(`${CONSTANTS.API_ENDPOINT}events/${venueId}/${phqEventId}`, body)
      .pipe(
        tap(() => {
          this.chats.refreshChats();
        })
      );
  }

  removeEvent(venueId, eventId) {
    this.track.removeEvent(eventId);
    return this.http.delete(`${CONSTANTS.API_ENDPOINT}events/${venueId}/${eventId}`)
      .pipe(
        tap(() => {
          this.chats.refreshChats();
        })
      );
  }

  getCalendarDataForAllEvents(venueId, year, month, radius?, categories?) {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}events/${venueId}/all/calendar?year=${year}&month=
    ${month}&radius=${radius}${this.setCategories(categories)}`);
  }

  getCalendarDataForMyEvents(venueId, year, month, radius?, categories?) {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}events/${venueId}/saved/calendar?year=${year}&month=
    ${month}&radius=${radius}${this.setCategories(categories)}`);
  }
}
