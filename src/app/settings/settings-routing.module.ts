import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SettingsComponent } from './settings.component';

export const SETTINGS_ROUTES: Routes = [
  { path: '',
    component: SettingsComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(SETTINGS_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class SettingsRoutingModule {}


