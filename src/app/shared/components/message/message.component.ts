import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { MessageTypes } from '../../../core/services/chat/message-types';
import { TrackingSerivce } from '../../../core/services/tracking/tracking.service';
import { HOUR_FORMAT, LONG_DATE_FORMAT } from '../../../dashboard/date-formats-constants';

@Component({
  selector: 'sl-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  showHeader: boolean;
  longDateFormat = LONG_DATE_FORMAT;
  hourFormat = HOUR_FORMAT;
  @Input() message;
  @Input() previousMessage;
  @Input() participants;
  @Input() searchResult;
  @Input() currentUserId;
  @Input() expand;

  constructor(public track: TrackingSerivce) { }

  ngOnInit() {
    if (!this.previousMessage || this.previousMessage._user !== this.message._user) {
      this.showHeader = true;
      return;
    }
    const currentMessageDate = moment(this.message.time);
    const previousMessageDate = moment(this.previousMessage.time);

    this.showHeader = currentMessageDate.diff(previousMessageDate, 'minutes') > 0 ||
    this.previousMessage.type === MessageTypes.NOTIFICATION;
  }

  get formattedDate () {
    const date = moment(this.message.time);
    return this.isTodaysMessage ? date.format(this.hourFormat) : date.format(this.longDateFormat);
  }

  get isTodaysMessage () {
    const today = moment();
    const date = moment(this.message.time);
    return date.diff(today, 'days') === 0 && date.day() === today.day();
  }

  get isText () {
    return this.message.type === MessageTypes.TEXT;
  }

  get isVideo () {
    return this.message.type === MessageTypes.VIDEO;
  }

  get isPost () {
    return this.message.type === MessageTypes.POST;
  }

  get isNotification () {
    return this.message.type === MessageTypes.NOTIFICATION;
  }

  get wrapIntoLink () {
    return !this.isVideo && !this.isPost && !this.isText;
  }

  get user () {
    return this.participants.find((user) => user.participant_id === this.message._user);
  }

  get isUrl () {
    const pattern = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/i;
    return pattern.test(this.message.content.text);
  }

  get userName () {
    return this.user ? this.user.display_name : 'Unknown';
  }

  get isCurrentUserMessage() {
    return this.user.participant_id === this.currentUserId;
  }

}
