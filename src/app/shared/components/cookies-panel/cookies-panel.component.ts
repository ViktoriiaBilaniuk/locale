import { Component, OnInit } from '@angular/core';
import { Store } from '../../../core/store/store';
import { Subscription } from 'rxjs';
import { fadeInAnimation } from '../../animations/fade-in.animation';
import { AutoUnsubscribe } from '../../decorators/auto-unsubscribe';

@AutoUnsubscribe
@Component({
  selector: 'sl-cookies-panel',
  templateUrl: './cookies-panel.component.html',
  styleUrls: ['./cookies-panel.component.scss'],
  animations: [fadeInAnimation]
})
export class CookiesPanelComponent implements OnInit {

  isCookiesPanelShown: boolean;
  private storeAdminSubscription: Subscription;

  constructor(private store: Store) {}

  ngOnInit() {
    this.isUserLogged();
  }

  private isUserLogged() {
    this.storeAdminSubscription = this.store.select('admin').subscribe((user) => {
      if (user) {
        this.checkIsCookiesNotification();
      }
    });
  }

  private checkIsCookiesNotification() {
    if (localStorage.getItem('sl-cookies-panel')) {
      this.isCookiesPanelShown = false;
    } else {
      this.isCookiesPanelShown = true;
    }
  }

  closeCookiesPanel() {
    this.isCookiesPanelShown = false;
    localStorage.setItem('sl-cookies-panel', 'true');
  }

}
