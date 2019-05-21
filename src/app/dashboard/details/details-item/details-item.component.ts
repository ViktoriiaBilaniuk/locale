import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sl-details-item',
  templateUrl: './details-item.component.html',
  styleUrls: ['./details-item.component.scss']
})
export class DetailsItemComponent implements OnInit, OnChanges {

  @Input() data: string;
  @Input() canEdit: boolean;
  @Input() title: string;
  @Output() onEdit = new EventEmitter<string>();

  descriptionLimit = 160;
  editMode = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.editMode = false;
  }

  showMore() {
    this.descriptionLimit = 1000;
  }

  editVenueDetails(newValue) {
    if (newValue !== this.data) {
      this.onEdit.emit(newValue);
    }
    this.editMode = false;
  }

  getTitle() {
    return 'Rightbar.' + this.title;
  }

  getRequiredStatus() {
    return this.title !== 'localAttractionsAndEvents';
  }
}
