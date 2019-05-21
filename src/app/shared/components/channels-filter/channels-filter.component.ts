import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sl-channels-filter',
  templateUrl: './channels-filter.component.html',
  styleUrls: ['./channels-filter.component.scss']
})
export class ChannelsFilterComponent {
  @Input() channels: any;
  @Input() channelsPage: any;
  @Output() confirm = new EventEmitter();
  @Output() clickOutside = new EventEmitter();

  get allFilterChecked () {
    return this.channels.every((filter) => filter.selected);
  }

  set allFilterChecked (value) {
    this.channels.forEach((filter) => { filter.selected = value; });
    this.confirm.emit(this.selected);
  }

  get selected () {
    return this.channels.filter((filter) => filter.selected);
  }

  select (item) {
    item.selected = !item.selected;
    this.confirm.emit(this.selected);
  }

  onClickedOutside () {
    this.clickOutside.emit(false);
  }

}
