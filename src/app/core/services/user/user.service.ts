import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONSTANTS } from '../../constants';
import { Store } from './../../store/store';
import { AuthService } from '../auth/auth.service';
import { tap } from 'rxjs/internal/operators';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class UserService {

  constructor(
    private http: HttpClient,
    private store: Store,
    private auth: AuthService) {
  }

  fetchCurrentUser () {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}profile/current-user`)
      .pipe(tap((response: any) => {
        if (response.user['venues'].length) {
          this.store.set('firstVenueId', response.user['venues'][0].id);
          this.store.set('venues', response.user['venues']);
          this.store.set('current-user', response.user);
        } else {
          this.auth.logout();
        }
      }));
  }

  /*fetchCurrentUser () {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}profile/current-user`)
      .subscribe((response: any) => {
        if (response.user['venues'].length) {
          this.store.set('firstVenueId', response.user['venues'][0].id);
          this.store.set('venues', response.user['venues']);
          this.store.set('current-user', response.user);
        } else {
          this.auth.logout();
        }
      });
  }*/

  changePassword (data) {
    return this.http.patch(`${CONSTANTS.API_ENDPOINT}profile/change-password`, data);
  }

  updateUser (data) {
    return this.http.patch(`${CONSTANTS.API_ENDPOINT}profile/current-user`, data)
      .pipe(
        tap((response: any) => {
          this.store.set('current-user', response.user);
        })
      );
  }

  updateChatStatus (status) {
    return this.http.patch(`${CONSTANTS.API_ENDPOINT}profile/chat-status/${status}`, {})
      .subscribe((response: any) => {
        this.store.set('current-user', response.user);
      });
  }

  getPreSignedUrl (data) {
    return this.http.post(`${CONSTANTS.API_ENDPOINT}profile/images/avatar/s3-signed-url`, data);
  }

  uploadProfilePhoto(url: string, file: File) {
    return this.http.put(url, file);
  }
}
