import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '../store/store';
import { CONSTANTS } from '../constants';
import { UserService } from '../services/user/user.service';
import { SystemService } from '../services/system/system.service';
import { ChatService } from '../services/chat/chat.service';
import { NotificationsService } from '../services/chat/notifications.service';
import { filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Injectable()
export class VenueIdResolve implements Resolve<any> {
  constructor(
    private store: Store,
    private chat: ChatService,
    private notifications: NotificationsService,
    private userService: UserService,
    private systemService: SystemService) {
  }

  resolve() {
    let reload;
    this.store.select('firstVenueId').subscribe(data => {
      reload = !data;
    });
    if (reload) {
      const user$ = this.userService.fetchCurrentUser();
      const system$ = this.systemService.getSystemInfo();
      const chats$ = this.chat.fetchAllChats();
      return new Promise(resolve => {
        combineLatest(user$, system$, chats$)
          .subscribe(() => {
            if (this.notifications.venueId) {
              const venueId = this.notifications.venueId;
              this.notifications.venueId = undefined;
              resolve({firstVenueId: venueId, openGeneralChat: true, reload: false});
            } else {
              const venueIdFromLocalStorage = localStorage.getItem(CONSTANTS.VENUE_ID_PATH);
              if (venueIdFromLocalStorage) {
                resolve({firstVenueId: venueIdFromLocalStorage, openGeneralChat: false, reload: true});
              }
              if (venueIdFromLocalStorage) {
                resolve({firstVenueId: venueIdFromLocalStorage, openGeneralChat: false, reload: false});
              } else {
                this.store.select('firstVenueId')
                  .pipe (
                    filter((res: any) => res)
                  )
                  .subscribe(data => {
                    resolve({firstVenueId: data, openGeneralChat: false, reload: true});
                  });
              }
            }
          });
      });
    } else {
      if (this.notifications.venueId) {
        const venueId = this.notifications.venueId;
        return new Promise(resolve => {
          this.notifications.venueId = undefined;
          resolve({firstVenueId: venueId, openGeneralChat: true, reload: false});
        });
      } else {
        const venueIdFromLocalStorage = localStorage.getItem(CONSTANTS.VENUE_ID_PATH);
        if (venueIdFromLocalStorage) {
          return new Promise(resolve => {
            resolve({firstVenueId: venueIdFromLocalStorage, openGeneralChat: false, reload: true});
          });
        }
        if (venueIdFromLocalStorage) {
          return new Promise(resolve => {
            resolve({firstVenueId: venueIdFromLocalStorage, openGeneralChat: false, reload: false});
          });
        } else {
          return new Promise(resolve => {
            this.store.select('firstVenueId')
              .pipe (
                filter((res: any) => res)
              )
              .subscribe(data => {
                resolve({firstVenueId: data, openGeneralChat: false, reload: true});
              });
          });
        }

      }
    }



  }
}
