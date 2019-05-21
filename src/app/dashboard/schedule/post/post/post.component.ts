import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { TrackingSerivce } from '../../../../core/services/tracking/tracking.service';
import {
  ACTION_TYPE,
  COPY_POST_MENU_ITEM,
  DELETE_POST_MENU_ITEM,
  EDIT_POST_MENU_ITEM
} from '../../publication/publication.constants';
import * as  momentTimezone from 'moment-timezone';

@Component({
  selector: 'sl-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: any;
  @Input() postManagementPermission: any;
  @Output() onEdit = new EventEmitter();
  @Output() onCopy = new EventEmitter();
  @Output() onDelete = new EventEmitter();

  moment: any;
  canOpenChat: boolean;
  showWarning: boolean;
  menuIsActive;
  visibleDetailsWindow;
  menuItems = [];
  visibleConfirmWindow;

  constructor(
    private chatService: ChatService,
    private track: TrackingSerivce) {
    this.moment = moment;
  }

  ngOnInit () {
    this.checkPostDate();
    this.setPostMenuItems();
  }

  setPostMenuItems() {
    if (this.post.status === 'published') {
      this.menuItems = this.post.subtype === 'album' ?
        [COPY_POST_MENU_ITEM] :
        [COPY_POST_MENU_ITEM, DELETE_POST_MENU_ITEM];
    } else {
      this.menuItems = [EDIT_POST_MENU_ITEM, COPY_POST_MENU_ITEM, DELETE_POST_MENU_ITEM];
    }
  }

  private checkPostDate () {
    const postDate = moment(this.post.date);
    const startWarningFrom = postDate.clone().subtract(72, 'hours');
    const disableChatFrom = postDate.clone().subtract(48, 'hours');
    const currentDate = moment();
    this.showWarning = currentDate > startWarningFrom;
    this.canOpenChat = currentDate < disableChatFrom;
  }

  openChat () {
    if (this.chatService.postId.getValue() !== this.post.id) {
      this.chatService.postId.next(this.post._id);
    }
    this.track.chatOpenedFromPosts(this.post._id);
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

  get channelsCount () {
    return this.post.channels.length;
  }

  openDetailsModal() {
    this.visibleDetailsWindow = true;

  }

  optionClick(option) {
    switch (option.title) {
      case ACTION_TYPE.EDIT: this.onEdit.emit(this.post); break;
      case ACTION_TYPE.COPY: this.onCopy.emit(this.post); break;
      case ACTION_TYPE.DELETE: this.openConfirmModal(); break;
    }
  }

  deleteClick() {
    this.onDelete.emit(this.post);
    this.closeConfirmModal();
  }

  closeDetailsModal() {
    this.visibleDetailsWindow = false;
  }

  closeConfirmModal() {
    this.visibleConfirmWindow = false;
  }

  openConfirmModal() {
    this.visibleConfirmWindow = true;
  }

  getPostStatus(status) {
    if (status === 'publish_error') {
      return 'Error';
    }
    return status;
  }

  postTimezoneDate() {
    return momentTimezone.tz(this.post.date, this.getPostTimezone());
  }

  getPostTimezone() {
    return this.post.timezone ? this.post.timezone : momentTimezone.tz.guess();
  }

  getPostTimezoneText() {
    return this.post.timezone ? this.post.timezone : 'Local Time';
  }

  isErrorPost() {
    return this.post.status === 'publish_error';
  }

}
