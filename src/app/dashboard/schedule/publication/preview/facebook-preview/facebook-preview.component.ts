import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PublicationProxyService} from '../../../../../core/services/publication/publication-proxy.service';
import { FACEBOOK_DESKTOP_DESCRIPTION_LIMIT, FACEBOOK_DESKTOP_DESCRIPTION_LIMIT_ROWS, FACEBOOK_MOBILE_DESCRIPTION_LIMIT,
  NETWORKS
} from '../../publication.constants';
import { fadeInAnimation } from '../../../../../shared/animations/fade-in.animation';
import { LinkedPostService } from '../../../../../core/services/publication/linked-post.service';
import { AutoUnsubscribe } from '../../../../../shared/decorators/auto-unsubscribe';

@AutoUnsubscribe
@Component({
  selector: 'sl-facebook-preview',
  templateUrl: './facebook-preview.component.html',
  styleUrls: ['./facebook-preview.component.scss'],
  animations: [fadeInAnimation],
})

export class FacebookPreviewComponent implements OnChanges {
  @Input() desktopMode;
  @Input() description;
  @Input() mentions;
  descriptionLimit = FACEBOOK_DESKTOP_DESCRIPTION_LIMIT;
  descriptionLimitRows = FACEBOOK_DESKTOP_DESCRIPTION_LIMIT_ROWS;
  NETWORKS = NETWORKS;

  constructor(
    public publicationProxyService: PublicationProxyService,
    private linkedPostService: LinkedPostService) {
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

  isImageOrAlbum() {
    return this.isImage() || this.publicationProxyService.isValidAlbumPost();
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

  getChannelLink() {
    return this.publicationProxyService.getNetworkChannelLink();
  }

  isContent() {
    return (this.publicationProxyService.validDescription()) ||
      (!!this.publicationProxyService.file  && this.publicationProxyService.isFbStatusPost()) ||
      (this.publicationProxyService.isValidAlbumPost() || this.isCarousel()) ||
      this.showWebsitePreview();
  }

  isLinkedPost() {
    return this.publicationProxyService.isLinkedPost();
  }

  showWebsitePreview() {
    return (this.publicationProxyService.isFbStatusPost() &&
      this.publicationProxyService.descriptionHasValidLink() &&
      !this.publicationProxyService.isSrc())
    || (this.publicationProxyService.isLinkedPost() &&
        this.linkedPostService.siteLinkForLinkedPost.getValue() &&
        !this.linkedPostService.isCarouselPost());
  }

  sitePreviewLoading() {
    return this.linkedPostService.siteLinkMetadataLoading.getValue();
  }

  isCarousel() {
    return this.linkedPostService.carousel.length;
  }

  siteData() {
    return {
      url: this.getUrl(),
      metadata: this.linkedPostService.siteLinkMetadata.getValue(),
      callToActionButton: this.linkedPostService.getCtaButton()
    };
  }

  getUrl() {
    if (this.publicationProxyService.isLinkedPost()) {
      return this.linkedPostService.siteLinkForLinkedPost.getValue();
    }
    if (this.publicationProxyService.isFbStatusPost()) {
      return this.linkedPostService.siteLinkForStatusPost.getValue();
    }
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

  numberOfPhotos() {
    return this.publicationProxyService.albumFiles.length;
  }

  getNewPhotosText() {
    return this.numberOfPhotos() > 1 ? 'newPhotos' : 'newPhoto';
  }

  isDate() {
    return this.publicationProxyService.isScheduledPost();
  }

  isFbAlbumPost() {
    return this.publicationProxyService.isFbAlbumPost();
  }

  isFbStatusPost() {
    return this.publicationProxyService.isFbStatusPost();
  }

  carousel() {
    return this.linkedPostService.carousel;
  }

  validCarouselFiles() {
    return this.linkedPostService.validCarouselFiles();
  }
}
