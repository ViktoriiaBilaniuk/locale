import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store} from '../../../core/store/store';
import { ChatService } from '../../../core/services/chat/chat.service';
import { MessageTypes } from '../../../core/services/chat/message-types';
import { TrackingSerivce } from '../../../core/services/tracking/tracking.service';
import { CHAT_CONSTANTS } from './chat.constants';
import { fadeInAnimation } from '../../../shared/animations/fade-in.animation';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe';
import { filter } from 'rxjs/internal/operators';
import { STATUS_CONSTANTS } from '../../../shared/components/status-filter/status-filter.constants';
import { EXPAND, EXPAND_STATUS } from '../../header/expand-chat/expand-constants';

@AutoUnsubscribe
@Component({
  selector: 'sl-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
  animations: [fadeInAnimation],
})
export class ChatsComponent implements OnInit, OnDestroy {
  @Input() venueId;
  @Input() expand;
  @ViewChild('actionArea') actionArea: ElementRef;
  private notificationSubscription: any = null;
  private subscriptions = [];

  chats = [];
  userId;
  userType;
  loading = true;
  refreshBody;

  constructor(
    private track: TrackingSerivce,
    private store: Store,
    private chatService: ChatService) {
  }

  ngOnInit() {
    this.subscribeOnExpandStatus();
    this.checkChatInfo();
    this.fetchChats();
    this.subscribeForPost();
  }

  subscribeOnExpandStatus() {
    this.subscriptions.push(
      this.store.select(EXPAND)
        .subscribe(status => {
          if (status === EXPAND_STATUS.CLOSED) {
            this.goToChatList();
          }
        })
    );
  }

  checkChatInfo() {
    this.store.select('selectedChatId')
      .pipe(
        filter((res: any) => res)
      )
      .subscribe(selectedChatId => {
        this.store.select('selectedChat')
          .pipe(
            filter((res: any) => res)
          )
          .subscribe(selectedChat => {
            if (selectedChatId && selectedChat) {
              this.chatService.selectedChatId = selectedChatId;
              this.chatService.selectedChat.next(selectedChat);
            } else {
              this.resetChats();
            }
          });
      });
  }

  private resetChats() {
    this.chatService.selectedChatId = undefined;
  }

  fetchChats() {
    this.store.select('venue-chats')
      .pipe(
        filter((res: any) => res)
      )
      .subscribe(data => {
        this.loading = false;
        this.userType = this.store.value['current-user'].type;
        this.userId = data.user_id || data.venue_employee_id;
        this.chats = data.venue_chats;
        this.calculateUnreadMessagesCount();
        this.subscribeForNotifications();
      });
  }

  calculateUnreadMessagesCount() {
    const count = this.chats.reduce((sum, chat) => {
      return sum + chat.unread_count;
    }, 0);
    this.chatService.unreadMessCount = count;
  }

  subscribeForPost () {
    this.subscriptions.push(this.chatService.postId
      .pipe(
        filter((res: any) => res)
      )
      .subscribe((postId) => {
        this.chatService.sendMessage(
          {
            type: MessageTypes.TEXT,
            content: {text: ''}
          },
          this.generalChat.venue_chat_model_id._id, postId)
          .subscribe( () => {
            this.selectGeneralChat();
          });
      }));
  }

  private get generalChat () {
    return this.chats.find((chat) => chat.venue_chat_model_id.type === CHAT_CONSTANTS.CHAT_TYPE);
  }

  selectGeneralChat () {
    const oldChatId = this.chatService.selectedChatId;
    const chatId = this.generalChat.venue_chat_model_id._id;
    this.track.openChat(chatId);
    this.chatService.selectedChat.next(this.generalChat);
    this.chatService.selectedChatId = chatId;
    if (oldChatId && oldChatId !== chatId) {
      this.refreshBody = !this.refreshBody;
    }
  }

  private subscribeForNotifications () {
    if (this.notificationSubscription) {
      return;
    }
    this.store.select('firebase-login')
      .pipe(
        filter((res: any) => res)
      )
      .subscribe(() => {
        this.notificationSubscription = this.chatService.getNotifications(this.userId, this.userType).valueChanges()
          .pipe(
            filter((value: any) => value && value.length)
          )
          .subscribe(this.handleNotifications.bind(this),
            (error) => {
              console.log(error);
            });
      });

  }

  handleNotifications (value: any) {
    const notification = value[value.length - 1];
    this.incrementUnreadCount(notification.venue_id, notification, notification.chat_id);
    this.calculateUnreadMessagesCount();
  }

  private incrementUnreadCount (venueId, notification, chatId) {
    if (venueId !== this.venueId) {
      return;
    }
    const venueChat = this.chats.find((chat) => chat.venue_chat_model_id._id === chatId);
    venueChat.unread_count += 1;
    venueChat.venue_chat_model_id.last_message = notification.last_message;
  }

  get openedChatId() {
    return this.chatService.selectedChatId;
  }

  get openedChat() {
    return this.chatService.selectedChat.getValue();
  }

  get chatBodyHeight() {
    if (!this.actionArea) {
      return;
    }
    return `calc(100vh - 48px - 48px - 80px - ${this.actionArea.nativeElement.offsetHeight}px)`;
  }

  goToChatList() {
    this.chatService.selectedChatId = undefined;
    this.refrechChates();
  }

  refrechChates() {
    this.chatService.fetchVenueChats(this.venueId).subscribe();
    this.fetchChats();
  }

  get currentChatName() {
    return this.isGeneralChat(this.openedChat) ? 'Chat.general' : this.getChatName(this.openedChat);
  }

  isGeneralChat(chat) {
    return chat.venue_chat_model_id.type === CHAT_CONSTANTS.CHAT_TYPE;
  }

  getChatName (chat) {
    return chat.venue_chat_model_id.participants.find((user) => user.participant_id !== this.userId).display_name;
  }

  private get GeneralChat() {
    return this.chats.filter((chat) => this.isGeneralChat(chat));
  }

  private get UnansweredChats () {
    const res = this.chats.filter((chat) => (chat.unread_count && !this.isGeneralChat(chat)));
    return this.timeSort(res);
  }

  private get AllAnsweredChats() {
    const res = this.chats.filter(chat => !chat.unread_count && !this.isGeneralChat(chat) && chat.venue_chat_model_id.last_message.time);
    return this.timeSort(res);
  }

  private get AllChats() {
    const res = this.chats.filter(chat => !this.isGeneralChat(chat) && chat.venue_chat_model_id.last_message.time);
    return this.timeSort(res);
  }

  timeSort(array) {
    array.sort((f, s) => {
      const first = f.venue_chat_model_id.last_message.time;
      const second = s.venue_chat_model_id.last_message.time;
      return second - first;
    });
    return array;
  }

  textSorting (array) {
    array.sort((a, b) => {
      if (this.getChatName(a) > this.getChatName(b)) { return 1; }
      if (this.getChatName(a) < this.getChatName(b)) { return -1; }
    });
    return array;
  }

  private get ChatsWithoutMessages() {
    const chats = this.chats.filter(chat => !chat.venue_chat_model_id.last_message.time && !this.isGeneralChat(chat));
    return this.textSorting(chats);
  }

  get SortedChats() {
    return [...this.GeneralChat, ...this.AllChats, ...this.ChatsWithoutMessages];
  }

  ngOnDestroy() {
    this.store.set('venues-chats', null);
  }
}
