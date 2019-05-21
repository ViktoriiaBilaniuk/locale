import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  DEFAULT_CHANNEL_NAME, DISCONNECTED_CHANNEL_ERROR_MESSAGE,
  FACEBOOK_DEFAULT_IMAGE_URL,
  FACEBOOK_MAX_DESCRIPTION_COUNT,
  INSTAGRAM_DEFAULT_IMAGE_URL,
  INSTAGRAM_MAX_DESCRIPTION_COUNT,
  NETWORKS,
  POST_TYPE,
  SRC_TYPE,
  TWITTER_DEFAULT_IMAGE_URL,
  TWITTER_MAX_DESCRIPTION_COUNT
} from '../../../dashboard/schedule/publication/publication.constants';
import * as  momentTimezone from 'moment-timezone';
import { NgxLinkifyjsService } from 'ngx-linkifyjs';

@Injectable()
export class PublicationProxyService {
  file;
  description = {value: '', valid: true};
  selectedChannels;
  mentions = [];

  // can be disconnected channels
  postChannel;
  schedule = {timezone: undefined, utcTimestamp: undefined, error: false, dateForEdit: undefined};
  albumFiles = [];
  albumName = '';

  // content pool variables
  scrollToNewContentPoolFiles = new BehaviorSubject(false);
  contentFilesSearchText = new BehaviorSubject('');
  contentFiles = [];
  contentFilesLoading;

  // post types variables
  fbPostType = new BehaviorSubject<any>('');

  network = new BehaviorSubject<any>('');
  disconnectedChannelErrorMessage = DISCONNECTED_CHANNEL_ERROR_MESSAGE;

  constructor(private linkifyService: NgxLinkifyjsService) { }

  clearCurrentPost() {
    this.file = null;
    this.albumFiles = [];
    this.albumName = '';
    this.description = null;
    this.selectedChannels = null;
    this.postChannel = null;
    this.schedule = {
      timezone: null,
      utcTimestamp: null,
      error: false,
      dateForEdit: null
    };
    this.mentions = [];
  }

  clearCurrentFile() {
    this.file = null;
  }

  isScheduledPost() {
    return this.schedule.timezone &&
      this.schedule.utcTimestamp &&
      !this.schedule.error;
  }

  isImage() {
    if (this.file && this.file.type) {
      return this.file.type.includes(SRC_TYPE.IMAGE) || this.file.type.includes(SRC_TYPE.PICTURE);
    }
  }

  isVideo() {
    if (this.file && this.file.type) {
      return this.file.type.includes(SRC_TYPE.VIDEO);
    }
  }

  isSrc() {
    return this.isImage() || this.isVideo();
  }

  isFbAlbumPost() {
    return this.fbPostType.getValue() === POST_TYPE.ALBUM;
  }

  isFbStatusPost() {
    return this.fbPostType.getValue() === POST_TYPE.STATUS;
  }

  isLinkedPost() {
    return this.fbPostType.getValue() === POST_TYPE.LINKED;
  }

  isEmptyPost() {
    return !this.descriptionValue() && !this.file && !this.validChannels();
  }

  descriptionValue() {
    if (!this.description || !this.description.value) {
      return;
    }
    return this.description.value;
  }

  descriptionHasValidLink() {
    return this.containsValidLink(this.descriptionValue());
  }

  containsValidLink(text) {
    if (!text) {
      return false;
    }
    return this.getFirstLink(text);
  }

  getFirstLink(text) {
    const links = this.fetchLinks(text);
    if ( links && links[0]) {
      return links[0].href;
    }
  }

  fetchLinks(value) {
    return this.linkifyService.find(value);
  }

  validDescription() {
    if (!this.description) {
      return false;
    }
    return this.description.valid && this.description.value !== '';
  }

  isValidAlbumPost() {
    return this.isFbAlbumPost() && this.albumFiles.length;
  }

  validChannels() {
    if (!this.selectedChannels) {
      return;
    }
    return !!this.selectedChannels.length;
  }

  isInstagram() {
    return this.networkValue() === NETWORKS.INSTAGRAM;
  }

  isFacebook() {
    return this.networkValue() === NETWORKS.FACEBOOK;
  }

  isTwitter() {
    return this.networkValue() === NETWORKS.TWITTER;
  }

  networkValue() {
    return this.network.getValue();
  }

  checkPostData() {
    this.cutDescription();
  }

  private cutDescription() {
    if (this.descriptionValue()) {
      const desc = this.description;
      this.description = {value: desc.value.slice(0, this.maxCount), valid: desc.valid};
    }
  }

  private get maxCount() {
    switch (this.network.value) {
      case NETWORKS.FACEBOOK: return FACEBOOK_MAX_DESCRIPTION_COUNT;
      case NETWORKS.INSTAGRAM: return INSTAGRAM_MAX_DESCRIPTION_COUNT;
      case NETWORKS.TWITTER: return TWITTER_MAX_DESCRIPTION_COUNT;
    }
  }

  private get defaultImageUrl() {
    switch (this.network.value) {
      case NETWORKS.FACEBOOK: return FACEBOOK_DEFAULT_IMAGE_URL;
      case NETWORKS.INSTAGRAM: return INSTAGRAM_DEFAULT_IMAGE_URL;
      case NETWORKS.TWITTER: return TWITTER_DEFAULT_IMAGE_URL;
    }
  }

  localFileUrl() {
    if (this.isValidAlbumPost()) {
      return this.albumFiles[0].url;
    }
    if (this.file) {
      return this.file.url;
    }
  }

  getNetworkAvatarUrl() {
    let channelIcon;
    if (this.selectedChannels && this.selectedChannels.length) {
      channelIcon = this.selectedChannels[0].profile_image_url;
    }
    return channelIcon ? channelIcon : this.defaultImageUrl;
  }

  getNetworkChannelName() {
    let channelName;
    if (this.isSelectedChannels) {
      channelName = this.selectedChannels[0].name;
    }
    if (channelName) {
      return channelName;
    }
    if (this.disconnectedChannelError()) {
      return this.postChannel.name;
    }
    return DEFAULT_CHANNEL_NAME;
  }

  get isSelectedChannels() {
    return this.selectedChannels && this.selectedChannels.length;
  }

  getNetworkChannelLink() {
    let channelLink;
    if (this.selectedChannels && this.selectedChannels.length) {
      channelLink = this.selectedChannels[0].source_url;
    }
    return channelLink ? channelLink : null;
  }

  disconnectedChannelError() {
    return !this.isEmptyPost() && !!this.postChannel && !this.isSelectedChannels;
  }

  getTimezoneDate(utcDate, timezone) {
    return momentTimezone.tz(utcDate, timezone).format();
  }

  setDateForPost(date) {
    const currentUserTimezone = momentTimezone.tz.guess();
    this.schedule.dateForEdit = this.getTimezoneDate(date, currentUserTimezone);
    this.schedule.timezone = currentUserTimezone;
  }

  getScheduleDateInPostTimezone() {
    return momentTimezone.tz(this.schedule.utcTimestamp, this.schedule.timezone);
  }

}
