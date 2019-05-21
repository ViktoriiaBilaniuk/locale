import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sl-ads-item',
  templateUrl: './ads-item.component.html',
  styleUrls: ['./ads-item.component.scss']
})
export class AdsItemComponent implements OnInit {
  @Input() item;
  @Output() onDelete = new EventEmitter();
  visibleConfirmWindow = false;

  constructor( ) { }

  ngOnInit() {
  }

  deleteAccount() {
    this.onDelete.emit(this.item._id);
  }

  openConfirmModal() {
    this.visibleConfirmWindow = true;
  }

  closeConfirmModal() {
    this.visibleConfirmWindow = false;
  }

  isData() {
    if (!this.item || !this.item.insights || !Object.values(this.item.insights)) {
      return false;
    }
    return Object.values(this.item.insights).length > 3;
  }

  formedValue(value) {
    return value === 'NaNundefined' || value === 'NaN' || value === 'undefined' ? '-' : value;
  }

}
