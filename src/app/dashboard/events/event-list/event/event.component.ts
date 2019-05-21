import { throwError,  Subscription } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CalendarService } from '../../../../core/services/calendar/calendar.service';
import { PermissionsService } from '../../../../core/services/permissions/permissions.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'sl-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  @Input() myEvents;
  @Input() disabledButtons;
  @Input() event;
  @Input() private venueId;
  @Input() dataForGettingEvents;
  @Output() onAddEventAction = new EventEmitter();
  @Output() onRemovingEventAction = new EventEmitter();
  @Output() emitDisablingButtons = new EventEmitter();
  subscriptions: Array<Subscription>;
  visibleConfirmWindow;
  canNotAddEvent;
  eventAdded;
  loading = false;
  dotClass;
  private day;
  private month;
  private year;

  constructor(
    private calendarService: CalendarService,
    private permissionsService: PermissionsService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
    this.subscriptions = [];
    this.setDots();
    this.getDate();
  }

  private getDate () {
    this.day  = this.event.start.substring(8, 10);
    this.month  = this.event.start.substring(5, 7);
    this.year  = this.event.start.substring(2, 4);
  }

  get eventDate() {
    return `${this.day}/${this.month}/${this.year}`;
  }

  private setDots() {
    if (this.event.relevance < 30) {
      this.dotClass = 'red';
    }
    if ((this.event.relevance >= 30) && (this.event.relevance < 70)) {
      this.dotClass = 'orange';
    }
    if (this.event.relevance >= 70) {
      this.dotClass = 'green';
    }
  }

  eventAction(event) {
    if (event.isMyEvent) {
      this.openConfirmModal();
    } else {
      this.checkAbilityToAddEvents(event);
    }
  }

  private checkAbilityToAddEvents(event) {
    this.addEventToMyEvents(event);
  }

  private addEventToMyEvents(event) {
    this.emitDisablingButtons.emit(true);
    this.loading = true;
    const body = {
      id: event.id,
      title: event.title,
      description: event.description,
      category: event.category,
      relevance: event.relevance || 0,
      start: event.start,
      end: event.end
    };
    this.subscriptions.push(this.calendarService.addEvent(this.venueId, event.external_id, body)
      .subscribe((data) => {
        this.eventAdded = true;
        this.event = data['event'];
        this.event.isMyEvent = true;
        this.loading = false;
        this.onAddEventAction.emit(event);
        this.emitDisablingButtons.emit(false);
      },
        (err) => {
          if (err.error.message.includes('to add more than')) {
            this.emitDisablingButtons.emit(false);
            this.loading = false;
            this.canNotAddEvent = true;
          } else {
            this.handleForbiddenError(err);
          }
        }));
  }

  removeEventFromMyEvents() {
    this.subscriptions.push(this.calendarService.removeEvent(this.venueId, this.event.id)
      .subscribe( () => {
        this.onRemovingEventAction.emit(this.event);
        this.event.isMyEvent = false;
        this.closeConfirmModal();
      }, (err) => this.handleForbiddenError(err))
    );
  }

  private openConfirmModal() {
    this.visibleConfirmWindow = true;
  }

  closeConfirmModal() {
    this.visibleConfirmWindow = false;
  }

  closeInfoModal() {
    this.canNotAddEvent = false;
  }

  closeAddInfoModal() {
    this.eventAdded = false;
  }

  getDistance(distance) {
    return ((Math.round(distance / 1000 * 100) / 100) );
  }

  private handleForbiddenError (err) {
    if (err.status === 403) {
      this.permissionsService.fetchPermissionsByVenue(this.venueId);
      this.router.navigate(['../details'], { relativeTo: this.route });
    }
    return throwError(err);
  }

}
