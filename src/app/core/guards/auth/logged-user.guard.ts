import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from './../../store/store';

@Injectable()
export class LoggedUserGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate() {
    const isAuthorized = this.store.value.admin;

    if (isAuthorized) {
      this.router.navigate(['/dashboard']);
    }
    return !isAuthorized;
  }
}
