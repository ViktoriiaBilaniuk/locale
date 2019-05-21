import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChatService } from '../core/services/chat/chat.service';
import { ActivatedRoute } from '@angular/router';
import { VenueService } from '../core/services/venue/venue.service';
import { Store } from '../core/store/store';
import { PermissionsService } from '../core/services/permissions/permissions.service';
import { Subscription } from 'rxjs';
import { NotificationsService } from '../core/services/chat/notifications.service';
import { fadeInAnimation } from '../shared/animations/fade-in.animation';
import { AutoUnsubscribe } from '../shared/decorators/auto-unsubscribe';
import { filter } from 'rxjs/internal/operators';
import { EXPAND, EXPAND_STATUS } from './header/expand-chat/expand-constants';
import { Permissions } from '../core/services/permissions/permissions.constant';

@AutoUnsubscribe
@Component({
  selector: 'sl-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [fadeInAnimation],
})
export class DashboardComponent implements OnInit {
  expandStatus;
  venueId: string;
  subscriptions: Array<Subscription> = [];
  venueIdSubscription$;
  permissions;

  constructor(
    private venueService: VenueService,
    private route: ActivatedRoute,
    private notification: NotificationsService,
    private permissionsService: PermissionsService,
    private store: Store,
    private cd: ChangeDetectorRef,
    private chat: ChatService) {
    this.notification.subscribeForPushNotifications();
  }

  ngOnInit() {
    this.subscribeOnExpandStatus();
    this.checkPermissions();
    this.subscriptions.push(
      this.route.data.subscribe((data: any) => {
        const chatId = this.notification.chatId;
        if (this.chatSectionIsClosed()) {
          this.openChatSection();
        }
        data.venueData.openGeneralChat ? this.setVenue(data.venueData.firstVenueId, data.venueData.reload, chatId) :
          this.setVenue(data.venueData.firstVenueId, data.venueData.reload);
      }));
  }
  openChatSection() {
    this.store.set(EXPAND, EXPAND_STATUS.OPEN);
    this.cd.detectChanges();
  }

  chatSectionIsClosed() {
    const storeValue = this.store.value;
    return (storeValue as any).expand === EXPAND_STATUS.CLOSED;
  }


  subscribeOnExpandStatus() {
    this.subscriptions.push(this.store.select(EXPAND)
      .pipe(
        filter((res: any) => res)
      )
      .subscribe(status => {
        this.expandStatus = status;
      })
    );
  }

  isExpandedChat() {
    return this.expandStatus === EXPAND_STATUS.EXPANDED;
  }

  onVenueSelect(venueId, chatId?) {
    this.setVenue(venueId, true, chatId);
  }

  setVenue(venueId, reload, chatId?) {
    if (reload || chatId) {
      this.venueId = venueId;
      this.store.set('venueId', venueId);
      this.setVenueToLocalStorage(venueId);
      this.fetchVenueDetails(venueId);
      this.checkPermissions();
      this.subscriptions.push(
      this.chat.fetchVenueChats(venueId)
        .pipe (
          filter((res: any) => res)
        )
        .subscribe((res) => {
          if (chatId && this.chat.selectedChatId !== chatId) {
            this.chat.selectedChatId = undefined;
            this.cd.detectChanges();
            parent.focus();
            window.focus();
            const chat = res.venue.venue_chats.filter(item => item.venue_chat_model_id._id === chatId)[0];
            if (chat && this.chat.selectedChatId !== chatId) {
              this.chat.selectedChat.next(chat);
              this.chat.selectedChatId = chatId;
              this.cd.detectChanges();
            }
          }
        }));
    }
  }

  setVenueToLocalStorage(venueId) {
    localStorage.setItem('sl-venueId', venueId);
  }

  checkPermissions() {
    this.subscriptions.push(
    this.store.select('permissions')
      .pipe(
        filter((res: any) => res)
      )
      .subscribe((data) => {
        this.permissions = data;
      }));
  }

  fetchVenueDetails(id) {
    this.subscriptions.push(this.venueService.fetchDetails(id).subscribe());
    this.chat.fetchVenueChats(id);
    this.permissionsService.fetchPermissionsByVenue(id);
  }

  getRightSectionWidth() {
    switch (this.expandStatus) {
      case EXPAND_STATUS.OPEN: return 'section__right_open';
      case EXPAND_STATUS.CLOSED: return 'section__right_closed';
      case EXPAND_STATUS.EXPANDED: return 'section__right_expanded';
    }
  }

  getContentWidth() {
    if (!this.chatPermissionForCurrentVenue) {
      return 'content_whole-width';
    }
    switch (this.expandStatus) {
      case EXPAND_STATUS.OPEN: return 'content_open';
      case EXPAND_STATUS.CLOSED: return 'content_whole-width';
      case EXPAND_STATUS.EXPANDED: return 'content_collapsed';
    }
  }

  get chatPermissionForCurrentVenue() {
    return this.permissions.find(perm => perm === Permissions.CHAT);
  }

  collapseMenu() {
    return this.expandStatus === EXPAND_STATUS.EXPANDED;
  }
}
