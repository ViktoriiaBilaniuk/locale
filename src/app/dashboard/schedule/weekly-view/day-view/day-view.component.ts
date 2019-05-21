import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'sl-day-view',
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss']
})
export class DayViewComponent implements OnInit {

  @Input() data;
  @Input() postManagementPermission;
  @Input() allChannelsAreDissconnected;
  @Input() channelsExists;
  @Output() onCreatePostClick = new EventEmitter();
  @Output() onEdit = new EventEmitter();
  @Output() onCopy = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  hoverOnBtn;

  constructor() { }

  ngOnInit() {
  }

  trackByIndex(index) {
    return index;
  }

  getDate() {
    return moment(this.data.date).format('dddd DD MMMM');
  }

  getToday() {
    return moment().format('dddd DD MMMM');
  }

  getPostText() {
    return this.data.posts.length === 1 ? 'PostsView.post' : 'PostsView.posts';
  }

  createPostClick() {
    this.onCreatePostClick.emit(this.data.date);
  }

  dateIsInPast() {
    if (!this.getToday() || !this.getDate()) {
      return;
    }
    return moment().startOf('day').valueOf() > moment(this.data.date).startOf('day').valueOf();
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
