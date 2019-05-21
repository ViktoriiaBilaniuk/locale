import { Component } from '@angular/core';
import { NETWORKS } from '../../publication.constants';

@Component({
  selector: 'sl-twitter-publication',
  templateUrl: './twitter-publication.component.html',
  styleUrls: ['./twitter-publication.component.scss']
})
export class TwitterPublicationComponent {
  NETWORKS = NETWORKS;
}
