import { tap} from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '../../../models/responses';
import { Store } from '../../store/store';
import { CONSTANTS } from '../../constants';
import { AngularFireAuth } from 'angularfire2/auth';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private store: Store,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private firebaseAuth: AngularFireAuth
  ) {}

  /**
   * @description
   * Make post request with admins credentials+
   * => Parse response
   * => Set admin data for session
   *
   * @param {any} admin
   * @returns
   * @memberof AuthService
   */
  login(admin) {
    return this.http.post(`${CONSTANTS.API_ENDPOINT}auth/sign-in`, admin).pipe(
      tap((response: AuthResponse) => {
        this.store.set('admin', response.user);
        this.setAdminToStorage(response);
      }));
  }

  /**
   * @description
   * Clear session data(store&storage)
   *
   * @memberof AuthService
   */
  logout() {
    this.removeAdminFromStorage();
    this.removeFirebaseFromStorage();
    this.removeVenueIdFromStorage();
    this.store.clear();
    this.firebaseAuth.auth.signOut();
    this.router.navigate(['./auth']);
  }

  forgotPass(user) {
    return this.http.post(`${CONSTANTS.API_ENDPOINT}auth/forgot-password`, user);
  }

  resetPass(formValue, target: string, token: string) {
    return this.http.post(`${CONSTANTS.API_ENDPOINT}auth/reset-password/${target}`, formValue, {
      headers: {'Authorization': token}
    });
  }

  initPass(formValue, target: string, token: string) {
    return this.http.post(`${CONSTANTS.API_ENDPOINT}auth/init-password/${target}`, formValue, {
      headers: {'Authorization': token}
    });
  }

  /**
   * @description
   * Set admin data to storage
   *
   * @param {AuthResponse} response
   * @memberof AuthService
   */
  setAdminToStorage(response: AuthResponse) {
    localStorage.setItem(CONSTANTS.JWT_PATH, response.access_token);
    localStorage.setItem(CONSTANTS.ADMIN_PATH, JSON.stringify(response.user));
  }

  setFirstVenueIdToStorage(venueId) {
    localStorage.setItem(CONSTANTS.FIRST_VENUE_ID_PATH, venueId);
  }

  /**
   * @description
   * Remove admin data from localStorage
   *
   * @memberof AuthService
   */
  removeAdminFromStorage() {
    localStorage.removeItem(CONSTANTS.JWT_PATH);
    localStorage.removeItem(CONSTANTS.ADMIN_PATH);
  }

  /**
   * @description
   * Check if token is expired
   *
   * @param {string} token
   * @returns {boolean}
   * @memberof AuthService
   */
  isTokenExpired(token: string): boolean {
    const now = +new Date();
    return +this.jwtHelper.getTokenExpirationDate(token) < now;
  }

  /**
   * @description
   * Get token from localStorage
   *
   * @returns
   * @memberof AuthService
   */
  getToken() {
    return localStorage.getItem(CONSTANTS.JWT_PATH);
  }

  getFirebaseToken () {
    return this.http.post(`${CONSTANTS.API_ENDPOINT}auth/firebase-token`, {}).pipe(
      tap ((res: any) => {
        this.loginToFirebase(res.token);
      }))
      .subscribe((res: any) => {
        this.store.set('firebaseToken', res.token);
        this.setFirebaseToStorage(res.token);
      });
  }

  loginToFirebase (token) {
    if (this.firebaseAuth.auth.currentUser) {
      this.store.set('firebase-login', true);
      return Promise.resolve();
    }
    return this.firebaseAuth.auth.signInWithCustomToken(token)
      .then((res) => {
        this.store.set('firebase-login', true);
      })
      .catch((err) => {
        this.getFirebaseToken();
      });
  }

  setFirebaseToStorage (token) {
    localStorage.setItem(CONSTANTS.FIREBASE_PATH, token);
  }

  removeFirebaseFromStorage () {
    localStorage.removeItem(CONSTANTS.FIREBASE_PATH);
  }

  removeVenueIdFromStorage () {
    localStorage.removeItem(CONSTANTS.VENUE_ID_PATH);
  }
}
