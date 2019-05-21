import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { PublicationProxyService } from '../../../../../core/services/publication/publication-proxy.service';
import {
  FACEBOOK_MAX_DESCRIPTION_COUNT,
  INSTAGRAM_MAX_DESCRIPTION_COUNT, NETWORKS,
  TWITTER_MAX_DESCRIPTION_COUNT
} from '../../publication.constants';
import { LinkedPostService } from '../../../../../core/services/publication/linked-post.service';

class MatLinkPreviewService {
}

@Component({
  selector: 'sl-publication-textarea',
  templateUrl: './publication-textarea.component.html',
  styleUrls: ['./publication-textarea.component.scss']
})
export class PublicationTextareaComponent implements OnInit, OnChanges {
  @ViewChild('mainInput') mainInput;
  @Input() type;
  @Input() subtype;
  @Output() onChange = new EventEmitter();
  invalid = false;
  value = '';
  twitterLimit = TWITTER_MAX_DESCRIPTION_COUNT;
  emojiOpen;
  cursorPosition;
  NETWORKS = NETWORKS;
  mentionConfig = {
    labelKey: 'name'
  };
  mentionItems = [
    {name: 'Alina', image: 'https://image.freepik.com/free-photo/hair-style-street-fashion-beautiful-girl_1139-844.jpg'},
    {name: 'Anna', image: 'https://image.freepik.com/free-photo/hair-style-street-fashion-beautiful-girl_1139-844.jpg'},
    {name: 'Mark', image: 'https://image.freepik.com/free-photo/hair-style-street-fashion-beautiful-girl_1139-844.jpg'}
    ];

  constructor(
    private publicationProxyService: PublicationProxyService,
    private linkedPostService: LinkedPostService) {}

  ngOnInit() {
    this.getValue();
  }

  ngOnChanges(changes) {
    if (changes.subtype && this.subtype === 'status') {
      this.findLinks();
    }
  }

  private getValue() {
    if (this.publicationProxyService.description) {
      this.value = this.publicationProxyService.description.value;
      this.findLinks();
    }
  }

  change() {
    this.publicationProxyService.description = {value: this.value, valid: this.valid()};
    this.findLinks();
  }

  findLinks() {
    const links = this.linkedPostService.fetchLinks(this.value);
    if (links && links[0]) {
      this.setLink(links[0].href);
    }
  }

  setLink(value) {
    this.linkedPostService.setSileLinkForStatusPost(value);
  }

  private valid() {
    switch (this.type) {
      case 'facebook': return this.value.length <= FACEBOOK_MAX_DESCRIPTION_COUNT;
      case 'instagram': return this.value.length <= INSTAGRAM_MAX_DESCRIPTION_COUNT;
      case 'twitter': return this.value.length <= TWITTER_MAX_DESCRIPTION_COUNT;
    }
  }

  getPlaceholder() {
    return 'Channels.typeToAdd';
  }

  maxLength() {
    switch (this.type) {
      case 'facebook': return FACEBOOK_MAX_DESCRIPTION_COUNT;
      case 'instagram': return INSTAGRAM_MAX_DESCRIPTION_COUNT;
      case 'twitter': return TWITTER_MAX_DESCRIPTION_COUNT;
    }
  }

  selectEmoji(event) {
    if ((this.value.length + 2 ) <= this.maxLength()) {
      this.value = this.value.slice(0, this.cursorPosition) + event.emoji.native + this.value.slice(this.cursorPosition, this.value.length);
      this.setCursorPosition(event);
      this.change();
      this.closeEmojiPopup();
    }
  }

  private setCursorPosition(event) {
    const futureCursorPosition = this.cursorPosition + event.emoji.native.length;
    setTimeout(() => {
      this.mainInput.nativeElement.focus();
      this.mainInput.nativeElement.setSelectionRange(futureCursorPosition, futureCursorPosition);
    }, 0);
  }

  onClickedOutsideEmojiPopup() {
    this.closeEmojiPopup();
  }

  closeEmojiPopup() {
    this.emojiOpen = false;
  }

  openEnijiPopup() {
    this.emojiOpen = true;
  }

  emojiIconClick(e) {
    e.stopPropagation();
    this.openEnijiPopup();
  }

  onBlur() {
    this.cursorPosition = this.mainInput.nativeElement.selectionStart;
  }

  isFbStatusPost() {
    return this.publicationProxyService.isFbStatusPost();
  }

  byteValueStringLength() {
    const string = this.value.trim();
    return new Blob([string]).size;
  }

}
