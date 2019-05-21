import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as  momentTimezone from 'moment-timezone';
import {
  CTA_BUTTON,
  LINK_POST_TYPE
} from '../../publication/publication-section/facebook-publication/linked-section/link-constants';
import { NETWORKS, SRC_TYPE } from '../../publication/publication.constants';
import { LinkedPostService } from '../../../../core/services/publication/linked-post.service';

@Component({
  selector: 'sl-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit, OnDestroy {

  @Input() post;
  canOpenChat;
  showWarning;
  moment: any;

  constructor(private linkedPostService: LinkedPostService) {
  }

  ngOnInit () {
    this.checkPostDate();
    this.checkLink();
    if (this.post.subtype_meta && this.post.subtype_meta.link) {
      this.linkedPostService.getMetagata(this.post.subtype_meta.link);
    }
  }

  sitePreviewLoading() {
    return this.linkedPostService.siteLinkMetadataLoading.getValue();
  }

  checkLink() {
    if (!this.post.subtype_meta || !this.post.subtype_meta.link) {
      return;
    }
    this.linkedPostService.getLinkMetadata(this.post.subtype_meta.link);
  }

  private checkPostDate () {
    const postDate = moment(this.post.date);
    const startWarningFrom = postDate.clone().subtract(72, 'hours');
    const disableChatFrom = postDate.clone().subtract(48, 'hours');
    const currentDate = moment();
    this.showWarning = currentDate > startWarningFrom;
    this.canOpenChat = currentDate < disableChatFrom;
  }

  private get carousel () {
    return (this.post.type === 'carousel' && this.post.medias) ?
      this.post.medias.map((m) => ({url: m.url, type: m['@type'] ? m['@type'] : 'picture'})) : [];
  }

  private get pictures () {
    return (this.post.type === 'picture') && this.post.pictures ?
      this.post.pictures.map((pic) => ({ url: pic, type: 'picture'})) :
      [];
  }

  private get videos () {
    return this.post.type === 'video' && this.post.video ? [{ url: this.post.video, type: 'video'}] : [];
  }

  get media () {
    return [...this.carousel, ...this.pictures, ...this.videos];
  }

  getDate() {
    return moment(this.postTimezoneDate()).format('Do') + ' ' + moment(this.postTimezoneDate()).format('MMM').toUpperCase();
  }

  postTimezoneDate() {
    return momentTimezone.tz(this.post.date, this.getPostTimezone());
  }

  getPostTimezone() {
    return this.post.timezone ? this.post.timezone : momentTimezone.tz.guess();
  }

  getTime() {
    return moment(this.postTimezoneDate()).format('HH:mm');
  }

  getPostStatus(status) {
    if (status === 'publish_error') {
      return 'Error';
    }
    return status;
  }
  getPostTimezoneText() {
    return this.post.timezone ? this.post.timezone : 'Local Time';
  }

  isErrorPost() {
    return this.post.status === 'publish_error';
  }
  getErrorMessage() {
    if (!this.isErrorPost()) {
      return;
    }
    return this.post.error_message;
  }

  isSiteData() {
    if (this.post.subtype_meta && this.post.subtype_meta.link) {
      return true;
    }
  }

  siteData() {
    if (!this.post.subtype_meta || !this.post.subtype_meta.link) {
      return;
    }
    return {
      url: this.post.subtype_meta.link,
      metadata: this.linkedPostService.siteLinkMetadata.getValue(),
      callToActionButton: {value: this.getCtaButton()}
    };
  }

  getCtaButton() {
    if (!this.post.subtype_meta.call_to_action) {
      return;
    }
    if (this.post.subtype_meta.call_to_action.type === 'NO_BUTTON') {
      return '';
    }
    return CTA_BUTTON[this.post.subtype_meta.call_to_action.type] || '';
  }

  isLinkedPostCarousel() {
    return this.post.subtype === LINK_POST_TYPE.CAROUSEL;
  }

  isLinkedPost() {
    return this.post.subtype === LINK_POST_TYPE.LINKED;
  }

  carouselFiles() {
    this.post.subtype_meta.child_attachments.map(item => {
      if (item.picture) {
        item.file = {type: SRC_TYPE.PICTURE, url: item.picture};
      }
      if (item.video) {
        item.file = {type: SRC_TYPE.VIDEO, url: item.video};
      }
      if (item.call_to_action) {
        item.callToActionButton = {value: CTA_BUTTON[item.call_to_action.type] || ''};
      }
    });
    return this.post.subtype_meta.child_attachments;
  }

  isFbPost() {
    return this.post.network === NETWORKS.FACEBOOK;
  }

  ngOnDestroy() {
    this.linkedPostService.clearData();
  }
}
