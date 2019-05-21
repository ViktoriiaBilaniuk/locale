import { Component, OnInit, ViewChild, Input, Renderer2 } from '@angular/core';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { MessageTypes } from '../../../../core/services/chat/message-types';
import { TrackingSerivce } from '../../../../core/services/tracking/tracking.service';
import { MAX_IMAGE_SIZE, MAX_VIDEO_SIZE } from '../../../schedule/publication/publication.constants';
import { MAX_FILE_SIZE } from '../chat.constants';
import { FILE_TYPES_FOR_CONTENT_POOL } from '../../../files/files.constant';

@Component({
  selector: 'sl-chat-actions-area',
  templateUrl: './chat-actions-area.component.html',
  styleUrls: ['./chat-actions-area.component.scss']
})

export class ChatActionsAreaComponent implements OnInit {
  uploadSubscriptions = [];
  expand;
  files = [];
  toasts = [];
  errorMess = [];
  preSignedUrls = [];
  @Input() chat: any;
  @ViewChild('fileInput') fileInput;
  @ViewChild('message') message;

  constructor(
    private utils: UtilsService,
    private renderer: Renderer2,
    private track: TrackingSerivce,
    private chatService: ChatService) {
  }

  ngOnInit() {
    this.reset();
    this.setupEventListeners(['cut', 'paste', 'keydown']);
  }

  reset() {
    this.files = [];
    this.toasts = [];
    this.errorMess = [];
    this.uploadSubscriptions = [];
    this.message.nativeElement.value = '';
  }

  fileChange (event) {
    this.reset();
    this.files = [].slice.call(event.target.files);
    this.clearFile();
    // this.validateFiles();
    if (this.errorMess.length) {
      this.utils.showErrorModal(this.generalErrorMessage);
    } else {
      this.files.forEach((file, i) => {
        this.toasts.push(this.getNewToast(true, file.name, file.lastModified));
        this.chatService.getPreSignedUrl({
          file_name: file.name,
          file_type: file.type
        })
          .subscribe((data) => {
            this.preSignedUrls[i] = data;
            if (i === this.files.length - 1) {
              setTimeout(() => {
                this.uploadFiles();
              }, 1000);

            }
          });
      });
    }
  }

  uploadFiles() {
    this.files.forEach((file, i) => {
      this.putFile(this.preSignedUrls[i], file, i);
    });
  }

  getNewToast(show, text, lastModified) {
    return {
      show: show,
      text: this.truncate(text, 14),
      fileId: lastModified
    };
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

  private validateFiles() {
    this.files.forEach(file => {
      if (!this.validSize(file)) {
        this.errorMess.push(this.getErrorMessage(file));
      }
    });
  }

  getErrorMessage(file) {
    return 'The file size' + ' (' + file.name + ') ' + 'cannot exceed ' + this.getMaxFileSize(file) + ' MB.' + '<br>';
  }

  get generalErrorMessage() {
    let message = '';
    this.errorMess.forEach(mess => {
      message += this.truncate(mess, 60) + '\n';
    });
    return message;
  }

  private putFile (data, file, i) {
    const {file_url, signed_request } = data.data;
    this.uploadSubscriptions[i] = this.chatService.uploadFile(signed_request, file)
      .subscribe(() => {
        this.track.attachFile();
        const toastToDelete = this.toasts.filter(toast => toast.fileId === file.lastModified);
        this.toasts.splice(this.toasts.indexOf(toastToDelete, 1));
        this.chatService.sendMessage({ type : this.getFileType(file), content: { name: file.name, url : file_url}}, this.chatId)
          .subscribe();
      });
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

  private validSize(file) {
    const fileSize = (file.size / 1000) / 1000; // in MB
    return fileSize <= this.getMaxFileSize(file);
  }

  getMaxFileSize(file) {
    if (file.type.includes('image')) {
      return MAX_IMAGE_SIZE;
    }
    if (file.type.includes('video')) {
      return MAX_VIDEO_SIZE;
    }
    return MAX_FILE_SIZE;
  }

  private clearFile () {
    this.fileInput.nativeElement.value = '';
  }

  private get chatId() {
    return this.chat.venue_chat_model_id._id;
  }

  sendMessage (message) {
    if (!message || !(message.trim(' '))) {
      return false;
    }
    this.renderer.setStyle(this.message.nativeElement, 'height', 'auto');
    this.chatService.sendMessage({type: MessageTypes.TEXT, content: {text: message}}, this.chatId)
      .subscribe();
    this.reset();
    return false;
  }

  cancelUpload(i) {
    this.files.splice(i, 1);
    if (this.uploadSubscriptions[i]) {
      this.uploadSubscriptions[i].unsubscribe();
    }
    this.toasts.splice(i, 1);
  }

  private setupEventListeners(events: string[]) {
    const callback = () => {
      window.setTimeout(() => {
        this.renderer.setStyle(this.message.nativeElement, 'height', 'auto');
        this.renderer.setStyle(this.message.nativeElement, 'height', `${this.message.nativeElement.scrollHeight}px`);
      }, 0);
    };
    events.forEach((event) => this.renderer.listen(this.message.nativeElement, event, callback));
    callback(); // triggers first time function when setting up to expand input immediately
  }

  fileTypes() {
    return FILE_TYPES_FOR_CONTENT_POOL;
  }
}
