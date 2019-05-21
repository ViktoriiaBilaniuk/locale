import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sl-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})
export class TypesComponent {
  @Input() filtersList;
  @Output() onTypesSelected = new EventEmitter();

  get allFilterChecked () {
    return this.filtersList.every((filter) => filter.selected);
  }

  set allFilterChecked (value) {
    this.filtersList.forEach((filter) => { filter.selected = value; });
    this.onTypesSelected.emit(this.filtersList);
  }

  select (item) {
    item.selected = !item.selected;
    this.onTypesSelected.emit(this.filtersList);
  }

}
