import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PublicationProxyService } from '../../../../core/services/publication/publication-proxy.service';
import { filter } from 'rxjs/operators';
import { ACTION_TYPE, NETWORKS } from '../publication.constants';

@Component({
  selector: 'sl-publication-header',
  templateUrl: './publication-header.component.html',
  styleUrls: ['./publication-header.component.scss']
})
export class PublicationHeaderComponent implements OnInit, OnChanges {
  @Output() onTabClick = new EventEmitter();
  @Output() onSetTabClick = new EventEmitter();
  @Output() onSave = new EventEmitter();
  @Output() onSaveAndCopy = new EventEmitter();
  @Input() channels;
  @Input() validStatus;
  @Input() postNetwork;
  @Input() action;
  tooltipSettings = {
    showTooltip: false,
    tooltipText: 'Channels.posIsCopied',
    top: '40px',
    right: this.getTooltipRightPositions()
  };

  tabs = [
    {title: NETWORKS.FACEBOOK, active: false, visible: false},
    {title: NETWORKS.INSTAGRAM, active: false, visible: false},
    {title: NETWORKS.TWITTER, active: false, visible: false},
  ];

  constructor(
    private publicationProxyService: PublicationProxyService) {
  }

  ngOnInit() {
    this.subscribeOnNetwork();
  }

  subscribeOnNetwork() {
    this.publicationProxyService.network
      .pipe(
        filter((res: any) => res)
      )
      .subscribe( network => {
        this.tabs.map(item => item.active = false);
        const tabToActivate = this.tabs.find(elem => elem.title === network);
        if (tabToActivate) {
          tabToActivate.active = true;
          tabToActivate.visible = true;
        }
      });
  }

  ngOnChanges(changes) {
    if (changes.channels) {
      this.setTabs();
    }
    if (changes.action && this.action && this.action.actionName === ACTION_TYPE.EDIT) {
      this.tabs.map(item => {
        if (!item.active) {
          item.visible = false;
        }
      });
    }
  }

  setPostNetwork() {
    if (!this.postNetwork) {
      return;
    }
    const postNetworkTab = this.tabs.find(elem => elem.title === this.postNetwork);
    if (postNetworkTab && postNetworkTab.visible) {
      this.onSetTab(postNetworkTab);
    }
  }

  setTabs() {
    this.tabs.forEach(tab => {
      tab.visible = this.getVisibleStatus(tab);
    });
    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].visible) {
        this.onSetTab(this.tabs[i]);
        break;
      }
    }
    this.setPostNetwork();
  }

  getVisibleStatus(tab) {
    const filteredChannels = this.channels.filter(channel => channel.network === tab.title);
    return !!filteredChannels.length;
  }

  onSaveClick() {
    this.onSave.emit();
  }

  onSaveAndCopyClick() {
    this.onSaveAndCopy.emit();
    this.onShowTooltip();
  }

  tabClick(tab) {
    this.onTabClick.emit(tab.title);
  }

  onSetTab(tab) {
    this.onSetTabClick.emit(tab.title);
  }

  getCopyButtonText() {
    return this.publicationProxyService.isScheduledPost() ? 'Channels.scheduleAndCopy' : 'Channels.publishAndCopy';
  }

  getSaveButtonText() {
    return this.publicationProxyService.isScheduledPost() ? 'Channels.schedulePost' : 'Channels.publish';
  }

  getTooltipRightPositions() {
    return this.publicationProxyService.isScheduledPost() ? '56%' : '48%';
  }

  onShowTooltip() {
    this.tooltipSettings.showTooltip = true;
    setTimeout(() => {
      this.tooltipSettings.showTooltip = false;
    }, 6000);
  }

}
