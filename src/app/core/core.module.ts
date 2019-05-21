import { TrackingSerivce } from './services/tracking/tracking.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VenueService } from './services/venue/venue.service';
import { ValidationService } from './services/validation/validation.service';
import { AuthGuard } from './guards/auth/auth.guard';
import { UtilsService } from './services/utils/utils.service';
import { AuthService } from './services/auth/auth.service';
import { Store } from './store/store';
import { Interceptor } from './interceptors/interceptor';
import { UserService} from './services/user/user.service';
import { ChatService } from './services/chat/chat.service';
import { LoggedUserGuard } from './guards/auth/logged-user.guard';
import { PermissionsService } from './services/permissions/permissions.service';
import { PermissionsGuard } from './guards/permissions/permissions.guard';
import { CalendarService } from './services/calendar/calendar.service';
import { SystemService } from './services/system/system.service';
import { NotificationsService } from './services/chat/notifications.service';
import { NetworksService } from './services/networks/networks.service';
import { NetworksProxyService } from './services/networks/networks-proxy.service';
import { FilesService } from './services/files/files.service';
import { PublicationProxyService } from './services/publication/publication-proxy.service';
import { PublicationService } from './services/publication/publication.service';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { PostErrorsHandlerService } from './services/publication/post-errors-handler.service';
import { ReachOutInterceptor } from './interceptors/reach-out-interceptor';
import { NgxLinkifyjsService } from 'ngx-linkifyjs';

export function getToken(): string {
  return localStorage.getItem('token');
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken
      }
    }),
  ],
  declarations: [
  ],
  providers: [
    TrackingSerivce,
    Store,
    AuthService,
    AuthGuard,
    LoggedUserGuard,
    ValidationService,
    VenueService,
    UtilsService,
    UserService,
    SystemService,
    ChatService,
    PermissionsService,
    NotificationsService,
    PermissionsGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ReachOutInterceptor,
      multi: true
    },
    JwtHelperService,
    CalendarService,
    NetworksService,
    NetworksProxyService,
    FilesService,
    PublicationProxyService,
    PublicationService,
    PostErrorsHandlerService,
    NgxLinkifyjsService
  ],
  exports: [
  ]
})
export class CoreModule { }
