import { throwError,  Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventList } from '../../models/right-sidebar/venue-calendar/event-list';
import { CalendarService } from '../../core/services/calendar/calendar.service';
import * as moment from 'moment';
import { Store } from '../../core/store/store';
import { EVENTS_CONSTANTS } from './events.constants';
import { TrackingSerivce } from '../../core/services/tracking/tracking.service';
import { PermissionsService } from '../../core/services/permissions/permissions.service';
import { EVENT_SORTING_CONSTANTS } from './sorting/sorting.constatnts';
import { filter } from 'rxjs/internal/operators';

@Component({
  selector: 'sl-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnDestroy {
  private selectedDate;
  private myEventsObject;
  private calendarDataForAllEvents$;
  private myEvents$;
  private allEvents$;
  private radius = EVENTS_CONSTANTS.RADIUS_DEFAULT * 1000;
  private currentSortOption = EVENTS_CONSTANTS.SORTING_OPTIONS.DISTANCE;
  private selectedFilters = [];
  private allEventsObject;
  private fetchVenueIdSubscription: Subscription;

  from;
  to;
  subscriptions: Array<Subscription> = [];
  venueId;
  eventsListLoading;
  calendarLoading;
  myEvents;
  allEvents;
  calendarData;
  dataForGettingEvents;
  availableOptions = EVENT_SORTING_CONSTANTS.AVAILABLE_OPTIONS;
  eventSettings = {
    sortOption: this.currentSortOption,
    radius: this.radius,
    filters: [],
  };

  constructor(
    private route: ActivatedRoute,
    private calendarService: CalendarService,
    private store: Store,
    private track: TrackingSerivce,
    private router: Router,
    private permissionsService: PermissionsService ) {
  }

  ngOnInit() {
    this.fetchVenueId();
    this.store.set('tutorialKey', 'events');
  }

  private fetchVenueId() {
    this.fetchVenueIdSubscription = this.store.select('venueId')
      .pipe(
        filter((res: any) => res)
      )
      .subscribe(venueId => this.setInfoOnVenueIdSubscribe(venueId));
  }

  private setInfoOnVenueIdSubscribe(venueId) {
    this.setVenueId(venueId);
    this.resetData();
    this.getFiltersList();
    this.track.calendarOpened();
    this.setCurrentMonthRange();
  }

  private setVenueId(venueId) {
    this.venueId = venueId;
  }

  private setCurrentMonthRange() {
    this.selectedDate = moment().utc().valueOf();
    this.from = moment().startOf('month').utc().valueOf();
    this.to = moment().endOf('month').utc().valueOf();
  }

  private resetData() {
    this.subscriptions = [];
    this.calendarService.sliderValue = EVENTS_CONSTANTS.RADIUS_DEFAULT;
    this.eventSettings.radius = EVENTS_CONSTANTS.RADIUS_DEFAULT * 1000;
    this.eventSettings.sortOption = EVENTS_CONSTANTS.SORTING_OPTIONS.DISTANCE;
    this.resetSorting();
  }

  private resetSorting() {
    this.availableOptions[0].selected = true;
    this.availableOptions[1].selected = false;
  }

  private getFiltersList() {
    this.subscriptions.push(this.store.select('categories')
    .subscribe(categories =>  {
      if (categories) {
        this.eventSettings.filters = Object.keys(categories).map(key => {
          return {
            category: categories[key],
            selected: true
          };
        });
      }
    }));
    this.setSelectedFilters();
  }

  private setSelectedFilters() {
    this.selectedFilters.length = 0;
    this.selectedFilters = this.eventSettings.filters.filter(item => item.selected);
  }

  onSetParametersForGettingCalendarData(event) {
    this.dataForGettingEvents = event;
    if (!event.sliderClick) {
      this.getEvents();
    }
    this.getCalendarData();
  }

  private getEvents() {
    if (this.dataForGettingEvents) {
      this.eventsListLoading = true;
      this.getAllEvents();
    }
  }

  private getCalendarData() {
    if (this.dataForGettingEvents) {
      this.calendarLoading = true;
      this.getCalendarDataForAllEvents();
    }
  }

  private getCalendarDataForAllEvents() {
    this.calendarDataForAllEvents$ = this.calendarService.getCalendarDataForAllEvents(this.venueId, this.dataForGettingEvents.year,
      this.dataForGettingEvents.month, this.eventSettings.radius, this.categories)
      .subscribe(data => {
        this.calendarData = data;
        this.calendarLoading = false;
        }, (err) => this.handleForbiddenError(err)
      );
    this.subscriptions.push(this.calendarDataForAllEvents$);
  }

  private getAllEvents() {
    this.allEvents$ = this.calendarService.fetchAllEvents(
      this.venueId,  this.selectedDate, this.eventSettings.radius, this.categories)
      .subscribe((allEventsData: any) => {
        this.setAllEventsData(allEventsData.list);
        this.eventsListLoading = false;
        }, (err) => this.handleForbiddenError(err)
      );
    this.subscriptions.push(this.allEvents$);
  }

  private getMyEvents() {
    this.myEvents$ = this.calendarService.fetchMyEventsMonthly(
      this.venueId, this.from, this.to, this.eventSettings.radius, this.categories)
      .subscribe((myEventsData: any) => {
        this.setMyEventsData(myEventsData.list);
      }, (err) => this.handleForbiddenError(err)
    );
    this.subscriptions.push(this.myEvents$);
  }

  private setMyEventsData(data) {
    this.myEventsObject = data;
    this.myEvents = this.transformMyEvents(data);
  }

  private transformMyEvents(myEventsList) {
    if (myEventsList) {
      const events = { today: []};
      myEventsList.forEach( event => {
        if (event.items.length) {
          event.items.forEach(item => {
            events.today.push(item);
          });
        }
      });
      events.today = events.today.filter((event, index) => {
        return events.today.indexOf(events.today.find((item) => event.id === item.id)) === index;
      });
      return events;
    }
  }

  private setAllEventsData(allEventsData) {
    this.allEventsObject = allEventsData;
    this.sortEvents();

    const myEventsArray = this.getEventsItems(this.myEventsObject);
    const allEventsArray = this.getEventsItems(this.allEventsObject);

    myEventsArray.forEach((item) => item.isMyEvent = true);
    allEventsArray.forEach((item) => item.external_id =  item.id);

    this.checkIsMyEvents(myEventsArray, allEventsArray);
    this.allEvents = this.transformData(this.allEventsObject);
  }

  private getEventsItems(eventsObject) {
    return [].concat.apply([], eventsObject.map(listBlock => listBlock.items));
  }

  private checkIsMyEvents(myEventsArray, allEventsArray) {
    myEventsArray.forEach((myEvent) => {
      const event = allEventsArray.find((e) => e.id === myEvent.external_id);
      if (event) {
        event.isMyEvent = true;
        event.id = myEvent.id;
      }
    });
  }

  private sortEvents() {
    this.allEventsObject.forEach(allEventsBlock => {
      this.sorting(allEventsBlock.items, this.eventSettings.sortOption);
    });
    this.myEventsObject.forEach(myEventsBlock => {
      this.sorting(myEventsBlock.items, this.eventSettings.sortOption);
    });
  }

  private sorting (array, sortOption) {
    if (sortOption === 'relevance') {
      array.sort((a, b) => {
        return (b[sortOption] || 0) - (a[sortOption] || 0);
      });
    } else {
      array.sort((a, b) => {
        return a[sortOption] - b[sortOption];
      });
    }
  }

  private transformData(data) {
    const events: EventList = { today: [], tomorrow: []};
    const today = moment(this.selectedDate).format('DD');
    const tomorrow = moment(this.selectedDate).add(1, 'd').format('DD');
    data.forEach( serverDateBlock => {
      const serverDate = serverDateBlock.date.substring(8, 10);
      if (serverDate === today) {
        events.today = serverDateBlock.items;
      }
      if (serverDate === tomorrow) {
        events.tomorrow = serverDateBlock.items;
      }
    });
    return events;
  }

  onSelectDate(dateObject) {
    this.selectedDate = dateObject.date.mDate.valueOf();
    if (dateObject.monthRange) {
      this.from = dateObject.monthRange.from.utc().valueOf();
      this.to = dateObject.monthRange.to.utc().valueOf();
    }
    this.getEvents();
    this.getMyEvents();
  }

  private get categories() {
    const categories = [];
    this.selectedFilters.forEach( item => {
      if (item.selected) {
        categories.push(item.category);
      }
    });
    return categories;
  }

  onRemovingEvent() {
    this.getEvents();
    this.getMyEvents();
    this.getCalendarData();
  }

  onAddEvent( ) {
    this.getEvents();
    this.getMyEvents();
    this.getCalendarData();
  }

  private handleForbiddenError (err) {
    if (err.status === 403) {
      this.permissionsService.fetchPermissionsByVenue(this.venueId);
      this.router.navigate(['../details'], { relativeTo: this.route });
    }
    return throwError(err);
  }

  sortingChange(option) {
    this.eventSettings.sortOption = option;
    this.setSelectedFilters();
    this.getEvents();
    this.getCalendarData();
  }

  typesSelected(types) {
    this.eventSettings.filters = types;
    this.setSelectedFilters();
    this.getEvents();
    this.getCalendarData();
  }

  sliderChange(radius) {
    this.eventSettings.radius = radius.value;
    this.setSelectedFilters();
    if (!radius.init) {
      this.getEvents();
      this.getCalendarData();
    }
  }
  ngOnDestroy () {
    this.store.set('tutorialKey', null);
  }
}
