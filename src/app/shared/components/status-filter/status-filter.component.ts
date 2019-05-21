import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'sl-status-filter',
  templateUrl: './status-filter.component.html',
  styleUrls: ['./status-filter.component.scss']
})
export class StatusFilterComponent {
  @Input() statuses;
  @Output() confirm = new EventEmitter();
  @Output() clickOutside = new EventEmitter();

  get allFilterChecked () {
    return this.statuses.every((status) => status.selected);
  }

  set allFilterChecked (value) {
    this.statuses.forEach((status) => { status.selected = value; });
    this.confirm.emit(this.selected);
  }

  get selected () {
    return this.statuses.filter((status) => status.selected);
  }

  select (status) {
    status.selected = !status.selected;
    this.confirm.emit(this.selected);
  }

  onClickedOutside () {
    this.clickOutside.emit(false);
  }

}
