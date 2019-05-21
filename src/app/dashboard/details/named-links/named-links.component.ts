import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { VenueService } from './../../../core/services/venue/venue.service';
import { Store } from './../../../core/store/store';

@Component({
  selector: 'sl-named-links',
  templateUrl: './named-links.component.html',
  styleUrls: ['./named-links.component.scss']
})
export class NamedLinksComponent implements OnInit, OnChanges {
  @Input() canEdit: boolean;
  @Input() links = [];
  @Input() venueId: string;

  editMode: boolean;
  editItem: object;
  showAdd: boolean;
  showEdit: boolean;
  addNew: boolean;
  venue: any;

  constructor(
    private venueService: VenueService,
    private store: Store) {
  }

  ngOnInit() {
  }

  ngOnChanges () {
    this.editMode = this.showAdd = this.showEdit = false;
  }

  onToggleEditMode () {
    this.editMode = !this.editMode;
    if (!this.editMode && this.venue) {
      this.store.set('venue-details', this.venue);
    }
    this.showAdd = this.showEdit = false;
  }

  showAddForm () {
    this.showAdd = true;
    this.editItem = null;
  }

  hideAddForm (item) {
    if (item) {
      this.links.push(item);
      this.saveChanges();
    }
    this.showAdd = false;
  }

  showEditForm (item, $event) {
    $event.preventDefault();
    this.showEdit = true;
    this.editItem = item;
  }

  hideEditForm () {
    this.showEdit = false;
    this.saveChanges();
  }

  cancelAdd () {
    this.showAdd = false;
  }

  cancelEdit () {
    this.showEdit = false;
  }

  saveChanges() {
    this.venueService.updateDetailsWithoutStoreUpdate(this.venueId, {named_links: this.links})
      .subscribe((res: any) => {
        this.venue = res.venue;
        this.links = this.venue.named_links;
      });
  }

  remove(item) {
    const index = this.links.indexOf(item);
    this.links.splice(index, 1);
    this.hideEditForm();
  }

  getLink (url) {
    if (url.indexOf('http') === -1) {
      return `//${url}`;
    }
    return url;
  }

}
