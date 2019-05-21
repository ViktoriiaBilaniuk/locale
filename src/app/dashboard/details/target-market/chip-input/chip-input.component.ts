import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'sl-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['./chip-input.component.scss']
})
export class ChipInputComponent implements OnInit, OnChanges {
  @Input() venueOptions;
  @Input() defaultOptions;
  @ViewChild('searchInput') searchInput;
  @Output() onAdd = new EventEmitter();
  showSuggestions = false;
  suggestions = [];
  otherOptions = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if (changes.venueOptions && this.defaultOptions.length) {
      this.setSuggestions();
    }
  }

  setSuggestions() {
    this.suggestions = [];
    this.suggestions = this.defaultOptions.filter(defaultOption => {
      return this.venueOptions.findIndex(venueOption => venueOption.value === defaultOption.value) === -1;
    });
    this.otherOptions = this.suggestions.slice();
  }

  search (value, event?) {
    if (event && event['keyCode'] === 13 && value.trim()) {
      this.addCustomItem(value.trim());
      return;
    }
    this.suggestions = this.otherOptions.filter(item => {
      if (item.title.toLowerCase().includes(value.toLowerCase())) {
        return item;
      }
    });
  }

  addCustomItem(item) {
    this.clearInput();
    if (this.itemExists(this.transformedItem(item))) {
      return;
    }
    this.closeSugestions();
    if (!this.itemIsDefault(item)) {
      this.venueOptions.push(this.transformedItem(item));
      this.onAdd.emit(this.transformVanueOptions());
    } else {
      this.addItem(this.transformedItem(item));
    }
  }

  clearInput() {
    this.searchInput.nativeElement.value = '';
    this.searchInput.nativeElement.blur();
  }

  closeSugestions() {
    this.showSuggestions = false;
  }

  itemIsDefault(value) {
    return this.defaultOptions.filter(defaultOption => defaultOption.value.toLowerCase() === value.toLowerCase()).length;
  }

  transformedItem(value) {
    return {
      title: value.charAt(0).toUpperCase() + value.slice(1),
      value: value.charAt(0).toLowerCase() + value.replace(' ', '_').slice(1)
    };
  }

  focusInput() {
    this.showSuggestions = true;
    this.search('');
  }

  addItem (item) {
    if (this.itemExists(item)) {
      return;
    }
    this.closeSugestions();
    this.clearInput();
    this.venueOptions.push(item);
    this.otherOptions = this.otherOptions.filter(option => option.value.toLowerCase() !== item.value.toLowerCase() );
    this.suggestions = this.otherOptions.filter(option => option.value.toLowerCase() !== item.value.toLowerCase() );
    this.onAdd.emit(this.transformVanueOptions());
  }

  removeItem (item) {
    this.venueOptions.splice(this.venueOptions.indexOf(item), 1);
    if (this.itemIsDefault(item.value)) {
      this.suggestions.push(item);
      this.otherOptions.push(item);
    }
    this.onAdd.emit(this.transformVanueOptions());
  }

  itemExists(item) {
    return this.venueOptions.filter(venueOption => venueOption.value.toLowerCase() === item.value.toLowerCase()).length;
  }

  transformVanueOptions() {
    return this.venueOptions.map(option => option.value);
  }

  clickOutside() {
    this.closeSugestions();
    this.clearInput();
  }

}
