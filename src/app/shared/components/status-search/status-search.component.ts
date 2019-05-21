import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'sl-status-search',
  templateUrl: './status-search.component.html',
  styleUrls: ['./status-search.component.scss']
})
export class StatusSearchComponent implements OnChanges {
  @Input() statuses;
  @Output() onChangeStatus = new EventEmitter();
  statusMenuIsActive: Boolean;
  allSelected: Boolean = true;
  activeStatuses: Array<any> = [];

  ngOnChanges() {
    this.activeStatuses = [];
    this.allStatusesSelected();
  }

  toggleMenu(event) {
    event.stopPropagation();
    this.statusMenuIsActive = !this.statusMenuIsActive;
  }

  onClickedOutside (bool) {
    this.statusMenuIsActive = bool;
  }

  allStatusesSelected() {
    (this.statuses.length <= this.activeStatuses.length || this.activeStatuses.length === 0) ?
      this.allSelected = true : this.allSelected = false;
  }

  changeStatus(status) {
    this.onChangeStatus.emit(status);
    this.activeStatuses = status;
    this.allStatusesSelected();
  }

}
