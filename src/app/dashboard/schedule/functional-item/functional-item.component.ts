import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PublicationComponent } from '../publication/publication.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicationProxyService } from '../../../core/services/publication/publication-proxy.service';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe';
import { FACEBOOK_DEFAULT_POST_TYPE, POST_TYPE, SRC_TYPE } from '../publication/publication.constants';
import {
  CTA_BUTTON,
  LINK_POST_TYPE
} from '../publication/publication-section/facebook-publication/linked-section/link-constants';
import { LinkedPostService } from '../../../core/services/publication/linked-post.service';

@AutoUnsubscribe
@Component({
  selector: 'sl-functional-item',
  templateUrl: './functional-item.component.html',
  styleUrls: ['./functional-item.component.scss'],
})

export class FunctionalItemComponent implements OnInit {
  @ViewChild(PublicationComponent) publicationComponent: PublicationComponent;
  @Output() onPostCreate = new EventEmitter();
  @Output() onPostCreateAndCopy = new EventEmitter();
  @Input() type;
  @Input() channels;
  @Input() dissableBtn;
  visiblePostWindow;
  visibleConfirmWindow;
  closedWindow;
  postToEdit;
  postAction;

  constructor(
    private router: Router,
    private publicationProxyService: PublicationProxyService,
    private route: ActivatedRoute,
    private linkedPostService: LinkedPostService) {
  }

  ngOnInit() {
  }

  closePostModal() {
    this.visiblePostWindow = false;
    this.closeConfirmModal();
    this.closedWindow = true;
    this.publicationProxyService.clearCurrentPost();
    this.linkedPostService.clearData();
  }

  public createClick(post?, action?, date?) {
    this.publicationProxyService.fbPostType.next(FACEBOOK_DEFAULT_POST_TYPE.title);
    if (date) {
      this.setDateForPost(date);
    }
    this.postAction = action ? {actionName: action, postId: post._id} : null;
    if (post) {
      this.setPost(post);
      this.postToEdit = post;
    } else {
      this.clearPost();
      this.postToEdit = null;
    }
    this.channelsExists ? this.openPostModal() : this.redirectToChannels();
  }

  setDateForPost(date) {
    this.publicationProxyService.setDateForPost(date);
  }

  private setPost(post) {
    if (this.isAlbumPost(post)) {
      this.setAlbumPost(post);
      return;
    }
    if (this.isLinkedPost(post)) {
      this.postIsLinked(post) ? this.setLinkedPost(post) : this.setCarouselPost(post);
      return;
    }
    this.setSimplePost(post);

  }

  isLinkedPost(post) {
    if (!post.subtype) {
      return false;
    }
    return this.postIsLinked(post) || this.postIsCarousel(post);
  }

  postIsLinked(post) {
    return post.subtype === LINK_POST_TYPE.LINKED;
  }

  postIsCarousel(post) {
    return post.subtype === LINK_POST_TYPE.CAROUSEL;
  }

  setAlbumPost(post) {
    this.publicationProxyService.fbPostType.next(post.subtype);
    this.setBasePost(post);
    this.publicationProxyService.albumFiles = this.albumFiles(post);
    this.publicationProxyService.albumName = post.subtype_meta.album_name;
  }

  setLinkedPost(post) {
    this.publicationProxyService.fbPostType.next(POST_TYPE.LINKED);
    this.setBasePost(post);
    this.setBaseLinkedPost(post);
  }

  setBaseLinkedPost(post) {
    this.linkedPostService.setSiteLinkForLinkedPost(post.subtype_meta.link);
    this.setCallToActionButton(post);
  }

  setCallToActionButton(post) {
    let postCTA;
    if ( this.postIsLinked(post)) {
      postCTA = post.subtype_meta.call_to_action;
    } else {
      postCTA = post.subtype_meta.child_attachments[0].call_to_action;
    }
    if (postCTA) {
      const ctaButton = Object.keys(CTA_BUTTON).find(key => key === postCTA.type);
      if (ctaButton) {
        this.linkedPostService.generalLinkedPost.callToActionButton = {key: ctaButton, value: CTA_BUTTON[ctaButton]};
      }
    }
  }

  setCarouselPost(post) {
    this.publicationProxyService.fbPostType.next(POST_TYPE.LINKED);
    this.setBasePost(post);
    this.setBaseLinkedPost(post);
    post.subtype_meta.child_attachments.forEach(item => {
      this.linkedPostService.carousel.push(this.linkedPostService.getGeneralCarouselItem(item) as any);
    });
  }

  setSimplePost(post) {
    this.setBasePost(post);
    this.publicationProxyService.file = this.fileObject(post);
  }

  setBasePost(post) {
    this.publicationProxyService.description = {value: post.message, valid: true};
    this.publicationProxyService.schedule.dateForEdit = this.publicationProxyService.getTimezoneDate(post.date, post.timezone);
    this.publicationProxyService.schedule.timezone = post.timezone;
    this.publicationProxyService.mentions = post.mentions;
  }

  albumFiles(post) {
    return post.medias.map(media => this.albumObject(media));
  }

  albumObject(media) {
    return {desc: media.caption ? media.caption : '', url: media.url, type: media['@type'] ? media['@type'] : 'image', name: ''};
  }

  isAlbumPost(post) {
    return post.subtype && post.subtype === 'album';
  }

  fileObject(post) {
    switch (post.type) {
      case 'picture': return {url: post.pictures[0], type: SRC_TYPE.IMAGE, name: SRC_TYPE.IMAGE};
      case 'video': return {url: post.video, type: post.type};
      case 'text': return null;
    }
  }

  private clearPost() {
    this.publicationProxyService.description = null;
  }

  redirectToChannels() {
    this.router.navigate(['../channels'],
      { queryParams: { openAddModal: 'true' }, relativeTo: this.route});
  }

  get channelsExists() {
    return this.channels.length;
  }

  openPostModal() {
    this.visiblePostWindow = true;
  }

  closeConfirmModal() {
    this.visibleConfirmWindow = false;
  }

  openConfirmModal() {
    this.visibleConfirmWindow = true;
  }

  onWindowClose() {
    this.publicationProxyService.isEmptyPost() ? this.closePostModal() : this.openConfirmModal();
  }

  onCreatePost() {
    this.onPostCreate.emit();
    this.closePostModal();
  }

  onCreateAndCopyPost() {
    this.postAction = null;
    this.onPostCreateAndCopy.emit();
  }

}
