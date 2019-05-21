import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Permissions } from '../../core/services/permissions/permissions.constant';

@Component({
  selector: 'sl-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnChanges {
  venues;
  expand = true;
  chatPermissionForCurrentVenue;
  reachOutPermissionForCurrentVenue;
  @Output() onVenueSelect = new EventEmitter();
  @Input() venueId;
  @Input() permissions;

  constructor() { }

  ngOnChanges(changes) {
    if (changes.permissions) {
      this.setPermissions();
    }
  }

  setPermissions() {
    this.chatPermissionForCurrentVenue = this.permissions.find(item => item === Permissions.CHAT);
    this.reachOutPermissionForCurrentVenue = this.permissions.find(item => item === Permissions.REACH_OUT);
  }

  onVenueSelectEvent(event) {
    this.onVenueSelect.emit(event);
  }

  onExpand(expand) {
    this.expand = expand;
  }
}
