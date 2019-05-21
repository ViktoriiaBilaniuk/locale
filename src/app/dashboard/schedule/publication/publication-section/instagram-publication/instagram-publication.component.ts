import { Component } from '@angular/core';
import { NETWORKS } from '../../publication.constants';

@Component({
  selector: 'sl-instagram-publication',
  templateUrl: './instagram-publication.component.html',
  styleUrls: ['./instagram-publication.component.scss']
})
export class InstagramPublicationComponent {
  NETWORKS = NETWORKS;
}
