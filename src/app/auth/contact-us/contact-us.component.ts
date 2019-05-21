import { Component, OnInit, ViewChild } from '@angular/core';
import { TrackingSerivce } from '../../core/services/tracking/tracking.service';
import {fadeInAnimation} from '../../shared/animations/fade-in.animation';

@Component({
  selector: 'sl-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
  animations: [fadeInAnimation],
})
export class ContactUsComponent implements OnInit {
  @ViewChild('email') email;
  @ViewChild('site') site;
  constructor(private track: TrackingSerivce) { }

  ngOnInit() {
    this.track.contactUsOpened();
  }
}
