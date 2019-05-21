import { zip, BehaviorSubject, of } from 'rxjs';
import { filter, catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONSTANTS } from '../../constants';
import { Store } from '../../store/store';
import { AngularFireDatabase } from 'angularfire2/database';
import { TrackingSerivce } from './../tracking/tracking.service';
import { Router } from '@angular/router';

@Injectable()
export class ChatService {
  postId: BehaviorSubject<string>;
  hasChatAccess: any;
  selectedChat = new BehaviorSubject<any>('');
  participants = new BehaviorSubject<Array<any>>([]);
  selectedChatId = undefined;
  unreadMessCount;

  constructor (
    private http: HttpClient,
    private store: Store,
    private db: AngularFireDatabase,
    private router: Router,
    private track: TrackingSerivce) {

    this.postId = new BehaviorSubject('');
    const firebaseAuth$ = this.store.select('firebase-login').pipe(filter((res: any) => res));
    const user$ = this.store.select('current-user').pipe(filter((res: any) => res));
    this.hasChatAccess = zip(firebaseAuth$, user$, (authStatus, user) => ({authStatus, user}));
    this.store.select('venue-chats').pipe(
      filter((res: any) => res))
      .subscribe((venueChats) => {
        const generalChat = venueChats.venue_chats.find((chat) => chat.venue_chat_model_id.type === 'general');
        const participants = generalChat ? generalChat.venue_chat_model_id.participants : [];
        this.participants.next(participants);
      });
  }

  sendMessage (message, chatId, postId?) {
    if (postId) {
      message.postId = postId;
      this.postId.next(null);
    }
    this.track.sendChatMessage(message.type);
    return this.http.post(`${CONSTANTS.API_ENDPOINT}chats/${chatId}/message`, message);
  }

  fetchVenueChats (id) {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}chats/venues/${id}`).pipe(
      tap((res: any) => {
        this.store.set('venue-chats', res.venue);
      }));
  }

  getPreSignedUrl (data) {
    return this.http.post(`${CONSTANTS.API_ENDPOINT}chats/files/s3-signed-url`, data);
  }

  uploadFile(url: string, file: File) {
    return this.http.put(url, file).pipe(
      catchError((err) => {
        if (err.status === 200) {
          return of({});
        }
      }));
  }

/*  fetchAllChats () {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}chats/venues`)
      .subscribe((res: any) => {
        this.store.set('venues-chats', res.venues);
        this.store.set('venues', this.getAllVenues(res.venues));
        this.store.set('initialVenueId', this.getInitialVenue(res.venues));
      });
  }*/

  fetchAllChats () {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}chats/venues`)
      .pipe(
        tap((res: any) => {
          this.store.set('venues-chats', res.venues);
          this.store.set('venues', this.getAllVenues(res.venues));
          this.store.set('initialVenueId', this.getInitialVenue(res.venues));
        })
      );
  }

  getAllVenues(res) {
    return res.map(item => {
      return item.venue;
    });
  }

  getInitialVenue(res) {
    if (!res.length) {
      this.logout();
    } else {
      return res[0]._id;
    }

  }

  logout() {
    this.router.navigate(['/auth']);
  }

  setLastReadMessage (venueId, chatId, lastReadMessageKey) {
    return this.http.post(`${CONSTANTS.API_ENDPOINT}chats/venues/${venueId}/read/${chatId}`, {lastReadMessageKey})
      .subscribe(() => {
        this.updateUnreadMessagesInStore(venueId, chatId);
      });
  }

  getChat(chatId, take = null) {
    const queryFunction = ref => ref.limitToLast(take);
    return this.db.list(`/chats/${chatId}`, take ? queryFunction : null);
  }

  getNotifications (userId, userType) {
    const type = userType === 'user' ? 'U' : 'VE';
    return this.db.list(`users/${userId}-${type}/notifications/venue_chats`);
  }

  updateUnreadMessagesInStore(venueId, chatId) {
    const chats = [...this.store.value['venues-chats']];
    const venue = chats.find((chat) => chat.venue_id === venueId);
    const venueChat = venue.venue_chats.find((chat) => chat.venue_chat_model_id === chatId);
    if (venueChat) {
      venueChat.unread_count = 0;
    }
    this.store.set('venues-chats', chats);
    this.resetUnreadInVenueChats(venueId, chatId);
  }

  private resetUnreadInVenueChats (venueId, chatId) {
    const currentVenue = {...this.store.value['venue-chats']};
    if ((currentVenue as any).venue_id !== venueId) {
      return;
    }
    const venueChat = this.store.value['venue-chats'].venue_chats.find((chat) => chat.venue_chat_model_id._id === chatId);
    if (venueChat) {
      venueChat.unread_count = 0;
    }
    this.store.set('venue-chats', currentVenue);
  }

  refreshChats() {
    this.store.select('venueId').pipe(
      filter((res: any) => res))
      .subscribe(venueId => {
        this.fetchVenueChats(venueId).subscribe();
        this.fetchAllChats();
      });
  }
}
