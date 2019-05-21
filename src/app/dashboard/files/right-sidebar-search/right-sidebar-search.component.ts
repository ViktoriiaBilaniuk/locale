import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { TrackingSerivce } from '../../../core/services/tracking/tracking.service';
import { FILE_TYPES_FOR_CONTENT_POOL } from '../files.constant';
import { EXPAND, EXPAND_STATUS } from '../../header/expand-chat/expand-constants';
import { filter } from 'rxjs/operators';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe';
import { Store } from '../../../core/store/store';

@AutoUnsubscribe
@Component({
  selector: 'sl-right-sidebar-search',
  templateUrl: './right-sidebar-search.component.html',
  styleUrls: ['./right-sidebar-search.component.scss']
})
export class RightSidebarSearchComponent implements OnInit, OnChanges {

  @Output() onSearch = new EventEmitter<any>();
  @Output() onUpload = new EventEmitter<any>();
  @Input() searchValue;
  @Input() disable;
  @Input() filesExist;
  @ViewChild('searchInput') searchInput;
  @ViewChild('fileInput') fileInput;
  expandStatus;
  subscriptions = [];

  constructor(
    private track: TrackingSerivce,
    private store: Store) {
  }

  ngOnInit() {
    this.subscribeOnExpandStatus();
  }

  subscribeOnExpandStatus() {
    this.subscriptions.push(this.store.select(EXPAND)
      .pipe(
        filter((res: any) => res)
      )
      .subscribe(status => {
        this.expandStatus = status;
      })
    );
  }

  ngOnChanges() {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);
    if (this.searchValue !== this.searchInput.nativeElement.value) {
      this.searchInput.nativeElement.value = this.searchValue;
    }
  }

  search(searchText) {
    this.onSearch.emit(searchText);
    this.track.searchApplied();
  }

  fileChange(event) {
    this.onUpload.emit([].slice.call(event.target.files));
    this.clearFile();
  }

  clearFile () {
    this.fileInput.nativeElement.value = '';
  }

  fileTypes() {
    return FILE_TYPES_FOR_CONTENT_POOL;
  }

  getRightMarginForContainer() {
    return this.expandStatus === EXPAND_STATUS.CLOSED ? '100px' : '0px';
  }

}
