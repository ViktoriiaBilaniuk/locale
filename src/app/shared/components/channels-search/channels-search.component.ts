import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'sl-channels-search',
  templateUrl: './channels-search.component.html',
  styleUrls: ['./channels-search.component.scss']
})
export class ChannelsSearchComponent implements OnChanges {
  @Input() channels;
  @Input() channelsPage = false;
  @Output() onChangeChannels = new EventEmitter();
  channelMenuIsActive: Boolean;
  allSelected: Boolean = true;
  activeChannels: Array<any> = [];

  ngOnChanges() {
    this.activeChannels = [];
    this.allChannelsSelected();
  }

  toggleMenu(event) {
    event.stopPropagation();
    this.channelMenuIsActive = !this.channelMenuIsActive;
  }

  onClickedOutside (bool) {
    this.channelMenuIsActive = bool;
  }

  allChannelsSelected() {
    (this.channels.length <= this.activeChannels.length || this.activeChannels.length === 0) ?
      this.allSelected = true : this.allSelected = false;
  }

  changeChannels(channels) {
    this.onChangeChannels.emit(channels);
    this.activeChannels = channels;
    this.allChannelsSelected();
  }

}
