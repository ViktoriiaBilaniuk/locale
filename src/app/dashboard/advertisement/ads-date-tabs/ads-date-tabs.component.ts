import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ADS_DATE_TABS } from '../ads-constants';

@Component({
  selector: 'sl-ads-date-tabs',
  templateUrl: './ads-date-tabs.component.html',
  styleUrls: ['./ads-date-tabs.component.scss']
})
export class AdsDateTabsComponent implements OnInit {
  tabs = ADS_DATE_TABS;
  @Output() activateTab = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.setFirstTabActive();
    const activeTab = this.tabs.find(tab => tab.active);
    this.emitTab(activeTab);
  }

  setFirstTabActive() {
    this.tabs.forEach(tab => tab.active = false);
    this.tabs[0].active = true;
  }

  tabClick(tab) {
    this.tabs.forEach((item) => item.active = false);
    tab.active = true;
    this.emitTab(tab);
  }

  emitTab(tab) {
    this.activateTab.emit(tab.value);
  }

}
