import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { FileEditor } from '../../../models/right-sidebar/venue-files/fileEditor';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { TrackingSerivce } from '../../../core/services/tracking/tracking.service';

@Component({
  selector: 'sl-files-item',
  templateUrl: './files-item.component.html',
  styleUrls: ['./files-item.component.scss']
})
export class FilesItemComponent implements OnInit, OnChanges {

  @Input() file;
  @Input() venueId;
  @Input() index;
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onTagClick = new EventEmitter<any>();
  @ViewChild('nameInput') nameInputRef: ElementRef;

  editMode = false;
  separatorKeysCodes = [ ENTER, COMMA ];
  newFile: FileEditor;
  tags = [];
  extention;

  constructor( private utils: UtilsService, private track: TrackingSerivce ) { }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    this.newFile = Object.assign(this.file);
    this.tags = this.file.tags.slice();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.tags.push({ name: value.trim().toLowerCase() });
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: any): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  onSaveClick() {
    if (this.checkNameValid()) {
      this.transformNewFile();
      this.onUpdate.emit(this.newFile);
      this.editMode = false;
      this.track.fileDetailsUpdated();
    }
  }

  transformNewFile() {
    this.newFile.name = this.nameInputRef.nativeElement.value;
    this.newFile.name = this.addExtention(this.newFile);
    this.newFile.tags = this.tags.slice();
    this.newFile['index'] = this.index;
  }

  checkNameValid() {
    if (!this.nameInputRef.nativeElement.value.trim()) {
      this.utils.showErrorModal('Name is required');
      return false;
    } else {
      if (this.nameInputRef.nativeElement.value.trim().length >= 255) {
        this.utils.showErrorModal('Name length should be less than 255 symbols');
      } else {
        return true;
      }
    }
  }

  cancel() {
    this.tags = this.newFile.tags.slice();
    this.editMode = false;
    this.file.name = this.addExtention(this.file);
  }

  changeEditState() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.cancel();
    } else {
      this.file.name = this.removeExtention();
    }
    this.splitTags();
    this.track.editFileClicked();
  }

  splitTags() {
    const newFileTags = [];
    this.file.tags.forEach(tag => {
      const splitedTags = tag.name.split(',');
      splitedTags.forEach(splitedTag => {
        newFileTags.push({ name: splitedTag });
      });
    });
    this.tags = newFileTags;
  }

  removeExtention() {
    const lastDotPosition = this.file.name.lastIndexOf('.');
    if (lastDotPosition === -1) {
      return this.file.name;
    } else {
      this.extention = this.file.name.substr( lastDotPosition);
      return this.file.name.substr(0, lastDotPosition);
    }
  }

  addExtention(file) {
    return this.extention ? file.name + this.extention : file.name;
  }

  getClass() {
    switch (this.file.type) {
      case 'file': return 'icon-doc';
      case 'video': return 'icon-control-play';
      default: return 'icon-doc';
    }
  }

  tagClick(tag) {
    this.onTagClick.emit(tag);
    this.track.tagClicked(tag);
  }

  openImage(file) {
    window.open(file.url, '_blank');
    this.track.openedFile();
  }

  removeFile(fileId) {
    this.onDelete.emit(fileId);
    this.track.fileRemoved(fileId);
  }

  isPngImage(file) {
    let extention;
    const lastDotPosition = file.url.lastIndexOf('.');
    if (lastDotPosition === -1) {
      return;
    } else {
      extention = file.url.substr( lastDotPosition);
      if (extention === '.png') {
        return true;
      }
    }
  }

  getImage(file) {
    return file.thumbnail ?  'url(' + file.thumbnail + ')' :  'url(' + file.url + ')';
  }

}
