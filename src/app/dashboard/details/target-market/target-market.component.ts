import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Store } from '../../../core/store/store';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe';
import { filter } from 'rxjs/internal/operators';

@AutoUnsubscribe
@Component({
  selector: 'sl-target-market',
  templateUrl: './target-market.component.html',
  styleUrls: ['./target-market.component.scss']
})
export class TargetMarketComponent implements OnInit, OnChanges {

  @Input() canEdit: boolean;
  @Input() data: String[];
  @Output() onEdit = new EventEmitter<any>();
  options$: Subscription;
  editMode = false;
  defaultOptions;
  venueOptions;
  newVenueOptions;

  constructor( private store: Store ) { }

  ngOnInit() {
    this.resetData();
    this.setDefaultOptionsList();
    this.setVenueOptions();
  }

  ngOnChanges() {
    this.setVenueOptions();
    this.editMode = false;
  }

  resetData() {
    this.editMode = false;
    this.defaultOptions = [];
    this.venueOptions = [];
  }

  setDefaultOptionsList() {
    this.options$ = this.store.select('target_market_options')
      .pipe(
        filter((data: any) => data)
      )
      .subscribe(data => {
        this.defaultOptions = data;
        let defaultOptionsList;
        defaultOptionsList = data;
        this.defaultOptions = defaultOptionsList.map((option) => this.formObject(option));
      });
  }

  setVenueOptions() {
    this.venueOptions = this.data.map(option => this.formObject(option));
  }

  pencilClick() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.setVenueOptions();
    }
  }

  formObject(item) {
    return { value: item, title: this.getTitle(item)};
  }

  getTitle(item) {
    return item.charAt(0).toUpperCase() + item.replace('_', ' ').slice(1);
  }

  editTargetMarket(newValue) {
    if (newValue.sort().toString() !== this.data.sort().toString()) {
      this.onEdit.emit(newValue);
    }
    this.editMode = false;
  }

  onSaveClick() {
    this.editTargetMarket(this.newVenueOptions);
  }

  onCancelClick() {
    this.editMode = false;
    this.setVenueOptions();
  }

  onAddItem(items) {
    this.newVenueOptions = items.slice();
  }

}
