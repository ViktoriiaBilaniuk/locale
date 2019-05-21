import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { UploaderOptions, UploadOutput } from 'ngx-uploader';
import { ChatService } from '../../../core/services/chat/chat.service';
import { FilesService } from '../../../core/services/files/files.service';
import { Subscription } from 'rxjs';
import { MessageTypes } from '../../../core/services/chat/message-types';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe';
import { FILE_TYPES_FOR_CONTENT_POOL } from '../files.constant';

@AutoUnsubscribe
@Component({
  selector: 'sl-drop-files',
  templateUrl: './drop-files.component.html',
  styleUrls: ['./drop-files.component.scss']
})
export class DropFilesComponent implements OnInit, OnChanges {
  private maxImageSize = 5;
  private maxVideoSize = 15;

  @Output() onFinishUpload = new EventEmitter();
  @Output() onDrag = new EventEmitter();
  @Input() venueId;
  @Input() filesUploaddedOnClick;

  uploadSubscriptions: Array<Subscription> = [];
  subscriptions: Array<Subscription> = [];
  options: UploaderOptions;
  uploaddedFileCount = 0;
  preSignedUrls = [];
  errorMess = [];
  toasts = [];
  files = [];
  drag;

  constructor(
    private fileService: FilesService,
    private chatService: ChatService,
    private utils: UtilsService,
  ) {
  }

  ngOnInit() {
    this.reset();
  }

  ngOnChanges(changes) {
    if (changes.filesUploaddedOnClick && this.filesUploaddedOnClick.length) {
      this.reset();
      this.files = this.filesUploaddedOnClick;
      this.showDragWrapper();
      this.validation();
    }
  }

  drop(e) {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      this.reset();
      this.files = Array.from(e.dataTransfer.files);
      this.validation();
    }
  }

  validation() {
    this.validateFiles();
    if (this.errorMess.length) {
      this.utils.showErrorModal(this.generalErrorMessage);
      this.hideDragWrapper();
      setTimeout(() => {
        window.focus();
      });
    } else {
      this.getPreSignedUrls();
    }
  }

  get generalErrorMessage() {
    let message = '';
    this.errorMess.forEach(mess => {
      message += this.truncate(mess, 60) + `<br>`;
    });
    return message;
  }

  truncate(fullStr, maxStringLength) {
    if (fullStr.length <= maxStringLength) {
      return fullStr;
    }
    const separator = '...';
    const separatorLength = separator.length,
      charsToShow = maxStringLength - separatorLength,
      frontChars = Math.ceil(charsToShow / 2),
      backChars = Math.floor(charsToShow / 2);
    return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
  }

  getPreSignedUrls() {
    this.files.forEach((file, i) => {
      this.toasts.push(this.getNewToast(true, file.name, file.lastModified));
      this.subscriptions.push(this.fileService.getPreSignedUrl({
        file_name: file.name,
        file_type: file.type
      })
        .subscribe((data: any) => {
          this.preSignedUrls[i] = data.data;
          if (i === this.files.length - 1) {
            setTimeout(() => {
              this.uploadFiles();
            }, 1000);
          }
        }));
    });
  }

  getNewToast(show, text, lastModified) {
    return {
      show: show,
      text: this.truncate(text, 40),
      fileId: lastModified
    };
  }

  private uploadFiles() {
    this.files.forEach((file, i) => {
      this.putFile(this.preSignedUrls[i].signed_request, file, i);
    });

  }

  private putFile (signedRequest, file, i) {
    this.uploadSubscriptions[i] = this.chatService.uploadFile(signedRequest, file)
      .subscribe((res) => {
        this.uploaddedFileCount++;
        const toastToDelete = this.toasts.filter(toast => toast.fileId === file.lastModified);
        this.toasts.splice(this.toasts.indexOf(toastToDelete, 1));
        if (this.uploaddedFileCount === this.files.length) {
          this.fileService.uploadFiles(this.venueId, {files: this.filesToUpload})
            .subscribe(() => {
              this.onFinishUpload.emit(Math.random());
              this.hideDragWrapper();
            });
        }
      });
  }

  get filesToUpload() {
    return this.files.map((file, i) => {
      return {
        type: this.getFileType(file),
        name: file.name,
        url: this.preSignedUrls[i].file_url,
        size: this.formatFileSize(file.size),
      };
    });
  }

  formatFileSize(size) {
    return ((size / 1000) / 1000);
  }

  private getFileType (file) {
    const type = file.type.substring(0, file.type.lastIndexOf('/'));
    if (type === MessageTypes.IMAGE || type === MessageTypes.VIDEO) {
      return type;
    } else if (type === 'application') {
      return  file.type.substring(file.type.lastIndexOf('/'), file.type.length - 1) === MessageTypes.PDF ?
        MessageTypes.PDF : MessageTypes.FILE;
    }
    return MessageTypes.FILE;
  }

  onUploadOutput(output: UploadOutput) {
    if (output.type === 'dragOver') {
      this.showDragWrapper();
    }
    if (output.type === 'dragOut') {
      this.hideDragWrapper();
    }
  }

  private reset() {
    this.files = [];
    this.toasts = [];
    this.errorMess = [];
    this.preSignedUrls = [];
    this.uploadSubscriptions = [];
    this.uploaddedFileCount = 0;
  }

  private validateFiles() {
    this.files.forEach(file => {
      if (!this.validFormat(file)) {
        this.errorMess.push(this.getFormatErrorMessage(file));
      }
    });
  }

  validFormat(file) {
    const validFormates = FILE_TYPES_FOR_CONTENT_POOL.split(',.');
    return validFormates.some((format) => file.type.includes(format));
  }

  getErrorMessage(file) {
    return 'The file size' + ' (' + file.name + ') ' + 'cannot exceed ' + this.getMaxFileSize(file.type) + ' MB.';
  }

  getFormatErrorMessage(file) {
    return 'Invalid file format' + ' (' + file.name + ')';
  }

  getMaxFileSize(type) {
    return type.includes('image') ? this.maxImageSize : this.maxVideoSize;
  }

  private hideDragWrapper() {
    this.drag = false;
    this.onDrag.emit(false);
  }

  private showDragWrapper() {
    this.drag = true;
    this.onDrag.emit(true);
  }

  cancelUpload(i) {
    this.files.splice(i, 1);
    this.preSignedUrls.splice(i, 1);
    if (this.uploadSubscriptions[i]) {
      this.uploadSubscriptions[i].unsubscribe();
    }
    this.toasts.splice(i, 1);
    if (!this.files.length) {
      this.hideDragWrapper();
    }
  }

}
