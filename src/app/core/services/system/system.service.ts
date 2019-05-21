import { Injectable } from '@angular/core';
import { CONSTANTS } from '../../constants';
import { HttpClient } from '@angular/common/http';
import { Store } from '../../store/store';
import { tap } from 'rxjs/operators';

@Injectable()
export class SystemService {

  constructor(
    private http: HttpClient,
    private store: Store) {
  }

  getSystemInfo() {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}system`)
      .pipe(
        tap((response: any) => {
          this.store.set('categories', response.preferences.categories);
          this.store.set('demographic_options', response.preferences.demographic_options);
          this.store.set('target_market_options', response.preferences.target_market_options);
        }));
  }

  /*getSystemInfo() {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}system`)
      .subscribe((response: any) => {
        this.store.set('categories', response.preferences.categories);
        this.store.set('demographic_options', response.preferences.demographic_options);
        this.store.set('target_market_options', response.preferences.target_market_options);
      });
  }*/
}
