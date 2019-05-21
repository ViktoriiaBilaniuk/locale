import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Store} from '../../../core/store/store';

@Component({
  selector: 'sl-demographic',
  templateUrl: './demographic.component.html',
  styleUrls: ['./demographic.component.scss']
})
export class DemographicComponent implements OnInit, OnChanges {

  @Input() canEdit: boolean;
  @Input() data: String[];
  @Output() onEdit = new EventEmitter<any>();

  defaultOptions;
  editMode = false;

  constructor( private store: Store) { }

  ngOnInit() {
    this.defaultOptions = [];
    this.setDefaultOptionsList();
  }

  ngOnChanges() {
    this.resetData();
  }

  setDefaultOptionsList() {
    this.store.select('demographic_options')
      .subscribe(data => {
        let defaultOptionsList;
        if (data) {
          defaultOptionsList = data;
          this.defaultOptions = [];
          defaultOptionsList.forEach( option => {
            this.defaultOptions.push({value: option, selected: false});
          });
        }
      });
  }

  resetData() {
    this.editMode = false;
  }

  pencilClick() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.populateSelection();
    }
  }

  populateSelection() {
    this.defaultOptions.forEach(option => {
      this.data.find (item => item === option.value) ? option.selected = true : option.selected = false;
    });
  }

  editDemographic(newValue) {
    if (newValue.sort().toString() !== this.data.sort().toString()) {
      this.onEdit.emit(newValue);
    }
    this.editMode = false;
  }

  onSaveClick() {
    const newValue = [];
    this.defaultOptions.forEach(option => {
      if (option.selected) {
        newValue.push(option.value);
      }
    });
    this.editDemographic(newValue);
  }

  onCancelClick() {
    this.resetData();
  }

}
