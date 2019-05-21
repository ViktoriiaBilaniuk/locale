import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import {
  FILE_TYPES,
  NETWORKS,
  SRC_TYPE,
  FACEBOOK_MAX_IMAGE_SIZE,
  FACEBOOK_MAX_VIDEO_SIZE,
  TWITTER_MAX_IMAGE_SIZE,
  TWITTER_MAX_VIDEO_SIZE,
  INSTAGRAM_MAX_IMAGE_SIZE,
  INSTAGRAM_MAX_VIDEO_SIZE
} from '../../publication.constants';
import { PublicationProxyService } from '../../../../../core/services/publication/publication-proxy.service';
import { fadeInAnimation } from '../../../../../shared/animations/fade-in.animation';
import { PostErrorsHandlerService } from '../../../../../core/services/publication/post-errors-handler.service';

@Component({
  selector: 'sl-photo-section',
  templateUrl: './photo-section.component.html',
  styleUrls: ['./photo-section.component.scss'],
  animations: [fadeInAnimation],
})
export class PhotoSectionComponent implements OnInit, OnChanges {
  @ViewChild('fileInput') fileInput;
  @Input() type;
  showPlaceholder = true;
  fileError$;
  loading;
  isBigVideo;

  imageSizeLimit: number;
  videoSizeLimit: number;

  constructor(
    private publicationProxyService: PublicationProxyService,
    private postErrorsHandlerService: PostErrorsHandlerService
  ) { }

  ngOnInit() {
    this.setContentLimits();
    this.setFile();
  }

  ngOnChanges() {
    this.postErrorsHandlerService.clearData();
    if (this.fileExists()) {
      this.validateFile();
    }
  }

  private setFile() {
    if (this.publicationProxyService.albumFiles[0]) {
      this.publicationProxyService.file = this.publicationProxyService.albumFiles[0];
    }
    this.publicationProxyService.albumFiles = [];
    if (this.fileExists()) {
      this.showPlaceholder = false;
    }
  }

  fileExists() {
    return this.publicationProxyService.file;
  }

  fileChange(e) {
    if (!this.inputFile()) {
      return;
    }
    this.clearOldFiles();
    if (!this.isValid()) {
      return;
    }
    this.checkValidVideoSize();
    this.readFile();
  }

  isValid() {
    return this.postErrorsHandlerService.validInputFile(this.inputFile(), this.type);
  }

  checkValidVideoSize() {
    this.isBigVideo = this.inputFile().size > 50000000;
  }

  getInfoMessage() {
    switch (this.type) {
      case NETWORKS.FACEBOOK: return 'Channels.fbFileUploadInfo';
      case NETWORKS.INSTAGRAM: return 'Channels.instaFileUploadInfo';
      case NETWORKS.TWITTER: return 'Channels.twitterFileUploadInfo';
    }
  }

  setContentLimits() {
    switch (this.type) {
      case NETWORKS.FACEBOOK:
        this.imageSizeLimit = FACEBOOK_MAX_IMAGE_SIZE;
        this.videoSizeLimit = FACEBOOK_MAX_VIDEO_SIZE;
        return;
      case NETWORKS.TWITTER:
        this.imageSizeLimit = TWITTER_MAX_IMAGE_SIZE;
        this.videoSizeLimit = TWITTER_MAX_VIDEO_SIZE;
        return;
      case NETWORKS.INSTAGRAM:
        this.imageSizeLimit = INSTAGRAM_MAX_IMAGE_SIZE;
        this.videoSizeLimit = INSTAGRAM_MAX_VIDEO_SIZE;
        return;
    }
  }

  isVideo() {
    if (this.file() && this.file().type) {
      return this.file().type.includes(SRC_TYPE.VIDEO);
    }
  }

  isImage() {
    if (this.file() && this.file().type) {
      return this.file().type.includes(SRC_TYPE.IMAGE) || this.file().type.includes(SRC_TYPE.PICTURE);
    }
  }

  private readFile () {
    if (this.isBigVideo) {
      this.loading = true;
    }
    const file = this.inputFile();
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.setLocalFile(e.target.result);
      this.loading = false;
      this.isBigVideo = false;
    };
    reader.readAsDataURL(file);
  }

  private setLocalFile(src) {
    this.setFileToService(src);
    this.showPlaceholder = false;
  }

  localImageStyle() {
    if (this.publicationProxyService.file) {
      return {'background-image': `url(${this.publicationProxyService.file.url})`};
    }
  }

  file() {
    if (this.publicationProxyService.file) {
      return this.publicationProxyService.file;
    }
    return this.inputFile();
  }

  inputFile() {
    if (this.fileInput.nativeElement.files.length) {
      return this.fileInput.nativeElement.files[0];
    }
  }

  fileTypes() {
    return FILE_TYPES;
  }

  removeCurrentFile() {
    this.clearInputFile();
    this.clearOldFiles();
    this.showPlaceholder = true;
    this.postErrorsHandlerService.clearData();
  }

  private clearOldFiles() {
    this.publicationProxyService.file = null;
    this.publicationProxyService.albumFiles = [];
    this.clearSelectedContentPoolFiles();
  }

  private clearInputFile () {
    this.fileInput.nativeElement.value = '';
  }

  private clearSelectedContentPoolFiles() {
    this.publicationProxyService.contentFiles.map(file => file.selected = false);
  }

  private setFileToService(src) {
    this.publicationProxyService.file = this.getFileObject(this.file(), src);
    this.publicationProxyService.albumFiles = [];
    this.clearSelectedContentPoolFiles();
    this.validateFile();
  }

  private validateFile() {
    this.postErrorsHandlerService.validateFile(this.type);
    this.subscribeOnFileSizeError();
  }

  private subscribeOnFileSizeError() {
    if (this.fileError$) {
      this.fileError$.unsubscribe();
    }
    this.fileError$ = this.postErrorsHandlerService.fileSizeError
      .subscribe(error => {
        if (error === true) {
          this.clearOldFiles();
        }
      });
  }

  private getFileObject(file, url) {
    return {file: file, url: url, type: file.type, name: encodeURIComponent(file.name)};
  }

  getFileName() {
    if (this.file()) {
      return this.file().name;
    }
  }

  onAttachFileFromContentPool() {
    this.validateFile();
    this.clearInputFile();
  }

  fileSizeError() {
    return this.postErrorsHandlerService.fileSizeError.getValue();
  }

  fileDurationError() {
    return this.postErrorsHandlerService.fileDurationError.getValue();
  }

  fileErrorMess() {
    return this.postErrorsHandlerService.fileErrorMess;
  }

  maxFileLimit() {
    return this.postErrorsHandlerService.maxFileLimit;
  }

  hideError() {
    this.postErrorsHandlerService.clearData();
  }

}
