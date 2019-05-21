import { Component, OnInit, ViewChild } from '@angular/core';
import { FACEBOOK_ALBUM_NAME_LIMIT, IMAGE_TYPES, MAX_IMAGE_SIZE, SRC_TYPE } from '../../publication.constants';
import { PublicationProxyService } from '../../../../../core/services/publication/publication-proxy.service';
import { fadeInAnimation } from '../../../../../shared/animations/fade-in.animation';

@Component({
  selector: 'sl-album-section',
  templateUrl: './album-section.component.html',
  styleUrls: ['./album-section.component.scss'],
  animations: [fadeInAnimation],
})
export class AlbumSectionComponent implements OnInit {
  @ViewChild('fileInput') fileInput;
  maxAlbumNameLength = FACEBOOK_ALBUM_NAME_LIMIT;
  maxImageSize = MAX_IMAGE_SIZE;
  files = [];
  filesError;

  constructor(
    public publicationProxy: PublicationProxyService) { }

  ngOnInit() {
    this.setFiles();
  }

  fileTypes() {
    return IMAGE_TYPES;
  }

  hideError() {
    this.filesError = false;
  }

  fileChange(e) {
    this.filesError = false;
    const inputFiles = [].slice.call(e.target.files);
    const newFiles = inputFiles.filter(file => {
      if (!this.isValidSize(file)) {
        this.filesError = true;
        this.clearInputFile();
      }
      return this.isValidSize(file);
    });
    const oldFiles = this.publicationProxy.albumFiles.slice().map(file => file.file);
    const lastOldFileIndex = oldFiles.length - 1;
    this.files = [...oldFiles, ...newFiles];
    this.files.forEach((file, i) => {
      if (i > lastOldFileIndex) {
        this.publicationProxy.albumFiles[i] = this.getFileObject(file, '', '');
      }
    });
    this.readFiles(lastOldFileIndex);
  }

  removeFile(i) {
    this.publicationProxy.albumFiles.splice(i, 1);
    this.setStatusFile();
  }

  onAttachFileFromContentPool() {
    this.clearInputFile();
  }

  private setFiles() {
    if (!this.publicationProxy.isFbAlbumPost()) {
      this.publicationProxy.albumFiles = [];

    }
    if (this.publicationProxy.file) {
      if (this.publicationProxy.file.type.includes(SRC_TYPE.IMAGE)) {
        this.publicationProxy.albumFiles.push(this.publicationProxy.file);
      }
    }
    this.publicationProxy.file = null;
  }

  private isValidSize (file) {
    const fileSize = (file.size / 1000) / 1000; // in MB
    return (fileSize <= MAX_IMAGE_SIZE);
  }


  private readFiles(lastOldFileIndex) {
    this.files.forEach((file, i) => {
      if (i > lastOldFileIndex) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.setLocalFileToService(e.target.result, i);
        reader.readAsDataURL(file);
      }
    });
    this.setStatusFile();
  }

  private setStatusFile() {
    this.publicationProxy.file = this.publicationProxy.albumFiles[0];
  }

  private setLocalFileToService(src, i) {
    this.publicationProxy.albumFiles[i].url = src;
  }

  private getFileObject(file, desc, url) {
    return {file: file, desc: desc, url: url, type: file.type, name: encodeURIComponent(file.name)};
  }

  private clearInputFile () {
    this.fileInput.nativeElement.value = '';
  }
}
