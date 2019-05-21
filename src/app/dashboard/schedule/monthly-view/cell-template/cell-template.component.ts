import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NETWORKS } from '../../publication/publication.constants';

@Component({
  selector: 'sl-cell-template',
  templateUrl: './cell-template.component.html',
  styleUrls: ['./cell-template.component.scss']
})
export class CellTemplateComponent implements OnInit {
  @Input() day;
  @Input() counts;
  @Input() allChannelsAreDissconnected;
  @Input() channelsExists;
  @Input() postManagementPermission;
  @Output() dayClicked = new EventEmitter();
  @Output() createClicked = new EventEmitter();
  hoverOnBtn;

  constructor() { }

  ngOnInit() {
  }

  getNetworks() {
    return Object.values(NETWORKS);
  }

  isCounts() {
    let counts = 0;
    Object.keys(NETWORKS).forEach(key => {
      counts += this.counts[key.toLowerCase()];
    });
    return counts;
  }

  createClick(e) {
    e.stopPropagation();
    this.createClicked.emit(this.day.date);
  }

  getTooltipText() {
    if (this.allChannelsAreDissconnected) {
      return 'Channels.allChannelsDissconnected';
    }
    if (!this.channelsExists) {
      return 'Channels.noConnectedChannels';
    }
  }

}
