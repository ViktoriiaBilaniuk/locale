import { Component, Input, OnChanges } from '@angular/core';
import {
  INSTAGRAM_DESKTOP_DESCRIPTION_LIMIT,
  INSTAGRAM_DESKTOP_DESCRIPTION_LIMIT_ROWS,
  INSTAGRAM_MOBILE_DESCRIPTION_LIMIT,
  NETWORKS
} from '../../publication.constants';
import { PublicationProxyService } from '../../../../../core/services/publication/publication-proxy.service';
import { fadeInAnimation } from '../../../../../shared/animations/fade-in.animation';

@Component({
  selector: 'sl-instagram-preview',
  templateUrl: './instagram-preview.component.html',
  styleUrls: ['./instagram-preview.component.scss'],
  animations: [fadeInAnimation],
})
export class InstagramPreviewComponent implements OnChanges {

  @Input() desktopMode;
  @Input() description;
  @Input() mentions;
  descriptionLimit = INSTAGRAM_MOBILE_DESCRIPTION_LIMIT;
  descriptionLimitRows = INSTAGRAM_DESKTOP_DESCRIPTION_LIMIT_ROWS;
  NETWORKS = NETWORKS;

  constructor(
    public publicationProxyService: PublicationProxyService) {
  }

  ngOnChanges(changes) {
    if (changes.desktopMode) {
      this.descriptionLimit = this.desktopMode ?
        INSTAGRAM_DESKTOP_DESCRIPTION_LIMIT : INSTAGRAM_MOBILE_DESCRIPTION_LIMIT;
    }
  }

  isVideo() {
    return this.publicationProxyService.isVideo();
  }

  isImage() {
    return this.publicationProxyService.isImage();
  }

  localFileUrl() {
    return this.publicationProxyService.localFileUrl();
  }

  showMore() {
    this.descriptionLimit = 100000;
    this.descriptionLimitRows = 10000;
  }

  getImageUrl() {
    return this.publicationProxyService.getNetworkAvatarUrl();
  }

  getChannelName() {
    return this.publicationProxyService.getNetworkChannelName();
  }

  isContent() {
    return !!this.publicationProxyService.file || !!this.publicationProxyService.albumFiles[0];
  }

  getSeeMoreCondition() {
    if (!this.description) {
      return;
    }
    this.description = this.description.trim();
    const descElements = this.description.trim().split('\n');
    return this.description.trim().length > this.descriptionLimit ||
      (descElements.length > this.descriptionLimitRows && descElements[length + 1] !== '\n');
  }

  getChannelLink() {
    return this.publicationProxyService.getNetworkChannelLink();
  }

  isDate() {
    return this.publicationProxyService.isScheduledPost();
  }

}
