import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { VenueService } from './../../../core/services/venue/venue.service';
import { DetailsMenu } from '../../../models/right-sidebar/venue-details/details-menu';
import { UtilsService } from '../../../core/services/utils/utils.service';

@Component({
  selector: 'sl-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})
export class MenusComponent implements OnChanges {
  @Input() menus: DetailsMenu[];
  @Input() canEdit: boolean;
  @Output() onEdit = new EventEmitter<DetailsMenu[]>();

  editorMenus: DetailsMenu[] = [];
  error = false;

  editMode = false;
  placeholderImage = `url('/assets/images/dashboard/pdf.svg')`;
  fileUploadSubscription;

  constructor(
    private venueService: VenueService,
    private utils: UtilsService,
  ) { }

  ngOnChanges() {
    this.editorMenus = this.copyMenus(this.menus);
    this.editMode = false;
  }

  /**
   * @description
   * Set the style for menu background image on the template
   * if source is pdf then replace image with asset placeholder
   *
   * @memberof MenusComponent
   *
   * @param menu instance of menu
   * @returns value for backgound-image CSS property
   */
  getMenuStyle (menu: DetailsMenu): string {
    if (menu.source) {
      return this.isPdf(menu) ? this.placeholderImage : `url(${menu.source})`;
    }
    return '';
  }

  isPdf (menu: DetailsMenu) {
    return menu.source && menu.source.endsWith('.pdf');
  }

//#region Teamplate click listeners

  onToggleEditMode() {
    this.editMode = !this.editMode;
    // Fix for window scroll when opening popover
    // prevent document to move up and whitespace under document to appear
    const listener = () => {
      window.scrollTo(0, 0);
      document.body.style.overflow = this.editMode ? 'hidden' : 'auto';
    };
    if (this.editMode) {
      window.addEventListener('click', listener, false);
    } else {
      window.removeEventListener('click', listener);
    }
  }

  onAddNewMenuClick() {
    this.editorMenus.push({
      name: '',
      source: ''
    });
  }
  onRemoveMenuClick(menu) {
    this.editorMenus.splice(this.editorMenus.indexOf(menu), 1);
  }

  onEditMenuAttachment(event, menu: DetailsMenu) {
    this.fileUploadSubscription = this.venueService.uploadFile(event.target.files[0])
      .subscribe(
        (res: { data: { file_url: string, signed_request: string } }) => {
          menu.source = res.data.file_url;
          event.target.value = '';
          this.fileUploadSubscription.unsubscribe();
        },
        () => {
          this.utils.showErrorModal('Error uploading file.');
          event.target.value = '';
        }
      );
  }

  onSaveClick() {
    this.error = false;
    this.editorMenus.forEach((menu) => {
      if (menu.name.trim().length < 3 || menu.name.trim().length > 50) {
        this.error = true;
      }
    });
    if (!this.error) {
      this.editMode = false;
      this.onEdit.emit(this.editorMenus);
    }
  }

  onCancelClick() {
    this.editMode = false;
    this.editorMenus = this.copyMenus(this.menus);
  }
//#endregion Teamplate click listeners

  /**
   * @description
   * Make a copy from array and return it
   *
   * @param from from where to take objects
   */
  private copyMenus(from: any[]): any[] {
    return from.map((m) => Object.assign({}, m));
  }

}
