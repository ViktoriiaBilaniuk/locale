import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './core/guards/auth/auth.guard';

export const ROUTES: Routes = [
  {path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  {path: 'dashboard', canActivate: [AuthGuard], loadChildren: './dashboard/dashboard.module#DashboardModule'},
  {path: 'settings', canActivate: [AuthGuard], loadChildren: './settings/settings.module#SettingsModule'},
  {path: '', canActivate: [AuthGuard], redirectTo: 'dashboard', pathMatch: 'full'},
  {path: '**', canActivate: [AuthGuard], redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES, {onSameUrlNavigation: 'reload'})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
