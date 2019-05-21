import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MessageTypes } from '../../../../core/services/chat/message-types';

@Component({
  selector: 'sl-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent implements OnInit {
  @Input() message;
  @Output() click = new EventEmitter();
  @ViewChild('videoPlayer') video;
  @ViewChild('defaultPlaceholder') placeholder;
  @Input() searchResult;
  @Input() expand;

  constructor() { }

  ngOnInit() {
  }

  imageLoaded () {
    // this event handler is necessary to trigger angular change detection
    // (update scroll position) after image is loaded
  }

  get isImage () {
    return this.message.type === MessageTypes.IMAGE;
  }

  get type () {
    return this.message.type === MessageTypes.VIDEO ?
      'media' : 'file';
  }

  get isVideo () {
    return this.message.type === MessageTypes.VIDEO;
  }

  get fileName () {
    return this.message.content.name || this.message.content.url.substring(this.message.content.url.lastIndexOf('/') + 1);
  }

  play() {
    this.video.nativeElement.play();
  }

  hideDefaultPlaceholder() {
    if (this.placeholder) {
      this.placeholder.nativeElement.style.display = 'none';
    }
  }

  togglePlay() {
    this.video.nativeElement.paused ? this.video.nativeElement.play() : this.video.nativeElement.pause();
  }

  getClass() {
    switch (this.type) {
      case 'file': return 'icon-doc';
      case 'media': return 'icon-control-play';
      default: return 'icon-doc';
    }
  }

}
