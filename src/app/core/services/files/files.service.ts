import { Injectable } from '@angular/core';
import { CONSTANTS } from '../../constants';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FilesService {

  constructor(
    private http: HttpClient) {
  }

  getPreSignedUrl (data) {
    return this.http.post(`${CONSTANTS.API_ENDPOINT}files/s3-signed-url`, data);
  }

  uploadFiles(venueId, files) {
    return this.http.put(`${CONSTANTS.API_ENDPOINT}files/${venueId}`, files);
  }

}
