import { Component, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'sl-shared-post',
  templateUrl: './shared-post.component.html',
  styleUrls: ['./shared-post.component.scss']
})
export class SharedPostComponent {
  moment: any;
  @Input() post: any;
  @Input() expand: any;
  constructor() {
    this.moment = moment;
  }

  get postDate () {
    return moment(new Date(this.post.date).toISOString());
  }

  get status () {
    return this.post.status;
  }

  get network () {
    return this.post.network;
  }

  get networkName () {
    return this.post.channels.name;
  }

  get description () {
    return this.post.message;
  }

  private get carousel () {
    return this.post.type === 'carousel' && this.post.medias ? this.post.medias.map((m) => ({url: m.url, type: m['@type']})) : [];
  }

  private get pictures () {
    return (this.post.type === 'picture' || this.post.type === 'album' || this.post.type === 'link') &&
    this.post.pictures ?
      this.post.pictures.map((pic) => ({ url: pic, type: 'picture'})) :
      [];
  }

  private get videos () {
    return this.post.type === 'video' && this.post.video ? [{ url: this.post.video, type: 'video'}] : [];
  }

  get media () {
    return [...this.carousel, ...this.pictures, ...this.videos];
  }

  get image () {
    return this.media[0].type === 'picture' ? this.media[0].url : 'assets/images/dashboard/video-background.jpg';
  }

  get postType () {
    return this.media[0].type;
  }

}
