import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PublicationProxyService } from '../../../../core/services/publication/publication-proxy.service';
import { AutoUnsubscribe } from '../../../../shared/decorators/auto-unsubscribe';

@AutoUnsubscribe
@Component({
  selector: 'sl-channels-section',
  templateUrl: './channels-section.component.html',
  styleUrls: ['./channels-section.component.scss']
})
export class ChannelsSectionComponent implements OnInit, OnChanges {
  @Input() channels;
  @Input() selectedChannel;
  truncationLimit = 25;

  constructor(
    private publicationProxyService: PublicationProxyService,
  ) { }

  ngOnInit() {
    this.channels.map(channel => channel.selected = false);
    if (this.selectedChannel) {
      this.setSelectedChannel();
    }
  }

  ngOnChanges(changes) {
    if (changes.selectedChannel && changes.selectedChannel.currentValue && this.channels.length) {
      this.setSelectedChannel();
      this.setPostChannels();
    }
  }

  setPostChannels() {
    this.publicationProxyService.postChannel = this.selectedChannel;
  }

  select (item) {
    if (item.status === 'online') {
      item.selected = !item.selected;
      this.publicationProxyService.selectedChannels = this.getSelectedChannels().slice();
    }
  }

  channelsByNetwork() {
    return this.channels.filter(channel => channel.network === this.network);
  }

  get network() {
    return this.publicationProxyService.networkValue();
  }

  setSelectedChannel() {
    const channelToSelect = this.channels.find(item => item.id === this.selectedChannel._id);
    this.select(channelToSelect);
  }

  getSelectedChannels() {
    if (!this.channels) {
      return;
    }
    return this.channels.filter(channel => channel.selected);
  }

  public clearSelectedChannels() {
    if (this.channels && this.channels.length) {
      this.channels.forEach(channel => channel.selected = false);
    }
  }

}
