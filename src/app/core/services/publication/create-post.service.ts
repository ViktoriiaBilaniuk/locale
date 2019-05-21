import { Injectable } from '@angular/core';
import { PublicationProxyService } from './publication-proxy.service';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { PublicationService } from './publication.service';
import { ChatService } from '../chat/chat.service';
import { Store } from '../../store/store';
import * as  momentTimezone from 'moment-timezone';
import { AutoUnsubscribe } from '../../../shared/decorators/auto-unsubscribe';
import { ACTION_TYPE, SRC_TYPE, SUBTYPE } from '../../../dashboard/schedule/publication/publication.constants';

@AutoUnsubscribe
@Injectable({
  providedIn: 'root'
})

export class CreatePostService {
  venueId;
  subscriptions = [];
  preSignedUrls$ = [];
  preSignedUrls = [];
  preSignedAlbumObjects = [];
  postCreated = new BehaviorSubject(undefined);
  action;

  constructor(
    private store: Store,
    private chatService: ChatService,
    private publicationService: PublicationService,
    private publicationProxyService: PublicationProxyService) {
  }

  resetData() {
    this.postCreated = new BehaviorSubject(undefined);
    this.subscriptions = [];
    this.preSignedUrls$ = [];
    this.preSignedUrls = [];
    this.preSignedAlbumObjects = [];
  }

  startPostCreating(action) {
    this.resetData();
    this.action = action;
    this.isSrcToLoad() ? this.loadSources() : this.createPost();
  }

  createPost() {
    if (this.isAlbumPost()) {
      this.makeAlbumPost();
    } else {
      this.makeSimplePost();
    }
  }

  makeAlbumPost() {
    this.editAction() ? this.editAlbumPost() : this.createAlbumPost();
  }

  makeSimplePost() {
    this.editAction() ? this.editSimplePost() : this.createSimplePost();
  }

  editAction() {
    if (!this.action) {
      return;
    }
    return this.action.actionName === ACTION_TYPE.EDIT;
  }

  editSimplePost() {
    this.subscriptions.push(this.publicationService.editPost(this.venueId, this.network(), this.simplePostToEdit(), this.action.postId)
      .subscribe(data => {
        this.postCreated.next({data: data});
      }, (err) => {
        this.postCreated.next(err);
      })
    );
  }

  editAlbumPost() {
    if (this.allSourcesLoadded()) {
      this.createAlbumPostWithLoaddedSrc();
    }
    this.subscriptions.push(this.publicationService.editPost(this.venueId, this.network(), this.albumPostToEdit(), this.action.postId)
      .subscribe(data => {
        this.postCreated.next({data: data});
      }, (err) => {
        this.postCreated.next(err);
      })
    );
  }

  simplePostToEdit() {
    const postToEdit = Object.assign(this.simplePost());
    delete postToEdit.channels;
    if (!postToEdit.timezone) {
      postToEdit.timezone = this.currentUserTimezone();
    }
    return postToEdit;
  }

  currentUserTimezone() {
    return momentTimezone.tz.guess();
  }

  createSimplePost() {
    this.subscriptions.push(this.publicationService.createPost(this.venueId, this.network(), this.simplePost())
      .subscribe(data => {
        this.postCreated.next({data: data});
      }, (err) => {
        this.postCreated.next(err);
      })
    );
  }

  description() {
    return this.publicationProxyService.description;
  }

  descriptionValue() {
    if (!this.description() || !this.description().value) {
      return;
    }
    return this.description().value;
  }

  isPicture() {
    if (!this.file()) {
      return;
    }
    return this.getSourceType(this.fileType()) === SRC_TYPE.IMAGE;
  }

  isVideo() {
    if (!this.file()) {
      return;
    }
    return this.getSourceType(this.fileType()) === SRC_TYPE.VIDEO;
  }

  getSourceType(type) {
    if (!type) {
      return;
    }
    return type.includes(SRC_TYPE.IMAGE) ? SRC_TYPE.IMAGE : SRC_TYPE.VIDEO;
  }

  timezone() {
    if (!this.publicationProxyService.schedule.timezone) {
      return this.currentUserTimezone();
    }
    return this.publicationProxyService.schedule.timezone;
  }

  simplePost() {
    if (this.isPicture()) {
      return this.getSimplePostWithSrc('picture_url');
    }
    if (this.isVideo()) {
      return this.getSimplePostWithSrc('video_url');
    }
    if (this.isLink()) {
      return this.getSimplePostWithLink();
    }
    return this.basicPostObject();
  }

  isLink() {
    return this.publicationProxyService.descriptionHasValidLink();
  }

  getSimplePostWithLink() {
    const post = this.basicPostObject();
    post['link'] = this.publicationProxyService.getFirstLink(this.descriptionValue());
    return post;
  }

  basicPostObject() {
    return this.isDate() ? this.basicSchedulePost() : this.basicPost();
  }

  isDate() {
    return this.publicationProxyService.schedule.timezone &&
      this.publicationProxyService.schedule.utcTimestamp &&
      !this.publicationProxyService.schedule.error;
  }

  basicPost() {
    return {
      message: this.descriptionValue(),
      channels: this.selectedChannelsIds(),
      timezone: this.timezone(),
    };
  }

  basicSchedulePost() {
    const post = this.basicPost();
    post['schedule_timestamp'] = this.publicationProxyService.schedule.utcTimestamp;
    return post;
  }

  selectedChannelsIds() {
    return this.publicationProxyService.selectedChannels.map(item => item.id);
  }

  getSimplePostWithSrc(srcName) {
    const post = this.basicPostObject();
    post[srcName] = this.preSignedUrls[0] ? this.preSignedUrls[0].file_url :  this.file().url;
    return post;
  }

  isSrcToLoad() {
    return this.isAlbumPost() ? this.isSrcToLoadInAlbum() : (!!this.file() && !!this.file().file);
  }

  isSrcToLoadInAlbum() {
    return !!this.publicationProxyService.albumFiles.filter(file => file.file).length;
  }

  isAlbumPost() {
    return this.publicationProxyService.isFacebook() && this.publicationProxyService.isFbAlbumPost();
  }

  file() {
    if (this.publicationProxyService.file) {
      return this.publicationProxyService.file;
    }
  }

  fileType() {
    if (this.publicationProxyService.file) {
      return this.publicationProxyService.file.type;
    }
  }

  loadSources() {
    if (this.isAlbumPost()) {
      this.loadAlbumSources();
      this.getPresignedUrls();
    } else {
      if (this.file().file) {
        this.preSignedUrls$.push(
          this.publicationService.getPreSignedUrl(this.venueId, this.getSourceType(this.fileType()), this.file())
        );
        this.getPresignedUrls();
      }
    }
  }

  loadAlbumSources() {
    this.publicationProxyService.albumFiles.forEach(file => {
      if (file.file) {
        this.preSignedUrls$.push(this.publicationService.getPreSignedUrl(this.venueId, SRC_TYPE.IMAGE, file.file));
      }
    });
  }

  getPresignedUrls() {
    forkJoin(...this.preSignedUrls$).subscribe((results: any) => {
      if (this.isAlbumPost()) {
        this.getPreSignedObject(results);
      } else {
        this.setPreSignedUrls(results);
      }
      this.uploadFiles();
    });
  }

  getPreSignedObject(results) {
    let index = -1;
    this.preSignedAlbumObjects = this.publicationProxyService.albumFiles.map(file => {
      if (file.file) {
        index++;
        return {
          desc: file.desc,
          url: results[index].data.file_url,
          presignedUrl: results[index].data,
          file: file.file
        };
      } else {
        return this.getFileObjectWithLoaddedSrc(file);
      }
    }).slice();
  }

  setPreSignedUrls(results) {
    this.preSignedUrls = results.map((item: any) => item.data );
  }

  uploadFiles() {
    if (this.isAlbumPost()) {
      this.uploadAlbumFiles();
    } else {
      this.uploadPostFiles();
    }
  }

  uploadAlbumFiles() {
    const albumFilesUploading$ = [];
    this.preSignedAlbumObjects.forEach(file => {
      if (file.presignedUrl) {
        albumFilesUploading$.push(this.chatService.uploadFile(file.presignedUrl.signed_request, file.file));
      }
    });
    forkJoin(...albumFilesUploading$)
      .subscribe(() => {
        this.makeAlbumPost();
      });
    return;
  }

  uploadPostFiles() {
    if (this.preSignedUrls[0]) {
      this.subscriptions.push(
        this.chatService.uploadFile(this.preSignedUrls[0].signed_request, this.publicationProxyService.file.file)
          .subscribe((res) => {
            this.makeSimplePost();
          })
      );
    } else {
      this.makeSimplePost();
    }
  }

  createAlbumPost() {
    if (this.allSourcesLoadded()) {
      this.createAlbumPostWithLoaddedSrc();
    }
    this.subscriptions.push(this.publicationService.createPost(this.venueId, this.network(), this.albumPost())
      .subscribe(data => {
        this.postCreated.next({data: data});
      }, (err) => {
        this.postCreated.next(err);
      })
    );
  }

  albumPost() {
    return this.isDate() ? this.basicScheduleAlbumPost() : this.basicAlbumPost();
  }

  albumPostToEdit() {
    const postToEdit = Object.assign(this.albumPost());
    delete postToEdit.channels;
    if (!postToEdit.timezone) {
      postToEdit.timezone = this.currentUserTimezone();
    }
    return postToEdit;
  }

  basicScheduleAlbumPost() {
    const post = this.basicAlbumPost();
    post['schedule_timestamp'] = this.publicationProxyService.schedule.utcTimestamp;
    return post;
  }

  basicAlbumPost() {
    return {
      message: this.descriptionValue(),
      channels: this.selectedChannelsIds(),
      timezone: this.timezone(),
      subtype: SUBTYPE.ALBUM,
      subtype_meta: {
        album_name: this.publicationProxyService.albumName,
        album_description: this.descriptionValue(),
      },
      medias: this.preSignedAlbumObjects.map(file => {
        return this.getAlbumMediaObject(file);
      }),
    };
  }

  getAlbumMediaObject(file) {
    return {
      url: file.url,
      caption: file.desc,
      '@type': 'picture'
    };
  }

  createAlbumPostWithLoaddedSrc() {
    this.preSignedAlbumObjects = this.publicationProxyService.albumFiles.map(file => {
      return this.getFileObjectWithLoaddedSrc(file);
    }).slice();
  }

  getFileObjectWithLoaddedSrc(file) {
    return {
      desc: file.desc,
      url: file.url
    };
  }

  allSourcesLoadded() {
    return !this.preSignedAlbumObjects.filter(file => file.file).length;
  }

  network() {
    return this.publicationProxyService.network.getValue();
  }
}
