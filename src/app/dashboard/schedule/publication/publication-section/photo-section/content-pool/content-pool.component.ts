import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeInAnimation } from '../../../../../../shared/animations/fade-in.animation';
import { AutoUnsubscribe } from '../../../../../../shared/decorators/auto-unsubscribe';
import { PublicationProxyService } from '../../../../../../core/services/publication/publication-proxy.service';
import { SRC_TYPE } from '../../../publication.constants';

@AutoUnsubscribe
@Component({
  selector: 'sl-content-pool',
  templateUrl: './content-pool.component.html',
  styleUrls: ['./content-pool.component.scss'],
  animations: [fadeInAnimation],
})
export class ContentPoolComponent {
  @Input() multiple;
  @Input() videoSizeLimit: number;
  @Input() imageSizeLimit: number;
  @Input() showTitle = true;
  @Input() open = false;
  @Output() onAttach = new EventEmitter();
  venueId;

  constructor (
    private publicationProxyService: PublicationProxyService) {
  }

  uploadClick() {
    this.open = !this.open;
    this.checkPublicationSectionHeight();
  }

  fileClick(file) {
    if (this.checkFileSize(file)) {
      return;
    }
    file.selected ? this.unselectFile(file) : this.selectFile(file);
  }

  selectFile(file) {
    if (!this.multiple) {
      this.clearAllSelectedFiles();
    }
    file.selected = true;
  }

  files() {
    return this.publicationProxyService.isFbAlbumPost() ?
      this.publicationProxyService.contentFiles.filter(file => file.type === SRC_TYPE.IMAGE) :
      this.publicationProxyService.contentFiles;
  }

  getClass(file) {
    switch (file.type) {
      case 'file': return 'icon-doc';
      case 'video': return 'icon-control-play';
      default: return 'icon-doc';
    }
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

  onScroll(event) {
    if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight) {
      this.publicationProxyService.scrollToNewContentPoolFiles.next(true);
    }
  }

  getSelectedCount() {
    return this.files().filter(file => file.selected).length;
  }

  attachFiles() {
    this.publicationProxyService.isFbAlbumPost() ? this.addFilesToAlbum() : this.addLoaddedFile();
  }

  search(searchText) {
    this.publicationProxyService.contentFilesSearchText.next(searchText);
  }

  getSearchText() {
    return this.publicationProxyService.contentFilesSearchText.getValue();
  }

  filesLoading() {
    return this.publicationProxyService.contentFilesLoading;
  }

  getTextForSelectedFiles() {
    return this.getSelectedCount() > 1 ? 'Channels.filesAreSelected' : 'Channels.fileIsSelected';
  }

  private unselectFile(file) {
    if (!this.multiple) {
      this.clearAllSelectedFiles();
    }
    file.selected = false;
  }

  private checkPublicationSectionHeight() {
    if (this.open && this.publicationProxyService.isFbAlbumPost) {
      // document.getElementById('collapsable-content').style.maxHeight = '1084px';
    }
  }

  private addFilesToAlbum() {
    this.onAttach.emit();
    const oldFiles = this.publicationProxyService.albumFiles.slice().map(file => file.file);
    const lastOldFileIndex = oldFiles.length - 1;
    const allFiles = [...oldFiles, ...this.selectedFiles()].slice();
    allFiles.forEach((file, i) => {
      if (i > lastOldFileIndex) {
        this.publicationProxyService.albumFiles[i] = this.fileObject(file);
      }
    });
    this.closeContentPool();
  }

  private closeContentPool() {
    this.open = false;
    this.clearAllSelectedFiles();
  }

  private addLoaddedFile() {
    this.clearPreviousFile();
    if (this.showTitle) {
      this.addToProxyService();
    } else {
      this.emitFile();
    }
    this.open = false;
  }

  addToProxyService() {
    this.publicationProxyService.file = this.fileObject(this.selectedFiles()[0]);
    this.onAttach.emit();
  }

  emitFile() {
    this.onAttach.emit(this.selectedFiles()[0]);
  }

  private clearPreviousFile() {
    this.publicationProxyService.file = null;
    this.publicationProxyService.albumFiles = [];
  }

  private selectedFiles() {
    return this.files().filter(file => file.selected);
  }

  private fileObject(file) {
    if (file.type === SRC_TYPE.IMAGE) {
      return {url: file.url, type: file.type, name: file.name, desc: ''};
    }
    if (file.type === SRC_TYPE.VIDEO) {
      return {url: file.url, type: file.type, name: file.name, desc: ''};
    }
    return null;
  }

  private clearAllSelectedFiles() {
    this.files().forEach(file => file.selected = false);
  }

  checkFileSize(file) {
    if (file.type === SRC_TYPE.IMAGE) {
      if (!file.size) {
        return false;
      }
      return file.size >= this.imageSizeLimit;
    }
    if (file.type === SRC_TYPE.VIDEO) {
      if (!file.size) {
        return false;
      }
      return file.size >= this.videoSizeLimit;
    }
    return null;
  }
}
