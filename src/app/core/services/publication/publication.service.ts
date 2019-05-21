import { Injectable } from '@angular/core';
import { CONSTANTS } from '../../constants';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PublicationService {

  constructor(private http: HttpClient) { }

  getPreSignedUrl (venueId, sourceType, data) {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}posts/${venueId}/${sourceType}/storage-sign-url?` +
      `file_name=${encodeURIComponent(data.name)}&file_type=${encodeURIComponent(data.type)}`);
  }

  createPost (venueId, network, post) {
    return this.http.post(`${CONSTANTS.API_ENDPOINT}posts/${venueId}/${network}/create`, post);
  }

  editPost(venueId, network, post, postId) {
    return this.http.patch(`${CONSTANTS.API_ENDPOINT}posts/${venueId}/${network}/update/${postId}`, post);
  }

  getLinkMetadata(url) {
    return this.http.get(`${CONSTANTS.LINK_PREVIEW_ENDPOINT}?key=${CONSTANTS.LINK_PREVIEW_KEY}&q=${url}`);
  }

}
