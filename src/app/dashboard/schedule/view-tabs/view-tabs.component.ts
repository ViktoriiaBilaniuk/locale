import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { VIEW_TABS } from '../schedule-constants';

@Component({
  selector: 'sl-view-tabs',
  templateUrl: './view-tabs.component.html',
  styleUrls: ['./view-tabs.component.scss']
})
export class ViewTabsComponent implements OnInit, OnChanges {
  @Output() onActivateViewTab = new EventEmitter();
  @Input() venueId;

  tabs = VIEW_TABS;

  ngOnInit() {
    this.resetTabs();
    this.emitActiveTab();
  }

  ngOnChanges() {
    this.resetTabs();
    this.emitActiveTab();
  }

  resetTabs() {
    this.tabs.forEach(tab => tab.selected = false);
    this.tabs[0].selected = true;
  }

  public selectTab(i) {
    this.activateTab(i);
    this.emitActiveTab();
  }

  activateTab(i) {
    this.tabs.forEach(tab => tab.selected = false);
    this.tabs[i].selected = true;
  }

  get activeTab() {
    if (!this.tabs || !this.tabs.length) {
      return;
    }
    return this.tabs.find(tab => tab.selected);
  }

  get canMoveBack() {
    return this.activeTab !== this.tabs[0];
  }

  get canMoveNext() {
    return this.activeTab !== this.tabs[this.tabs.length - 1];
  }

  back() {
    if (this.indexOfActivaTab !== 0) {
      this.selectTab(this.indexOfActivaTab - 1);
    }
  }

  next() {
    if (this.indexOfActivaTab !== this.tabs.length - 1) {
      this.selectTab(this.indexOfActivaTab + 1);
    }
  }

  get indexOfActivaTab() {
    return this.tabs.indexOf(this.activeTab);
  }

  emitActiveTab() {
    this.onActivateViewTab.emit(this.activeTab.name);
  }

}
