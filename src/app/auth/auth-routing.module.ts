import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

export const AUTH_ROUTES = [
  {path: '', component: AuthComponent, children: [
      {path: '', pathMatch: 'full', redirectTo: 'login'},
      {path: 'login', component: LoginComponent},
      {path: 'forgot-pass', component: ForgotPassComponent},
      {path: 'reset-pass', component: ResetPassComponent},
      {path: 'contact-us', component: ContactUsComponent}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(AUTH_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule {}
