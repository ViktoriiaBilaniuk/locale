import { Component } from '@angular/core';
import { PublicationProxyService } from '../../../../core/services/publication/publication-proxy.service';
import { NETWORKS } from '../publication.constants';

@Component({
  selector: 'sl-publication-section',
  templateUrl: './publication-section.component.html',
  styleUrls: ['./publication-section.component.scss']
})
export class PublicationSectionComponent {
  NETWORKS = NETWORKS;

  constructor(
    private publicationProxyService: PublicationProxyService) {
  }

  isFacebook() {
    return this.publicationProxyService.isFacebook();
  }

  isInstagram() {
    return this.publicationProxyService.isInstagram();
  }

  isTwitter() {
    return this.publicationProxyService.isTwitter();
  }

}
