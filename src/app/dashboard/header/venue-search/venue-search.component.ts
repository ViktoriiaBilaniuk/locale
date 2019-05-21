import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '../../../core/store/store';
import { Router } from '@angular/router';
import { ChatService } from '../../../core/services/chat/chat.service';
import { combineLatest } from 'rxjs';
import { TrackingSerivce } from '../../../core/services/tracking/tracking.service';
import * as moment from 'moment';
import { Thread } from '../../../models/left-sidebar/thread';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe';
import { PermissionsService } from '../../../core/services/permissions/permissions.service';
import { filter } from 'rxjs/internal/operators';

@AutoUnsubscribe
@Component({
  selector: 'sl-venue-search',
  templateUrl: './venue-search.component.html',
  styleUrls: ['./venue-search.component.scss'],
})
export class VenueSearchComponent implements OnInit, OnChanges, OnDestroy {
  venueMenuIsActive: Boolean;
  selectedVenue = {name: ''};
  reset;
  venues;
  searchText: string;
  searchResults: any;
  threads: Thread[] = [];
  unansweredCount;
  chatPermissionForCurrentVenue;

  @ViewChild('searchInput') searchInput;
  @Input() venueId;
  @Output() onVenueSelect = new EventEmitter();

  private venueChats: any;
  private all = {
    title: 'Leftbar.active',
    highlightActive: true
  };

  private subscriptions = [];
  private userId: string;
  private userType: string;
  private notificationSubscription: any = null;
  private allPermissions;

  constructor(
    private store: Store,
    private router: Router,
    private track: TrackingSerivce,
    private chatService: ChatService,
    private permissionsService: PermissionsService) {
    this.permissionsService.fetchPermissions();
  }

  ngOnInit() {
    this.fetchChatsAndAccess();
    this.fetchChatsWithPermissions();
    this.checkPermissions();
  }

  fetchChatsAndAccess() {
    const user$ = this.store.select('current-user').pipe(filter((res: any) => res));
    const firebaseAuth$ = this.store.select('firebase-login').pipe(filter((res: any) => res));
    const chatAccess$ = combineLatest(user$, firebaseAuth$, (user, firebase) =>
      ({user, firebase}));
    this.subscriptions.push(chatAccess$
      .pipe(
        filter((res: any) => res.user && res.firebase)
      )
      .subscribe((res) => {
        this.userType = res.user.type;
        this.userId = res.user.id;
        this.subscribeForNotifications();
      }));
  }

  fetchChatsWithPermissions() {
    const chats$ = this.store.select('venues-chats');
    const permissions$ = this.store.select('all-permissions');
    const chatAccess$ = combineLatest(chats$, permissions$);
    this.subscriptions.push(chatAccess$
      .pipe(
        filter((res: any) => res[0] && res[1])
      )
      .subscribe(([chats, permissions]) => {
        this.allPermissions = permissions;
        this.venueChats = chats;
        this.setThreads();
      })
    );
  }

  setThreads() {
    this.threads.length = 0;
    this.threads = this.sortedVenues.slice();
    this.unansweredCount = this.allUnansweredCount;
  }

  logout() {
    this.router.navigate(['/auth']);
  }

  ngOnChanges(changes) {
    if (changes.venueId) {
      this.fetchVenues();
    }
  }

  fetchVenues() {
    this.subscriptions.push(this.store.select('venues')
      .pipe(
        filter((res: any) => res)
      )
      .subscribe(data => {
        this.venues = data;
        this.fetchFirstVenue();
      }));
  }

  fetchFirstVenue() {
    let res = this.venues.filter(venue => venue._id === this.venueId)[0];
    if (!res) {
      res = this.venues.filter(venue => venue.id === this.venueId)[0];
    }
    this.selectedVenue = Object.assign(res);
  }

  chooseVenue(venue) {
    const venueId = venue.id ? venue.id : venue._id;
    this.resetChats();
    this.onVenueSelect.emit(venueId);
    this.onClickedOutside();
    this.searchText = '';
    if (this.searchInput) {
      this.searchInput.nativeElement.value = this.selectedVenue.name;
    }
  }

  checkPermissions() {
    this.store.select('permissions')
      .pipe(
        filter((res: any) => res)
      )
      .subscribe((data) => {
        this.chatPermissionForCurrentVenue = !!data.find(item => item === 'chat');
      });
  }

  resetChats() {
    this.chatService.selectedChatId = undefined;
  }

  toggleMenu() {
    this.venueMenuIsActive = !this.venueMenuIsActive;
  }

  onClickedOutside() {
    this.venueMenuIsActive = false;
  }

  inputFocus() {
    this.venueMenuIsActive = true;
    this.search('');
  }

  search (searchText) {
    this.searchText = searchText;
    if (!this.searchText) {
      return;
    }
    const res = this.convertStringToRegExp(searchText);
    this.searchResults = {
      highlightActive: true,
      title: '',
      emptyText: 'Leftbar.noResults',
      venues: this.allOtherVenues.venues
        .filter((venue: any) => res.test(venue.name))
        .map((venue) => {
          return {id: venue.id, name: venue.name.replace(res, this.markMatch)};
        })
    };
    this.track.searchChat();
  }

  handleNotifications (value: any) {
    const notification = value[value.length - 1];
    this.incrementUnreadCount(notification.venue_id, notification.chat_id);
    this.setThreads();
  }

  private markMatch (text) {
    return `<mark>${text}</mark>`;
  }

  /**
   * @description
   * Reassigning and group venues for array of venues. Venues:
   * threads[0] - reach out venues. Have additional message why they are reached out
   * threads[1] - all venues
   *
   * @memberof LeftSidebarComponent
   */


  get sortedVenues() {
    if (!this.venueChats || !this.venueChats.length) {
      return;
    }
    return [this.allOtherVenues];
  }

  get allUnansweredCount() {
    if (!this.threads) {
      return;
    }
    const activeThread = this.threads.find(thread => thread.title === 'Leftbar.active');
    if (!activeThread) {
      return;
    }
    return activeThread.venues.reduce((accumulator, venue) => (accumulator + venue.messages), 0);
  }

  get allOtherVenues() {
    if (!this.venueChats || !this.venueChats.length) {
      return;
    }
    return {
      ...this.all,
      venues: this.allVenueChatsWithUnanswered
    };
  }

  private get allVenueChatsWithUnanswered() {
    const unanswered = this.UnansweredVenues;
    const all = this.allVenueChats;
    all.forEach(venue => {
      const venueWithUnread = unanswered.find(unansweredVenue => {
        return unansweredVenue.id === venue.id;
      });
      if (!venueWithUnread) {
        unanswered.push(venue);
      }
    });

    return unanswered;
  }

  private get allVenueChats () {
    const res = this.venueChats
      .map((allVenues) => this.mapVenueWithMessages(allVenues));
    return res;
  }

  private get UnansweredVenues () {
    if (!this.venueChats || !this.venueChats.length) {
      return;
    }
    const res = this.venueChats
      .filter((venue) => this.getUnreadCount(venue.venue_chats))
      .map((unansweredVenues) => this.mapVenueWithMessages(unansweredVenues));
    res.sort((f, s) => {
      const first = moment(f.updated).valueOf();
      const second = moment(s.updated).valueOf();
      return second - first;
    });
    return res;
  }

  private incrementUnreadCount (venueId, chatId) {
    const venue = this.venueChats.find((chat) => chat.venue_id === venueId);
    if (!venue) {
      return;
    }
    const venueChat = venue.venue_chats.find((chat) => chat.venue_chat_model_id === chatId);

    venueChat.unread_count += 1;
    venue.updated_at = moment.utc();
  }

  private getUnreadCount (venueChats) {
    if (!venueChats) {
      return;
    }
    return venueChats.reduce((sum, chat) => (sum += chat.unread_count), 0);
  }

  private mapVenueWithMessages (venue) {
    return {id: venue.venue_id, name: venue.venue.name, messages: this.getUnreadCount(venue.venue_chats), updated: venue.updated_at};
  }

  private subscribeForNotifications () {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
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
          .subscribe(this.handleNotifications.bind(this), () => {});
      });
  }

  /**
   * @description
   * Convert input string and returns proper Regular Expression
   *
   * @memberof LeftSidebarComponent
   *
   * @param stringToConvert string value that will be converted to RegExp
   * @returns Proper regular expression
   */
  private convertStringToRegExp(valueToConvert): RegExp {
    const specSymbolsRegex = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    const result = valueToConvert
      .split('')
      .map((char) => specSymbolsRegex.test(char) ? `\\${char}` : char)
      .join('');

    return new RegExp(result, 'i');
  }

  ngOnDestroy () {
    this.store.set('venues-chats', null);
  }
}
