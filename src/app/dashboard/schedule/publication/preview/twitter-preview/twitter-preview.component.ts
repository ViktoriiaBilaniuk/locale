import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { FACEBOOK_DESKTOP_DESCRIPTION_LIMIT, FACEBOOK_MOBILE_DESCRIPTION_LIMIT, NETWORKS } from '../../publication.constants';
import { PublicationProxyService } from '../../../../../core/services/publication/publication-proxy.service';
import { fadeInAnimation } from '../../../../../shared/animations/fade-in.animation';

@Component({
  selector: 'sl-twitter-preview',
  templateUrl: './twitter-preview.component.html',
  styleUrls: ['./twitter-preview.component.scss'],
  animations: [fadeInAnimation],
})
export class TwitterPreviewComponent implements OnChanges {
  @Input() desktopMode;
  @Input() description;
  @Input() mentions;
  @ViewChild('twitterVideoPreview') twitterVideoPreview: ElementRef;
  descriptionLimit = FACEBOOK_DESKTOP_DESCRIPTION_LIMIT;
  NETWORKS = NETWORKS;

  constructor(
    public publicationProxyService: PublicationProxyService) {
  }

  ngOnChanges(changes) {
    if (changes.desktopMode) {
      this.descriptionLimit = this.desktopMode ? FACEBOOK_DESKTOP_DESCRIPTION_LIMIT : FACEBOOK_MOBILE_DESCRIPTION_LIMIT;
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

  getImageUrl() {
    return this.publicationProxyService.getNetworkAvatarUrl();
  }

  getChannelName() {
    return this.publicationProxyService.getNetworkChannelName();
  }

  isContent() {
    return (this.publicationProxyService.description && this.publicationProxyService.description.value) ||
      !!this.publicationProxyService.file || !!this.publicationProxyService.albumFiles[0];
  }

  getChannelLink() {
    return this.publicationProxyService.getNetworkChannelLink();
  }

  isDate() {
    return this.publicationProxyService.isScheduledPost();
  }

}
