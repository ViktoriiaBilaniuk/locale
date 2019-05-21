import { AuthResponse } from '../../../models/responses';
import { CONSTANTS } from '../../constants';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { of } from 'rxjs/index';
import { JwtHelperService } from '@auth0/angular-jwt';

describe ('AuthService', () => {
  let authService: AuthService;
  const http = new HttpClient(null);
  const store = {
    set() {},
    clear() {}
  } as any;
  const jwtHelper = new JwtHelperService();
  const router = {
    navigate() {}
  } as any;
  const fireBaseAuth = {
    auth: {
      signOut: () => {},
      signInWithCustomToken: (token) => of({}),
      currentUser: {},
    }
  } as any;

  const user = {id: '22', name: 'John'};
  const access_token = 'mockedToken';
  const authResponse: AuthResponse = {user, access_token, code: 200};

  beforeEach(() => {
    authService = new AuthService(http, store, jwtHelper, router, fireBaseAuth);
  });

  it ('login: should call methods to set user on login', () => {
    const loginSpy = spyOn(http, 'post').and.returnValue(of(authResponse));

    const setToStoreSpy = spyOn(store, 'set');
    const setToStorageSpy = spyOn(authService, 'setAdminToStorage');

    authService.login(user).subscribe();

    expect(loginSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}auth/sign-in`, user);
    expect(setToStoreSpy).toHaveBeenCalledWith('admin', authResponse.user);
    expect(setToStorageSpy).toHaveBeenCalledWith(authResponse);
  });

  it ('logout: should call methods to clear user data(from store and storage) on logout', () => {
    const spy1 = spyOn(authService, 'removeAdminFromStorage');
    const spy2 = spyOn(store, 'clear');
    const spy3 = spyOn(fireBaseAuth.auth, 'signOut');

    authService.logout();

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it ('setAdminToStorage: should set admin and jwt to storage', () => {
    authService.setAdminToStorage(authResponse);

    expect(localStorage.getItem(CONSTANTS.JWT_PATH)).toBe(access_token);
    expect(JSON.parse(localStorage.getItem(CONSTANTS.ADMIN_PATH))).toEqual(user);
  });


  it('removeAdminFromStorage: should clear storage from admin and jwt', () => {
    localStorage.setItem(CONSTANTS.JWT_PATH, 'mockedToken');
    localStorage.setItem(CONSTANTS.ADMIN_PATH, JSON.stringify(user));

    authService.removeAdminFromStorage();

    expect(localStorage.getItem(CONSTANTS.JWT_PATH)).toBeFalsy();
    expect(localStorage.getItem(CONSTANTS.ADMIN_PATH)).toBeFalsy();
  });

  it('getToken: should get token from storage', () => {
    localStorage.setItem(CONSTANTS.JWT_PATH, access_token);

    expect(authService.getToken()).toEqual(access_token);
  });

  it('forgotPass: should call method to reset password', () => {
    const httpSpy = spyOn(http, 'post').and.returnValue(of({}));
    const reqBody = {email: 'test@development.com'};
    authService.forgotPass(reqBody).subscribe();
    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}auth/forgot-password`, reqBody);
  });

  it('resetPass: should call method to reset password', () => {
    const httpSpy = spyOn(http, 'post').and.returnValue(of({}));
    const reqBody = { password: '********', password_confirmation: '********'};
    authService.resetPass(reqBody, 'target', 'token');
    expect(httpSpy).toHaveBeenCalledWith(
      `${CONSTANTS.API_ENDPOINT}auth/reset-password/target`,
      reqBody,
      { headers: { 'Authorization': 'token' } }
    );
  });

  it('initPass: should call method to create password', () => {
    const httpSpy = spyOn(http, 'post').and.returnValue(of({}));
    const reqBody = { password: '********', password_confirmation: '********'};
    authService.initPass(reqBody, 'user', 'token');
    expect(httpSpy).toHaveBeenCalledWith(
      `${CONSTANTS.API_ENDPOINT}auth/init-password/user`,
      reqBody,
      { headers: { 'Authorization': 'token' } }
    );
  });

  it('loginToFirebase: should call method to firebase login', () => {
    const httpSpy = spyOn(http, 'post').and.returnValue(of({}));
    authService.getFirebaseToken();
    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}auth/firebase-token`, {});
  });
});
