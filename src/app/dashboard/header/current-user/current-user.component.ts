import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Store } from '../../../core/store/store';
import { UserService } from '../../../core/services/user/user.service';
import { TrackingSerivce } from '../../../core/services/tracking/tracking.service';
import { NotificationsService } from '../../../core/services/chat/notifications.service';
import { ChatService } from '../../../core/services/chat/chat.service';
import { filter } from 'rxjs/internal/operators';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe';

@AutoUnsubscribe
@Component({
  selector: 'sl-current-user',
  templateUrl: './current-user.component.html',
  styleUrls: ['./current-user.component.scss']
})
export class CurrentUserComponent implements OnInit {
  @Input() reachOutPermissionForCurrentVenue;
  menuIsActive: boolean;
  user: any;
  allStatuses = [ { name: 'Online', value: 'active' },
    { name: 'Offline', value: 'offline' },
    { name: 'Away', value: 'away' }];
  subscriptions = [];
  reachOutReasons = [];
  showReachOutDropdown: boolean;

  constructor(
    private auth: AuthService,
    private store: Store,
    private cd: ChangeDetectorRef,
    private userService: UserService,
    private track: TrackingSerivce,
    private chatService: ChatService,
    private notification: NotificationsService
  ) { }

  ngOnInit() {
    this.getVenueId();
    this.getUser();
  }

  getVenueId() {
    this.subscriptions.push(this.store.select('venueId')
      .pipe(
        filter((res: any) => res)
      )
      .subscribe(venueId => {
        this.clearData();
        this.getChats(venueId);
      })
    );
  }

  clearData() {
    this.showReachOutDropdown = false;
    this.menuIsActive = false;
    this.reachOutReasons = [];
  }

  getUser () {
    this.subscriptions.push(this.store.select('current-user')
      .pipe(
        filter((user: any) => user)
      )
      .subscribe((user: any) => {
        this.user = user;
        this.cd.markForCheck();
      })
    );
  }

  getChats(venueId) {
    this.subscriptions.push(this.store.select('venues-chats')
      .pipe(
        filter((res: any) => res)
      )
      .subscribe(chats => {
        this.clearData();
        this.getReachOutForCurrentVenue(chats, venueId);
      })
    );
  }

  getReachOutForCurrentVenue(chats, venueId) {
    const currentVenue = chats.find(chat => chat.venue._id === venueId);
    if (currentVenue.reachOutReason) {
      this.reachOutReasons.push(currentVenue.reachOutReason);
    }
  }

  toggleMenu() {
    this.menuIsActive = !this.menuIsActive;
    this.showReachOutDropdown = false;
  }

  onClickedOutside() {
    this.menuIsActive = false;
    this.showReachOutDropdown = false;
  }

  logout() {
    this.clearChats();
    this.notification.handleLogout();
    this.track.logout();
    this.auth.logout();
  }

  private clearChats() {
    this.chatService.selectedChatId = undefined;
  }

  changeChatStatus (status) {
    this.userService.updateChatStatus(status);
    this.toggleMenu();
    this.track.userChangeStatus(status);
  }

  get chatStatuses () {
    return this.allStatuses.filter((s) => s.value !== this.chatStatus);
  }

  get chatStatus () {
    return this.user ? this.user.chat_status : '';
  }

  getStatusClass(status) {
    switch (status) {
      case 'active':
        return 'icon-check';
      case 'away':
        return 'icon-clock';
      case 'offline':
        return 'icon-ban';
    }
  }

  bellClick() {
    this.showReachOutDropdown = !this.showReachOutDropdown;
    this.menuIsActive = false;
  }

  isReachOut() {
    return this.reachOutPermissionForCurrentVenue && this.reachOutReasons && this.reachOutReasons.length;
  }

}
