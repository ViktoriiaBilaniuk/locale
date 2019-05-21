import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UtilsService } from '../services/utils/utils.service';
import { AuthService } from '../services/auth/auth.service';
import { catchError, tap } from 'rxjs/internal/operators';
import { throwError } from 'rxjs/index';
import { Observable } from 'rxjs/Rx';

const authPath = 'auth/';
const profilePath = 'profile/';
const venuesPath = '/venues/';
const eventsPath = '/events';
const analyticsPath = '/analytics';
const channelPath = '/channels';
const removePath = '/remove';
const reconnectPath = '/reconnect';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(
    private utils: UtilsService,
    private authService: AuthService ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestWithAuthHeaders = this.addAuthHeaders(request);

    return next.handle(requestWithAuthHeaders)
      .pipe(
        tap ((event: HttpEvent<any>) => this.logRequestInfo(request, event)),
        catchError((error: HttpErrorResponse) => this.handleErrors(error))
      );
  }

  addAuthHeaders(request: HttpRequest<any>) {
    const token = this.authService.getToken();
    if (token &&
      (!request.url.includes(authPath) ||
        request.url.includes('auth/firebase-token')) &&
      (!request.urlWithParams.includes('s3.eu-west-1.amazonaws.com') &&
        !request.urlWithParams.includes('s3-eu-west-1.amazonaws.com'))) {
      return request.clone({
        setHeaders: {
          Authorization: `${token}`
        }
      });
    } else {
      return request;
    }
  }

  logRequestInfo(request, event) {
    const started = Date.now();
    if (event instanceof HttpResponse) {
      const elapsed = Date.now() - started;
      // console.log(`Request for ${request.urlWithParams} took ${elapsed} ms.`);
    }
  }

  handleErrors(error): Observable<never> {
    if (error.status === 0) {
      return this.handleNoInternetError(error);
    }
    if (this.notFoundCondition(error)) {
      return throwError(error);
    }
    if (this.unauthorizedCondition(error)) {
     return this.handleUnauthorizedError(error);
    } else if (this.unactedCondition(error)) {
      return this.handleUnactedError(error);
    } else if (error.status === 200) {
      return throwError(error);
    }
  }

  notFoundCondition(error) {
    return error.status === 404 && (this.isCustomAnaliticsPath(error.url) ||
      (this.isChannelsPath(error.url)) && this.isRemovePath(error.url));
  }

  unauthorizedCondition(error) {
    return (error.status === 401  || error.status === 403) &&
    !this.isAuthPath(error.url) && !this.isProfilePath(error.url) &&
    !this.isEventsPath(error.url) && !this.isVenuesPath(error.url) &&
    (!this.isChannelsPath(error.url) && !this.isPostPage());
  }

  handleUnauthorizedError(error) {
    console.log(error);
    this.utils.showErrorModal(error.statusText);
    this.authService.logout();
    return throwError(error);
  }

  unactedCondition(error) {
    return error.status !== 200 && !this.isProfilePath(error.url);
  }

  handleUnactedError(error) {
    // Handle angular json parse of empty response bug
    console.log('Handle error', error);
    if (error.error.message !== 'You are not able to add more than 5 events' && !this.isReconnectPath(error.url)) {
      this.utils.showErrorModal(this.getErrorMessage(error));
    }
    return throwError(error);
  }

  getErrorMessage(error) {
    return error.error.message ? error.error.message : error.error.error.message;
  }

  handleNoInternetError(error) {
    this.utils.showErrorModal('noInternetConnection');
    return throwError(error);
  }

  isCustomAnaliticsPath(url) {
    return url.includes(analyticsPath);
  }

  isChannelsPath(url) {
    return url.includes(channelPath);
  }

  isRemovePath(url) {
    return url.includes(removePath);
  }

  isAuthPath (url) {
    return url.includes(authPath);
  }

  isProfilePath (url) {
    return url.includes(profilePath);
  }

  isVenuesPath (url) {
    return url.includes(venuesPath);
  }

  isReconnectPath(url) {
    return url.includes(reconnectPath);
  }

  isEventsPath (url) {
    return url.includes(eventsPath);
  }

  isPostPage() {
    return window.location.href.includes('schedule');
  }
}
