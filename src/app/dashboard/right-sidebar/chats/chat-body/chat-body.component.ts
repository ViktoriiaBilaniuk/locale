import { switchMap } from 'rxjs/operators';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { Store } from '../../../../core/store/store';
import { TrackingSerivce } from '../../../../core/services/tracking/tracking.service';
import { fadeInAnimation } from '../../../../shared/animations/fade-in.animation';
import { AutoUnsubscribe } from '../../../../shared/decorators/auto-unsubscribe';
import { filter } from 'rxjs/internal/operators';
import { EXPAND, EXPAND_STATUS } from '../../../header/expand-chat/expand-constants';

@AutoUnsubscribe
@Component({
  selector: 'sl-chat-body',
  templateUrl: './chat-body.component.html',
  styleUrls: ['./chat-body.component.scss'],
  animations: [fadeInAnimation],
})
export class ChatBodyComponent implements OnInit, OnChanges {

  initialMessageCount = 20;
  total: number;
  scrollToNewMessages: boolean;
  takeCount$ = new Subject<number>();
  messages;
  participants = [];
  userId: string;
  @Input() venueId: string;
  @Input() expand: boolean;
  @Input() refresh: string;
  @ViewChild('chat') chat: any;


  private subscriptions: any[] = [];

  constructor(
    private chatService: ChatService,
    private track: TrackingSerivce,
    private store: Store) { }

  ngOnInit() {
    this.getUser();
    this.setChat();
  }

  ngOnChanges(changes) {
    if (changes.refresh) {
      this.setChat();
    }
  }

  setChat() {
    this.resetChat();
    this.participants = this.getParticipants();
    this.subscribeForMessages();
    this.takeCount$.next(this.initialMessageCount);
  }

  get chatObj() {
    return this.chatService.selectedChat.getValue();
  }

  private subscribeForMessages () {
    const query = this.chatService.getChat(this.chatId);
    this.subscriptions.push(query
      .valueChanges()
      .subscribe((res) => {
        this.total = res.length;
      }));
    const queryObservable = this.takeCount$.pipe(switchMap((take) => (
      this.chatService
      .getChat(this.chatId, take)
      .valueChanges()
    )));
    this.subscriptions.push(queryObservable
      .subscribe((messages) => {
        this.messages = messages;
      }));
    this.subscriptions.push(query.snapshotChanges(['child_added'])
      .subscribe((messages) => {
        if (this.chatId) {
          this.total += 1;
          this.scrollToNewMessages = true;
          const message = this.getLastIncomingMessage(messages);
          if (message && this.chatObj.lastReadMessageKey !== message.key) {
            this.setLastReadMessage(message.key);
          }
        }
      }));
  }

  private resetChat () {
    this.messages = null;
    this.unsubscribe();
    this.scrollToNewMessages = true;
  }

  private getParticipants() {
    return this.chatObj.venue_chat_model_id.participants;
  }

  private unsubscribe() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private get chatId() {
    return this.chatService.selectedChatId;
  }

  get hasMessages () {
    return this.total > this.loadedMessagesCount;
  }

  private get loadedMessagesCount () {
    return this.messages ? this.messages.length : 0;
  }

  loadOlderMessages () {
    if (!this.hasMessages) {
      return;
    }
    this.takeCount$.next(this.loadedMessagesCount + 20);
    this.track.loadChatHistory(this.chatService.selectedChatId);
  }

  onScroll (event) {
    if (!event.target.scrollTop) {
      this.scrollToNewMessages = false;
      this.loadOlderMessages();
      event.target.scrollTop = 5;
    }
  }

  getUser() {
    this.subscriptions.push(this.store.select('current-user')
      .pipe(
        filter((user: any) => user)
      )
      .subscribe((user) => {
        this.userId = user.id;
      })
    );
  }

  getLastIncomingMessage (messages) {
    const incoming = messages.filter((message) => {
      const content = message.payload.val();
      return content._user !== this.userId || content.type === 'notification';
    });
    return incoming.length ? incoming[incoming.length - 1] : null;
  }

  setLastReadMessage(key) {
    this.chatService.setLastReadMessage(this.venueId, this.chatId, key);
  }
}
