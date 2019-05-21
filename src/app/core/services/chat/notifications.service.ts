import { Injectable } from '@angular/core';
import { Store } from './../../store/store';
import { ChatService } from './../../services/chat/chat.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
import { MessageTypes } from './../../services/chat/message-types';
import { filter } from 'rxjs/internal/operators';

declare let Notification;

@Injectable()
export class NotificationsService {
  hasNotificationPermissions = false;
  chats;
  chatId;
  venueId;
  private subscriptions = [];
  constructor(
    private store: Store,
    private chat: ChatService,
    private router: Router,
    private auth: AuthService) {
  }

  getFirebaseToken () {
    if (!this.store.value['firebaseToken']) {
      this.auth.getFirebaseToken();
      return;
    } else {
      this.auth.loginToFirebase(this.store.value['firebaseToken']);
    }
  }

  subscribeForPushNotifications () {
    this.subscriptions.push(this.store.select('current-user')
      .pipe(
        filter((value: any) => value)
      )
      .subscribe((user) => {
        this.getFirebaseToken();
        this.subscriptions.push(this.store.select('firebaseToken')
          .pipe(
            filter((value: any) => value)
          )
          .subscribe(() => {
            this.askPermissions();
            this.subscriptions.forEach((s) => s.unsubscribe());
            this.subscriptions.push(this.chat.getNotifications(user.id, user.type)
              .valueChanges()
              .pipe(
                filter((value: any) => value && value.length)
              )
              .subscribe(this.handleNotifications.bind(this), () => {}));
          }));
      }));
  }

  handleLogout () {
    this.unsubscribe();
  }

  private handleNotifications (value: any) {
    const notification = value[value.length - 1];
    this.showNotification(this.getNotificationBody(notification.last_message), notification.venue_id, notification.chat_id);
  }

  private showNotification (message, venueId, chatId) {
    const img = '/assets/images/push-logo.png';
    if (this.hasNotificationPermissions && !document.hasFocus()) {
      const notification = new Notification('New message', {body: message, icon: img});
      notification.onclick = () => {
        parent.focus();
        window.focus();
        this.venueId = venueId;
        this.chatId = chatId;
        this.router.navigate(['./dashboard/details']);
      };
    }
  }

  private askPermissions () {
    if (!('Notification' in window)) {
      return;
    } else if (Notification.permission === 'granted') { // Let's check whether notification permissions have already been granted
      // If it's okay let's create a notification
      this.hasNotificationPermissions = true;
    } else if (Notification.permission !== 'denied') { // Otherwise, we need to ask the user for permission
      Notification.requestPermission(this.updatePermission.bind(this));
    }
  }

  private updatePermission (permission) {
    if (permission === 'granted') {
      this.hasNotificationPermissions = true;
    }
  }

  private getNotificationBody (message) {
    let text = '';
    switch (message.type) {
      case MessageTypes.FILE :
      case MessageTypes.PDF :
        text = 'File';
        break;
      case MessageTypes.IMAGE:
        text = 'Picture';
        break;
      case MessageTypes.VIDEO:
        text = 'Video';
        break;
      case MessageTypes.POST:
        text = 'Post';
        break;
      case MessageTypes.TEXT:
      case MessageTypes.NOTIFICATION:
        text = message.content.text;
        break;
    }
    return text;
  }

  unsubscribe() {
    this.subscriptions.forEach( s => s.unsubscribe());
  }
}
