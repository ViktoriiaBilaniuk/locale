import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FILE_TYPES, NETWORKS, SRC_TYPE } from '../../../../publication.constants';
import { GeneralCarouselItem } from '../../../../../../../models/posts/linkedPost';
import { PublicationProxyService } from '../../../../../../../core/services/publication/publication-proxy.service';
import { PostErrorsHandlerService } from '../../../../../../../core/services/publication/post-errors-handler.service';
import { fadeInAnimation } from '../../../../../../../shared/animations/fade-in.animation';
import { LINK_TITLE_MAX_LENGTH } from '../link-constants';

@Component({
  selector: 'sl-link-section',
  templateUrl: './link-section.component.html',
  styleUrls: ['./link-section.component.scss'],
  animations: [fadeInAnimation],
})
export class LinkSectionComponent implements OnInit {
  @ViewChild('fileInput') fileInput;
  @Input() item: GeneralCarouselItem;
  @Output() onRemoveItem = new EventEmitter();
  @Output() onOpenContentPool = new EventEmitter();

  constructor(
    private publicationProxyService: PublicationProxyService,
    private postErrorsHandlerService: PostErrorsHandlerService) { }

  ngOnInit() {
  }

  fileChange(e) {
    if (!this.inputFile()) {
      return;
    }
    this.clearSelectedContentPoolFiles();
    if (!this.isValid()) {
      return;
    }
    this.readFile();
  }

  private readFile () {
    const file = this.inputFile();
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.setLocalFile(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  private setLocalFile(src) {
    this.item.file = this.getFileObject(this.file(), src);
  }

  private getFileObject(file, url) {
    return {file: file, url: '', base64: url, type: file.type, name: encodeURIComponent(file.name)};
  }

  isValid() {
    return this.postErrorsHandlerService.validInputFile(this.file(), NETWORKS.FACEBOOK);
  }

  private clearSelectedContentPoolFiles() {
    this.publicationProxyService.contentFiles.map(file => file.selected = false);
  }

  inputFile() {
    if (this.fileInput && this.fileInput.nativeElement.files && this.fileInput.nativeElement.files.length) {
      return this.fileInput.nativeElement.files[0];
    }
  }

  fileTypes() {
    return FILE_TYPES;
  }

  removeCurrentFile() {
    this.item.file = undefined;
  }

  isImage() {
    if (this.file() && this.file().type) {
      return this.file().type.includes(SRC_TYPE.IMAGE) || this.file().type.includes(SRC_TYPE.PICTURE);
    }
  }

  isVideo() {
    if (this.file() && this.file().type) {
      return this.file().type.includes(SRC_TYPE.VIDEO);
    }
  }

  file() {
    if (this.isFile()) {
      return this.item.file;
    }
    return this.inputFile();
  }

  localImageStyle() {
    if (this.item.file) {
      return {'background-image': `url(${this.item.file.base64 ? this.item.file.base64 : this.item.file.url})`};
    }
  }

  isFile() {
    return this.item.file && (this.item.file.url || this.item.file.base64);
  }

  getNumberOfAvailablleSymbols() {
    return this.item.name ? LINK_TITLE_MAX_LENGTH - this.item.name.length : LINK_TITLE_MAX_LENGTH;
  }



}
