import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '../../store/store';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const permissions = this.store.value.permissions || [];
    const permission = route.data.permission as string;
    const canActivate = permissions.indexOf(permission) !== -1;

    if (!canActivate) {
      this.router.navigate(['/dashboard']);
    }
    return canActivate;
  }
}
