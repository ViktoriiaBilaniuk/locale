import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'sl-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.scss']
})
export class SortingComponent {

  @Input() availableOptions;
  @Output() onSortingChange = new EventEmitter<string>();

  selectedOption(option) {
    this.availableOptions.forEach((opt) => opt.selected = false);
    this.availableOptions.forEach((opt) => {
      if (opt.title === option.title) {
        opt.selected = true;
      }
    });
    this.onSortingChange.emit(option.value);
  }

}
