import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from './../../store/store';
import { UtilsService } from '../../services/utils/utils.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router,
    private utils: UtilsService
  ) {}

  canActivate() {
    const isAuthorized = !!this.store.value.admin;
    if (!isAuthorized) {
      this.logout();
    } else {
      if (!this.store.value.admin || !this.store.value.admin['venues'] || !this.hasVanue(this.store.value.admin)) {
        this.logout();
        if (!this.hasVanue(this.store.value.admin)) {
          this.utils.showErrorModal('You have no venues');
        }
      }
    }
    return isAuthorized;
  }

  hasVanue(user) {
    return !!user.venues.length;
  }

  logout() {
    this.router.navigate(['/auth']);
  }
}
