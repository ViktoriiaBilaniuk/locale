import { Injectable } from '@angular/core';
import { PublicationProxyService } from './publication-proxy.service';
import {
  FACEBOOK_MAX_IMAGE_SIZE,
  FACEBOOK_MAX_VIDEO_SIZE,
  INSTAGRAM_MAX_IMAGE_SIZE,
  NETWORKS,
  PROXY_URL, SRC_TYPE,
  TWITTER_MAX_IMAGE_SIZE,
  TWITTER_MAX_VIDEO_DURATION,
  TWITTER_MAX_VIDEO_SIZE
} from '../../../dashboard/schedule/publication/publication.constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostErrorsHandlerService {
  network;
  fileDurationError;
  fileSizeError;
  fileErrorMess;
  maxFileLimit;
  fileSize;
  fileType;

  constructor(
    private publicationProxyService: PublicationProxyService) {
  }

  public clearData() {
    this.network = null;
    this.fileDurationError = new BehaviorSubject(null as any);
    this.fileSizeError = new BehaviorSubject(null as any);
    this.fileErrorMess = null;
    this.maxFileLimit = null;
    this.fileSize = null;
    this.fileType = null;
  }

  public validateFile(network) {
    this.clearData();
    this.network = network;
    if (this.isContentPoolFile) {
      this.getContentPoolFileSize();
    }
    if (this.isLoaddedFile) {
      this.getLoaddedFileSize();
    }
  }

  public validInputFile(inputFile, network) {
    this.clearData();
    this.network = network;
    this.setFileInfo(inputFile.size, inputFile.type);
    this.checkError();
    return !this.fileSizeError.getValue();
  }

  validateVideoDuration(duration) {
    const durationError = duration >= TWITTER_MAX_VIDEO_DURATION;
    this.fileDurationError.next(durationError);
    if (durationError) {
      this.fileErrorMess = 'Channels.videoDurationShouldBeLessThan';
      this.publicationProxyService.clearCurrentFile();
    }
  }

  validateVideoResolution(resolution) {

  }

  setFileInfo(size, type) {
    this.fileSize = size / 1000 / 1000; // in MB
    this.fileType = type;
  }

  private get isContentPoolFile() {
    if (!this.publicationProxyService.file) {
      return;
    }
    return !!this.publicationProxyService.file.url && !this.publicationProxyService.file.file;
  }

  private get isLoaddedFile() {
    if (!this.publicationProxyService.file) {
      return;
    }
    return !!this.publicationProxyService.file.file;
  }

  private getContentPoolFileSize() {
    const proxyUrl = PROXY_URL;
    const request = new XMLHttpRequest();
    request.open('GET', proxyUrl + this.publicationProxyService.file.url);
    request.responseType = 'blob';
    request.onload = () => {
      this.setFileInfo(request.response.size, request.response.type);
      this.checkError();
    };
    request.send();
  }

  private getLoaddedFileSize() {
    this.setFileInfo(this.publicationProxyService.file.file.size, this.publicationProxyService.file.type);
    this.checkError();
  }

  private checkError() {
    if (this.isSizeError) {
      this.fileSizeError.next(true);
      this.fileErrorMess = this.fileErrorMessage;
      this.maxFileLimit = this.maxFileSize;
    }
  }

  private get fileErrorMessage() {
    if (this.isImage) {
      return 'Channels.imageError';
    }
    if (this.isVideo) {
      return 'Channels.videoError';
    }
  }

  private get maxFileSize() {
    if (this.isImage) {
      return this.maxImageSize + 'MB';
    }
    if (this.isVideo) {
      return this.maxVideoSize + 'MB';
    }
  }

  private get isSizeError() {
    if (this.isImage) {
      return (this.fileSize > this.maxImageSize);
    }
    if (this.isVideo) {
      return (this.fileSize > this.maxVideoSize);
    }
  }

  private get isImage() {
    return this.fileType.includes(SRC_TYPE.IMAGE) || this.fileType.includes(SRC_TYPE.PICTURE);
  }

  private get isVideo() {
    return this.fileType.includes(SRC_TYPE.VIDEO);
  }

  private get maxImageSize() {
    switch (this.network) {
      case NETWORKS.FACEBOOK: return FACEBOOK_MAX_IMAGE_SIZE;
      case NETWORKS.INSTAGRAM: return INSTAGRAM_MAX_IMAGE_SIZE;
      case NETWORKS.TWITTER: return TWITTER_MAX_IMAGE_SIZE;
    }
  }

  private get maxVideoSize() {
    switch (this.network) {
      case NETWORKS.FACEBOOK: return FACEBOOK_MAX_VIDEO_SIZE;
      case NETWORKS.TWITTER: return TWITTER_MAX_VIDEO_SIZE;
    }
  }
}
