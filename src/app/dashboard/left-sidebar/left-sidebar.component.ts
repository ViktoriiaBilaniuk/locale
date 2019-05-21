import { Component, Input, OnInit } from '@angular/core';
import { MENU_CONSTANTS } from './menu.constants';
import { Store } from '../../core/store/store';
import { AutoUnsubscribe } from '../../shared/decorators/auto-unsubscribe';
import { filter } from 'rxjs/internal/operators';

@AutoUnsubscribe
@Component({
  selector: 'sl-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
})

export class LeftSidebarComponent implements OnInit {

  @Input() collapsed;
  @Input() venueId;
  menuItems = MENU_CONSTANTS;
  private permissions: Array<string>;
  subscriptions = [];

  statusList$ = this.store.select('tutorialsStatusList');
  statusList: any;
  tutorialKey$ = this.store.select('tutorialKey');
  tutorialKey: any;

  constructor(private store: Store) { }

  ngOnInit() {
    this.getPermissions();
    this.checkResponsive();
    this.subscribeTutorialKey();
    this.subscribeStatusList();
  }

  checkResponsive() {
    this.collapsed = window.innerWidth < 1400;
  }

  private getPermissions () {
    this.subscriptions.push(this.store.select('permissions')
      .pipe(
        filter((res: any) => res)
      )
      .subscribe((permissions) => {
        this.permissions = permissions;
        this.menuItems.forEach((menuItem) => {
          menuItem.permission = !menuItem.permissionName  || this.permissions.indexOf(menuItem.permissionName) !== -1;
        });
      })
    );
  }

  mouseover(i) {
    if (!document.getElementById(`tool-${i}`)) {
      return;
    }
    document.getElementById(`tool-${i}`).classList.add('show');
  }

  mouselive(i) {
    if (!document.getElementById(`tool-${i}`)) {
      return;
    }
    document.getElementById(`tool-${i}`).classList.remove('show');
  }

  subscribeStatusList() {
    this.subscriptions.push(
      this.store.select('tutorialsStatusList').subscribe(value => {
        this.statusList = value;
      })
    );
  }

  subscribeTutorialKey() {
    this.subscriptions.push(
      this.store.select('tutorialKey').subscribe(value => {
        this.tutorialKey = value;
      })
    );
  }

  openTutorial() {
    this.statusList[this.tutorialKey] = false;
    this.store.set('tutorialsStatusList', this.statusList);
    localStorage.setItem('tutorialsStatusList',  JSON.stringify(this.statusList));
  }

}
