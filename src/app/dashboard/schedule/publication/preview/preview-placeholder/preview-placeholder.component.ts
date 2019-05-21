import { Component, Input, OnInit } from '@angular/core';
import { fadeInAnimation } from '../../../../../shared/animations/fade-in.animation';
import { NETWORKS } from '../../publication.constants';

@Component({
  selector: 'sl-preview-placeholder',
  templateUrl: './preview-placeholder.component.html',
  styleUrls: ['./preview-placeholder.component.scss'],
  animations: [fadeInAnimation],
})
export class PreviewPlaceholderComponent implements OnInit {
  @Input() type;

  constructor() { }

  ngOnInit() {
  }

  getInfoMessage() {
    switch (this.type) {
      case NETWORKS.FACEBOOK: return 'Channels.typeDescriptionOrImage';
      case NETWORKS.INSTAGRAM: return 'Channels.addImage';
      case NETWORKS.TWITTER: return 'Channels.typeDescriptionOrImage';
    }
  }

}
