import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { TrackingSerivce } from '../../../../core/services/tracking/tracking.service';
import { DATE_FORMAT, HOUR_FORMAT } from '../../../date-formats-constants';

@Component({
  selector: 'sl-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.scss']
})
export class ChatItemComponent implements OnInit {

  @Input() chat;
  @Input() userId;
  dateFormat = DATE_FORMAT;
  hourFormat = HOUR_FORMAT;

  constructor(
    private chatService: ChatService,
    private track: TrackingSerivce) { }

  ngOnInit() {
  }

  getFormattedDate (time) {
    const date = moment.unix(time / 1000);
    if (time) {
      return this.getIsTodaysMessage(date) ? date.format(this.hourFormat) : date.format(this.dateFormat);
    } else {
      return '';
    }
  }

  getIsTodaysMessage (time) {
    const today = moment();
    const date = moment(time);
    return date.diff(today, 'days') === 0 && date.day() === today.day();
  }

  getChatName (chat) {
    return this.isGeneralChat(chat) ? 'Chat.general' :
      chat.venue_chat_model_id.participants.find((user) => user.participant_id !== this.userId).display_name;
  }

  getUserImage(chat) {
    const chatUser = chat.venue_chat_model_id.participants.find((user) => user.participant_id !== this.userId);
    return chatUser.image ? chatUser.image : '';
  }

  isGeneralChat(chat) {
    return chat.venue_chat_model_id.type === 'general';
  }

  chatClick() {
    const chatId = this.chat.venue_chat_model_id._id;
    this.track.openChat(chatId);
    this.chatService.selectedChat.next(this.chat);
    this.chatService.selectedChatId = chatId;
  }

  get lastMessage () {
    if (!this.chat || !this.chat.venue_chat_model_id || !this.chat.venue_chat_model_id.last_message) {
      return;
    }
    return this.chat.venue_chat_model_id.last_message.content;
  }

}
