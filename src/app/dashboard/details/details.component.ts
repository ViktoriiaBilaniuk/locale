import { Component, OnInit, OnDestroy } from '@angular/core';
import { VenueDetails } from '../../models/right-sidebar/venue-details/venue-details';
import { VenueService } from '../../core/services/venue/venue.service';
import { Store } from '../../core/store/store';
import { TrackingSerivce } from '../../core/services/tracking/tracking.service';
import { Permissions } from '../../core/services/permissions/permissions.constant';
import { OpeningHoursEditor } from '../../models/right-sidebar/venue-details/opening-hours-editor';
import { OpeningHours } from '../../models/right-sidebar/venue-details/opening-hours';
import { TimeEntryEditor } from '../../models/right-sidebar/venue-details/time-entry-editor';
import { TimeEntry } from '../../models/right-sidebar/venue-details/time-enrty';
import { fadeInAnimation } from '../../shared/animations/fade-in.animation';
import { AutoUnsubscribe } from '../../shared/decorators/auto-unsubscribe';
import { filter } from 'rxjs/internal/operators';


@Component({
  selector: 'sl-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  animations: [fadeInAnimation],
})
export class DetailsComponent implements OnInit, OnDestroy {

  venueDetails: VenueDetails;
  subscriptions = [];
  private permissions: Array<string>;

  constructor(
    private venueService: VenueService,
    private store: Store,
    private track: TrackingSerivce
  ) { }

  ngOnInit() {
    this.store.set('tutorialKey', 'profile');
    this.getPermissions();
    this.track.detailsTabOpened();
    this.subscriptions.push(this.store
      .select('venue-details')
      .subscribe((venue: VenueDetails) => {
        this.venueDetails = venue;
      })
    );
  }

  private getPermissions () {
    this.subscriptions.push(this.store.select('permissions')
      .pipe(
        filter((res: any) => res)
      )
      .subscribe((permissions) => {
        this.permissions = permissions;
      })
    );
  }

  get canEditDetails () {
    return this.permissions && this.permissions.indexOf(Permissions.PROFILE) !== -1;
  }

  /**
   * @description
   * copy venueDetails, edit it property and send request to update venue
   *
   * @memberof DetailsComponent
   *
   * @param fieldToEdit property that was edited
   * @param eventValue value of edited property
   */
  updateVenueDetails(fieldToEdit: string, eventValue: any) {
    const newVenue = {};
    switch (fieldToEdit) {
      case 'opening_hours': newVenue[fieldToEdit] = this.convertOpeningHours(eventValue); break;
      default: newVenue[fieldToEdit] = eventValue; break;
    }
    this.subscriptions.push(this.venueService.updateDetails(this.venueDetails.id, newVenue).subscribe());
    this.track.venueDetailsChanged(fieldToEdit);
  }

  /**
   * @description
   * Takes array of OpeningHoursEditor entities and convert it to type OpeningHours
   *
   * @memberof DetailsComponent
   *
   * @param openingHours array that should be converted
   * @returns converted array
   */
  private convertOpeningHours(openingHours: OpeningHoursEditor[]): OpeningHours[] {
    openingHours = openingHours.map(
      (day: OpeningHoursEditor) => Object.assign({}, day, {
        items: day.is_open ? day.items.map(
          (opening: TimeEntryEditor) => this.pick(<TimeEntryEditor>opening, 'label', 'order', 'from', 'to') as TimeEntry
        ) : []
      })
    );
    return openingHours.map(
      (day) => this.pick(<OpeningHoursEditor>day, 'weekday', 'is_open', 'order', 'items') as OpeningHours
    );
  }

  /**
   * @description
   * Pick a set of properties from object with type <T> and copy it to object with type <K>
   *
   * @memberof DetailsComponent
   *
   * @param obj the object of one interface that need to be copied
   * @param keys the keys that should be copied from 'obj'
   * @returns object of type <K> with copied set of props
   */
  private pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
    const copy = {} as Pick<T, K>;
    keys.forEach((key) => copy[key] = obj[key]);

    return copy;
  }
  ngOnDestroy () {
    this.store.set('tutorialKey', null);
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
