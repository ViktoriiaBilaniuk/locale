import { Component, OnInit } from '@angular/core';
import { TrackingSerivce } from './../core/services/tracking/tracking.service';
import { UserService } from '../core/services/user/user.service';
import { fadeInAnimation } from '../shared/animations/fade-in.animation';

@Component({
  selector: 'sl-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [fadeInAnimation],
})
export class SettingsComponent implements OnInit {

  constructor(
    private userService: UserService,
    private track: TrackingSerivce) { }

  ngOnInit () {
    this.userService.fetchCurrentUser();
    this.track.settingsOpened();
  }
}
