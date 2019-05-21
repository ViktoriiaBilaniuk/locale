import { Injectable } from '@angular/core';
import { CarouselItem, FileType, GeneralCarouselItem, GeneralLinkedPost } from '../../../models/posts/linkedPost';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { NgxLinkifyjsService } from 'ngx-linkifyjs';
import { LinkedPostObjectsService } from './linked-post-objects.service';
import { CreatePostService } from './create-post.service';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe';
import { PublicationService } from './publication.service';
import {
  LINK_POST_TYPE
} from '../../../dashboard/schedule/publication/publication-section/facebook-publication/linked-section/link-constants';
import { ACTION_TYPE, SRC_TYPE } from '../../../dashboard/schedule/publication/publication.constants';
import { ChatService } from '../chat/chat.service';
import * as  momentTimezone from 'moment-timezone';
import { PublicationProxyService } from './publication-proxy.service';

@AutoUnsubscribe
@Injectable({
  providedIn: 'root'
})

export class LinkedPostService {
  generalLinkedPost: GeneralLinkedPost = this.linkedPostObjectsService.emptyGeneralLinkedPost();
  siteLinkForStatusPost = new BehaviorSubject('');
  siteLinkForLinkedPost = new BehaviorSubject('');
  siteLinkMetadata = new BehaviorSubject({});
  siteLinkMetadataLoading = new BehaviorSubject(false);
  carousel: GeneralCarouselItem[] = [];
  action;
  subscriptions = [];
  preSignedUrls$ = [];
  preSignedCarouselObjects = [];

  constructor(
    private linkifyService: NgxLinkifyjsService,
    private linkedPostObjectsService: LinkedPostObjectsService,
    private createPostService: CreatePostService,
    private publicationService: PublicationService,
    private publicationProxyService: PublicationProxyService,
    private chatService: ChatService) {
  }

  clearData() {
    this.generalLinkedPost = this.linkedPostObjectsService.emptyGeneralLinkedPost();
    this.carousel = [];
    this.setSiteLinkForLinkedPost(null);
    this.setSileLinkForStatusPost(null);
    this.siteLinkMetadata.next({});
    this.siteLinkMetadataLoading.next(false);
  }

  setSiteLinkForLinkedPost(link) {
    this.siteLinkForLinkedPost.next(link);
    if (this.publicationProxyService.isLinkedPost()) {
      this.getMetagata(link);
    }
  }

  setSileLinkForStatusPost(link) {
    this.siteLinkForStatusPost.next(link);
    if (this.publicationProxyService.isFbStatusPost()) {
      this.getMetagata(link);
    }
  }

  getMetagata(link) {
    if (link && this.isValidLink(link)) {
      this.getLinkMetadata(link);
    }
  }

  getLinkMetadata(url) {
    this.siteLinkMetadataLoading.next(true);
    return this.publicationService.getLinkMetadata(url)
      .subscribe(data => {
        this.siteLinkMetadata.next(data);
        this.siteLinkMetadataLoading.next(false);
      }, (err) => this.siteLinkMetadataLoading.next(false));
  }

  addNewItemToCarousel() {
    this.carousel.push(this.linkedPostObjectsService.emptyGeneralCarouselItem());
  }

  removeCarouselItem(index) {
    this.carousel.splice(index, 1);
  }

  addContentPoolFileToCaruselItem(file, i) {
    this.carousel[i].file = this.getFileObject(file);
  }

  private getFileObject(file) {
    return {url: file.url, type: file.type};
  }

  setCtaButton(button) {
    this.generalLinkedPost.callToActionButton = button;
  }

  getCtaButton() {
    return this.generalLinkedPost.callToActionButton;
  }

  fetchLinks(value) {
    return this.linkifyService.find(value);
  }

  editAction() {
    if (!this.action) {
      return;
    }
    return this.action.actionName === ACTION_TYPE.EDIT;
  }

  startPostCreating(action) {
    this.resetData();
    this.action = action;
    this.isCarouselPost() ? this.startCreateCarouselPost() : this.makeLinkedPost();
  }

  resetData() {
    this.createPostService.postCreated = new BehaviorSubject(undefined);
    this.subscriptions = [];
    this.preSignedUrls$ = [];
    this.preSignedCarouselObjects = [];
  }

  startCreateCarouselPost() {
    this.isSrcToLoad() ? this.loadSources() : this.makeCarouselPost();
  }

  isSrcToLoad() {
    return !!this.carousel.filter(item => item.file.file).length;
  }

  loadSources() {
    this.loadCarouselSources();
    this.getPresignedUrls();
  }

  loadCarouselSources() {
    this.carousel.forEach(carouselItem => {
      if (carouselItem.file.file) {
        this.preSignedUrls$.push(
          this.publicationService.getPreSignedUrl(
            this.createPostService.venueId, this.getFileType(carouselItem.file), carouselItem.file.file)
        );
      }
    });
  }

  getFileType(file) {
    if (this.isImage(file)) {
      return SRC_TYPE.IMAGE;
    }
    if (this.isVideo(file)) {
      return SRC_TYPE.VIDEO;
    }
  }

  getPresignedUrls() {
    forkJoin(...this.preSignedUrls$).subscribe((results: any) => {
      this.getPreSignedObject(results);
      this.uploadFiles();
    });
  }

  getPreSignedObject(results) {
    let index = -1;
    this.preSignedCarouselObjects = this.carousel.map(carouselItem => {
      if (carouselItem.file.file) {
        index++;
        carouselItem.file = Object.assign({}, carouselItem.file);
        carouselItem.file.url = results[index].data.file_url;
        carouselItem.file.presignedUrl = results[index].data;
      }
      return carouselItem;
    });
  }

  uploadFiles() {
    const carouselFilesUploading$ = [];
    this.preSignedCarouselObjects.forEach(object => {
      if (object.file.presignedUrl) {
        carouselFilesUploading$.push(this.chatService.uploadFile(object.file.presignedUrl.signed_request, object.file.file));
      }
    });
    forkJoin(...carouselFilesUploading$)
      .subscribe(() => {
        this.makeCarouselPost();
      });
    return;
  }

  makeCarouselPost() {
    this.editAction() ? this.editCarouselPost() : this.createCarouselPost();
  }

  editCarouselPost() {
    this.subscriptions.push(
      this.publicationService.editPost(
        this.createPostService.venueId,
        this.createPostService.network(),
        this.carouselPostObjectToEdit(), this.action.postId)
        .subscribe(data => {
          this.createPostService.postCreated.next({data: data});
        }, (err) => {
          this.createPostService.postCreated.next(err);
        })
    );
  }

  createCarouselPost() {
    this.subscriptions.push(
      this.publicationService.createPost(this.createPostService.venueId, this.createPostService.network(), this.carouselPostObject())
        .subscribe(data => {
          this.createPostService.postCreated.next({data: data});
        }, (err) => {
          this.createPostService.postCreated.next(err);
        })
    );
  }

  carouselPostObjectToEdit() {
    const postToEdit = Object.assign(this.carouselPostObject());
    delete postToEdit.channels;
    if (!postToEdit.timezone) {
      postToEdit.timezone = this.currentUserTimezone();
    }
    return postToEdit;
  }

  currentUserTimezone() {
    return momentTimezone.tz.guess();
  }

  carouselPostObject() {
    const basicPost = this.createPostService.basicPostObject();
    return {...basicPost, ...this.carouselPost()};
  }

  carouselPost() {
    const object = {
      subtype: LINK_POST_TYPE.CAROUSEL,
    };
    const carousel = [];
    this.carousel.forEach(item => {
      carousel.push(this.transformCarouselItem(item));
    });
    if (carousel.length) {
      object['subtype_meta'] = {
        link: this.siteLinkForLinkedPost.getValue(),
        child_attachments: carousel
      };
    }
    return object;
  }

  transformCarouselItem(item: GeneralCarouselItem): CarouselItem {
    const basicItem = {};
    if (item.link) {
      basicItem['link'] = item.link;
    } else {
      basicItem['link'] = this.siteLinkForLinkedPost.getValue();
    }
    if (item.name) {
      basicItem['name'] = item.name;
    }
    if (item.description) {
      basicItem['description'] = item.description;
    }
    if (this.callToActionButton()) {
      basicItem['call_to_action'] = this.getCalltoActionValue(item);
    }
    if (this.isImage(item.file)) {
      basicItem['picture'] = item.file.url;
    }
    if (this.isVideo(item.file)) {
      basicItem['video'] = item.file.url;
    }
    return basicItem;
  }

  getCalltoActionValue(item) {
    return {
      type: this.callToActionButton().key,
      value: { link: item.link}
    };
  }

  callToActionButton() {
    return this.generalLinkedPost.callToActionButton;
  }

  isImage(file: FileType) {
    if (file && file.type) {
      return file.type.includes(SRC_TYPE.IMAGE) || file.type.includes(SRC_TYPE.PICTURE);
    }
  }

  isVideo(file: FileType) {
    if (file && file.type) {
      return file.type.includes(SRC_TYPE.VIDEO);
    }
  }

  makeLinkedPost() {
    this.editAction() ? this.editLinkedPost() : this.createLinkedPost();
  }

  getGeneralCarouselItem(item) {
    return this.linkedPostObjectsService.getGeneralCarouselItem(item, this.siteLinkForLinkedPost.getValue());
  }

  editLinkedPost() {
    this.subscriptions.push(
      this.publicationService.editPost(
        this.createPostService.venueId,
        this.createPostService.network(),
        this.linkedPostObjectToEdit(),
        this.action.postId)
      .subscribe(data => {
        this.createPostService.postCreated.next({data: data});
      }, (err) => {
        this.createPostService.postCreated.next(err);
      })
    );
  }

  linkedPostObjectToEdit() {
    const postToEdit = Object.assign(this.linkedPostObject());
    delete postToEdit.channels;
    if (!postToEdit.timezone) {
      postToEdit.timezone = this.currentUserTimezone();
    }
    return postToEdit;
  }

  createLinkedPost() {
    this.subscriptions.push(
      this.publicationService.createPost(this.createPostService.venueId, this.createPostService.network(), this.linkedPostObject())
        .subscribe(data => {
          this.createPostService.postCreated.next({data: data});
        }, (err) => {
          this.createPostService.postCreated.next(err);
        })
    );
  }

  linkedPostObject() {
    const basicPost = this.createPostService.basicPostObject();
    return {...basicPost, ...this.linkedPost()};
  }

  linkedPost() {
    const object = {
      subtype: LINK_POST_TYPE.LINKED,
      subtype_meta: {
        link: this.siteLinkForLinkedPost.getValue(),
      }
    };
    if (this.callToActionButton()) {
      object.subtype_meta['call_to_action'] = {
        type: this.callToActionButton().key,
        value: {
          link: this.siteLinkForLinkedPost.getValue(),
        }
      };
    }
    return object;
  }

  // validation

  isValidCarousel() {
    return this.carousel.length >= 2 &&
      this.carousel.every(item => this.isValidCarouselItem(item)) &&
      this.siteLinkForLinkedPost.getValue();
  }

  validCarouselFiles() {
    return this.carousel.filter(item => this.isValidCarouselItem(item));
  }

  isValidCarouselItem(item) {
    const validFile = (item.file && (item.file.url || item.file.base64) && item.file.type);
    const validLink = item.link && this.isValidLink(item.link);
    return item.link ? validLink && validFile : validFile;
  }

  isCarouselPost() {
    return this.carousel.length;
  }

  isLinkedPostValid() {
    const post = this.linkedPost();
    return post.subtype === LINK_POST_TYPE.LINKED && this.isValidLink(post.subtype_meta.link);
  }

  isLinkedData() {
    return this.isCarouselPost() || this.siteLinkForLinkedPost.getValue() || this.callToActionButton();
  }

  isValidLink(link) {
    if (!link) {
      return false;
    }
    const pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return pattern.test(link);
  }

  isEmptyLinkedPost() {
    return !this.carousel.length && !this.siteLinkForLinkedPost.getValue() && !this.callToActionButton();
  }

}

