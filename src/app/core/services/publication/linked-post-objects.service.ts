import { Injectable } from '@angular/core';
import {
  LINK_POST_TYPE
} from '../../../dashboard/schedule/publication/publication-section/facebook-publication/linked-section/link-constants';
import { SRC_TYPE } from '../../../dashboard/schedule/publication/publication.constants';

@Injectable({
  providedIn: 'root'
})
export class LinkedPostObjectsService {

  constructor() { }

  emptyGeneralLinkedPost() {
    return {
      channels: [],
      timezone: '',
      subtype: LINK_POST_TYPE.LINKED,
    };
  }

  emptyLinkedPost() {
    return {
      channels: [],
      message: '',
      timezone: '',
      subtype: LINK_POST_TYPE.LINKED,
      subtype_meta: this.emptyLinkedSubtype(),
    };
  }

  emptyLinkedSubtype() {
    return {
      link: '',
      call_to_action: this.emptyCallToAction()
    };
  }

  emptyCallToAction() {
    return {
      type: '',
      value: {
        link: ''
      }
    };
  }

  emptyCarouselPost() {
    return {
      channels: [],
      message: '',
      timezone: '',
      subtype: LINK_POST_TYPE.CAROUSEL,
      subtype_meta: {
        link: '',
        child_attachments: [this.emptyCarouselItem()],
      }
    };
  }

  emptyGeneralCarouselItem() {
    return {
      link: '',
      name: '',
      description: '',
      file: this.emptyFile(),
    };
  }

  emptyFile() {
    return {
      url: '',
      type: ''
    };
  }

  emptyCarouselItem() {
    return {
      link: '',
      name: '',
      description: '',
      call_to_action: this.emptyCallToAction(),
    };
  }

  getGeneralCarouselItem(item, postLink) {
    const link = item.link === postLink ? '' : item.link;
    const object = {
      link: link,
      description: item.description,

    };
    if (item.name) {
      object['name'] = item.name;
    }
    if (item.description) {
      object['description'] = item.description;
    }
    if (item.picture) {
      object['file'] = {
        type: SRC_TYPE.PICTURE,
        url: item.picture,
        name: item.name ? item.name : '',
      };
    }
    if (item.video) {
      object['file'] = {
        type: SRC_TYPE.VIDEO,
        url: item.video,
        name: item.name ? item.name : '',
      };
    }
    return object;
  }
}
