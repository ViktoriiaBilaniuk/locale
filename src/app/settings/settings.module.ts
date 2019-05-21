import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule} from '../shared/shared.module';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfilePhotoComponent } from './profile-photo/profile-photo.component';
import { SettingsComponent} from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';

// Localization
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    SettingsRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    SettingsComponent,
    PersonalDetailsComponent,
    ChangePasswordComponent,
    ProfilePhotoComponent]
  ,
  exports: [
    SettingsComponent
  ]
})
export class SettingsModule { }
