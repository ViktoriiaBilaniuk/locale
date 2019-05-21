import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'sl-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit, OnChanges {
  @Input() venueId;
  @Input() myEvents;
  @Input() allEvents;
  @Input() dataForGettingEvents;
  @Output() onRemovingEvent = new EventEmitter();
  @Output() onAddEvent = new EventEmitter();
  events;
  disabledButtons = false;

  ngOnChanges(changes: any) {
    if (changes.allEvents && this.allEvents) {
      this.setEvents();
    }
  }

  ngOnInit() {
      this.setEvents();
  }

  private setEvents() {
    if (this.myEvents || this.allEvents) {
      this.events = this.myEvents ? this.myEvents : this.allEvents;
    }
  }

  onRemovingEventAction(event) {
    this.onRemovingEvent.emit(event);
  }

  onAddEventAction(event) {
    this.onAddEvent.emit(event);
  }

  get hasTodaysEvents () {
    if (this.events) {
      return this.events && this.events.today;
    }
  }

  get hasTomorrowsEvents () {
    if (this.events) {
      return this.events && this.events.tomorrow;
    }
  }

  get noTodaysEvents () {
    if (this.events) {
      return !this.events || !this.events.today.length || !this.events.today;
    }
  }

  get noTomorrowsEvents () {
    if (this.events) {
      return !this.events || !this.events.tomorrow.length || !this.events.tomorrow;
    }
  }

  onDisabledButtons(isDisabled) {
    this.disabledButtons = isDisabled;
  }

}
