import { Component, OnInit } from '@angular/core';
import { FACEBOOK_DEFAULT_POST_TYPE, FACEBOOK_POST_TYPES, NETWORKS } from '../../publication.constants';
import { PublicationProxyService } from '../../../../../core/services/publication/publication-proxy.service';
import { AutoUnsubscribe } from '../../../../../shared/decorators/auto-unsubscribe';
import { LinkedPostService } from '../../../../../core/services/publication/linked-post.service';

@AutoUnsubscribe
@Component({
  selector: 'sl-facebook-publication',
  templateUrl: './facebook-publication.component.html',
  styleUrls: ['./facebook-publication.component.scss'],
})
export class FacebookPublicationComponent implements OnInit {
  facebookPostTypes = FACEBOOK_POST_TYPES;
  openContentPool;
  visibleConfirmWindow;
  typeToChange;
  NETWORKS = NETWORKS;

  constructor(
    private publicationProxyService: PublicationProxyService,
    private linkedPostService: LinkedPostService) {
  }

  ngOnInit() {
    this.setPostType();
    this.selectType();
  }

  setPostType() {
    const fbPostType = this.publicationProxyService.fbPostType.getValue();
    this.typeToChange = fbPostType ? {title: fbPostType} : FACEBOOK_DEFAULT_POST_TYPE;
  }

  selectClick(type) {
    this.typeToChange = type;
    if (this.isPostSrc()) {
      this.openConfirmModal();
    } else {
      this.selectType();
    }
  }

  selectedType() {
    return this.facebookPostTypes.find(item => item.selected === true).title;
  }

  selectType() {
    this.facebookPostTypes.forEach((item) => item.selected = false);
    this.facebookPostTypes.forEach((item) => {
      if (item.title === this.typeToChange.title) {
        item.selected = true;
      }
    });
    this.publicationProxyService.fbPostType.next(this.typeToChange.title);
    this.closeConfirmModal();
  }

  onContentPoolOpen(boolean) {
    this.openContentPool = boolean;
  }

  openConfirmModal() {
    this.visibleConfirmWindow = true;
  }

  closeConfirmModal() {
    this.visibleConfirmWindow = false;
  }

  isFbStatusPost() {
    return this.publicationProxyService.isFbStatusPost();
  }

  isLinkedPost() {
    return this.publicationProxyService.isLinkedPost();
  }

  isFbAlbumPost() {
    return this.publicationProxyService.isFbAlbumPost();
  }

  private isPostSrc() {
    return this.publicationProxyService.file ||
      this.publicationProxyService.albumFiles.length ||
      this.linkedPostService.isLinkedData();
  }
}
