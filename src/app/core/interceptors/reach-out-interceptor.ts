import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { ChatService } from '../services/chat/chat.service';
import { Store } from '../store/store';

const createPath = 'create';
const postPath = 'posts';
const chatsPath = 'chats/';
const messagePath = '/message';
const removePath = '/remove';

@Injectable()
export class ReachOutInterceptor implements HttpInterceptor {
  generalChatId: string;

  constructor(private chat: ChatService, private store: Store) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.subscribeOnVenueId();

    return next.handle(request)
      .pipe(
        tap ((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && this.isReachOutPath(event)) {
            this.chat.fetchAllChats().subscribe();
          }}),
      );
  }

  subscribeOnVenueId() {
    this.store.select('venueId')
      .pipe(
        filter((res: any) => res)
      )
      .subscribe(venueId => {
        this.subscribeOnVenueChats(venueId);
      });
  }

  subscribeOnVenueChats(venueId) {
    this.store.select('venues-chats')
      .pipe(
        filter((res: any) => res)
      )
      .subscribe(chats => {
        const chatsOfCurrentVenue = chats.find(chat => chat.venue_id === venueId).venue_chats;
        const generalChat = chatsOfCurrentVenue.find(chat => !chat.chat_name.includes('/'));
        if (generalChat) {
          this.generalChatId = generalChat.venue_chat_model_id;
        }
      });
  }

  isReachOutPath(event) {
    return this.isCreatePostPath(event.url) ||
      this.isSendMessageToGeneralChatPath(event.url) ||
      this.isDeletePostPath(event.url);
  }

  isDeletePostPath(url) {
    return url.includes(postPath) && url.includes(removePath);
  }

  isCreatePostPath(url) {
    return url.includes(createPath) && url.includes(postPath);
  }

  isSendMessageToGeneralChatPath(url) {
    return url.includes(chatsPath) && url.includes(messagePath) && this.generalChatId === this.getChatId(url);
  }

  getChatId(url) {
    const chatId = url.substring(
      url.indexOf(chatsPath) + 6,
      url.indexOf(messagePath)
    );
    return chatId;
  }
}

