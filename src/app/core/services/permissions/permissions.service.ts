import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONSTANTS } from '../../constants';
import { Store } from '../../store/store';

@Injectable()
export class PermissionsService {

  constructor(
    private http: HttpClient,
    private store: Store
  ) { }

  fetchPermissionsByVenue (venueId?) {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}permissions/${venueId}`)
    .subscribe((response: any) => {
      this.store.set('permissions', response.permissions);
    });
  }

  fetchPermissions () {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}permissions`)
    .subscribe((response: any) => {
      this.store.set('all-permissions', response.permissions);
    });
  }
}
