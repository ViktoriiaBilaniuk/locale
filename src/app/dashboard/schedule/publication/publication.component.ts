import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { PublicationProxyService } from '../../../core/services/publication/publication-proxy.service';
import { ChannelsSectionComponent } from './channels-section/channels-section.component';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe';
import { Store } from '../../../core/store/store';
import { ChatService } from '../../../core/services/chat/chat.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { CreatePostService } from '../../../core/services/publication/create-post.service';
import { filter } from 'rxjs/operators';
import { PostErrorsHandlerService } from '../../../core/services/publication/post-errors-handler.service';
import { ACTION_TYPE, NETWORKS } from './publication.constants';
import {LinkedPostService} from '../../../core/services/publication/linked-post.service';

@AutoUnsubscribe
@Component({
  selector: 'sl-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss']
})
export class PublicationComponent implements OnInit, OnChanges {
  ACTION_TYPE = ACTION_TYPE;
  @ViewChild(ChannelsSectionComponent) channelsSectionComponent: ChannelsSectionComponent;
  @Input() closedWindow;
  @Input() postToEdit;
  @Input() channels;
  @Input() action;
  @Output() onPostCreate = new EventEmitter();
  @Output() onPostCreateAndCopy = new EventEmitter();
  venueId;
  selectedNetwork;
  desktopMode = true;
  visibleConfirmWindow;
  preSignedUrls = [];
  subscriptions = [];
  loading;
  copyPost;
  postStatus$;

  constructor(
    private publicationProxyService: PublicationProxyService,
    private store: Store,
    private utils: UtilsService,
    private chatService: ChatService,
    private postErrorsHandlerService: PostErrorsHandlerService,
    private createPostService: CreatePostService,
    private linkedPostService: LinkedPostService) {
    this.createPostService.resetData();
  }

  ngOnInit() {
    this.getVenueId();
  }

  private getVenueId() {
    this.subscriptions.push(this.store.select('venueId')
      .pipe(
        filter((res: any) => res)
      )
      .subscribe(venueId => {
        this.venueId = venueId;
        this.createPostService.venueId = venueId;
      })
    );
  }

  ngOnChanges(changes) {
    if (changes.closedWindow && !this.postToEdit && !this.getDateForEdit()) {
      this.clearCurrentPost();
    }
  }

  getDateForEdit() {
    return this.publicationProxyService.schedule.dateForEdit;
  }

  private clearCurrentPost() {
    this.publicationProxyService.clearCurrentPost();
    this.channelsSectionComponent.clearSelectedChannels();
    this.linkedPostService.clearData();
  }

  activateTab() {
    this.publicationProxyService.network.next(this.selectedNetwork);
    this.publicationProxyService.checkPostData();
    this.clearChannels();
    this.closeConfirmModal();
    this.iconClick(this.isFacebook);
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

  private clearChannels() {
    this.publicationProxyService.selectedChannels = [];
    this.channelsSectionComponent.clearSelectedChannels();
  }

  iconClick(bool) {
    this.desktopMode = bool;
  }

  description() {
    return this.publicationProxyService.description;
  }

  mentions() {
    return this.publicationProxyService.mentions;
  }

  private validDescription() {
    if (!this.description()) {
      return false;
    }
    return this.description().valid && this.description().value !== '';
  }

  private validAlbumPost() {
    return this.publicationProxyService.albumFiles.length && this.publicationProxyService.albumName;
  }

  validStatus() {
    switch (this.publicationProxyService.networkValue()) {
      case NETWORKS.FACEBOOK: return this.fbValidStatus();
      case NETWORKS.INSTAGRAM: return this.instaValidStatus();
      case NETWORKS.TWITTER: return this.twitterValidStatus();
    }
  }

  fbValidStatus() {
    const validChannelsAndDatetime = this.validChannels() && this.validScheduleDatetime();
    const statusPostValidState = validChannelsAndDatetime && (this.validDescription() || this.isValidSrc());
    if (this.isFbAlbumPost()) {
      return statusPostValidState && this.validAlbumPost();
    }
    if (this.isLinkedPost()) {
      return this.linkedPostService.isCarouselPost() ?
        validChannelsAndDatetime && this.linkedPostService.isValidCarousel() :
        validChannelsAndDatetime && this.linkedPostService.isLinkedPostValid();
    }
    return statusPostValidState;
  }

  isLinkedPost() {
    return this.publicationProxyService.isLinkedPost();
  }

  instaValidStatus() {
    return this.validChannels() && this.isValidSrc()  && this.validScheduleDatetime();
  }

  twitterValidStatus() {
    return this.validChannels() && (this.validDescription() || this.isValidSrc())  && this.validScheduleDatetime();
  }

  selectedChannels() {
    return this.publicationProxyService.selectedChannels;
  }

  validScheduleDatetime() {
    return !this.publicationProxyService.schedule.error;
  }

  private validChannels() {
    if (!this.selectedChannels()) {
      return;
    }
    return !!this.selectedChannels().length;
  }

  private isValidSrc() {
    return this.isSrc() ? !this.postErrorsHandlerService.fileSizeError.getValue() : this.isSrc();
  }

  private isSrc() {
    return (!!this.publicationProxyService.file || !!this.publicationProxyService.albumFiles[0]);
  }

  closeConfirmModal() {
    this.visibleConfirmWindow = false;
  }

  onTabClick(netw) {
    this.setSelectedNetowork(netw);
    if (!this.publicationProxyService.isEmptyPost() || !this.linkedPostService.isEmptyLinkedPost()) {
      this.openConfirmModal();
    } else {
      this.activateTab();
    }
  }

  onSetTab(netw) {
    this.setSelectedNetowork(netw);
    this.activateTab();
  }

  private setSelectedNetowork(netw) {
    this.selectedNetwork = netw;
  }

  private openConfirmModal() {
    this.visibleConfirmWindow = true;
  }

  onSaveAndCopy() {
    this.copyPost = true;
    this.startPostCreating();
  }

  onSave() {
    this.copyPost = false;
    this.startPostCreating();
  }

  private startPostCreating() {
    this.loading = true;
    if (this.publicationProxyService.isLinkedPost()) {
      this.linkedPostService.startPostCreating(this.action);
    } else {
      this.createPostService.startPostCreating(this.action);
    }
    this.subscribeOnPostStatus();
  }

  private subscribeOnPostStatus() {
    this.postStatus$ = this.createPostService.postCreated
      .pipe(
        filter((res: any) => res)
      )
      .subscribe(data => {
        this.loading = false;
        if (data.data) {
          this.checkCreateError(data.data);
          this.onFinishPublication();
        }
      });
  }

  private checkCreateError(data) {
    if (data.data.disconnected_channels && data.data.disconnected_channels.length) {
      this.utils.showInfoModal('Channels.warning', this.warningInfoText(data.data.disconnected_channels));
    } else {
      this.utils.showInfoModal('Channels.success', this.infoText());
    }
  }

  private onFinishPublication() {
    this.copyPost ? this.onPostCreateAndCopy.emit() : this.onPostCreate.emit();
    this.postStatus$.unsubscribe();
    this.createPostService.postCreated.next(null);
  }

  private warningInfoText(disconnectedChannels) {
    const channelsNames = disconnectedChannels.map(channel => channel.name).join(', ');
    return 'Your post has not been published for ' + channelsNames;
  }

  private infoText() {
    if (this.action && this.action.actionName && this.action.actionName === ACTION_TYPE.EDIT) {
      return 'Channels.postUpdated';
    }
    if (this.publicationProxyService.isScheduledPost()) {
      return 'Channels.postScheduled';
    }
    return 'Channels.postPublished';
  }

  private isFbAlbumPost() {
    return this.publicationProxyService.isFbAlbumPost();
  }
}
