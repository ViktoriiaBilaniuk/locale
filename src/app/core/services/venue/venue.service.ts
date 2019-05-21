import { of , throwError } from 'rxjs';
import { switchMap, tap, catchError, delay, map, switchAll } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONSTANTS } from '../../constants';
import { Store } from './../../store/store';
import { PermissionsService } from '../permissions/permissions.service';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class VenueService {

  constructor(
    private http: HttpClient,
    private store: Store,
    private chats: ChatService,
    private permissionsService: PermissionsService,
  ) { }

  fetchDetails(id) {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}venues/${id}/details`).pipe(
      tap((response: any) => this.store.set('venue-details', response.venue)),
      catchError((err: any) => {
        this.store.set('venue-details', null);
        return throwError(err);
      }));
  }

  updateDetails(id, newDetails) {
    return this.http.patch(`${CONSTANTS.API_ENDPOINT}venues/${id}`, newDetails).pipe(
      tap((response: any) => {
        this.store.set('venue-details', response.venue);
        // update chats
        this.chats.refreshChats();
      }),
      catchError((err: any) => {
        if (err.status === 403) {
          this.permissionsService.fetchPermissionsByVenue(id);
        } else {
          this.store.set('venue-details', null);
        }
        return throwError(err);
      }));
  }

  clearVenue () {
    this.store.set('venue-details', null);
  }

  updateDetailsWithoutStoreUpdate (id, newDetails) {
    return this.http.patch(`${CONSTANTS.API_ENDPOINT}venues/${id}`, newDetails);
  }


  uploadFile (file: File) {
    return this.http
      .post(`${CONSTANTS.API_ENDPOINT}venues/menu/s3-signed-url`, {
        file_name: file.name,
        file_type: file.type
      }).pipe(
      switchMap((response: { data: { file_url: string, signed_request: string } }) => {
        return this.http
          .put(response.data.signed_request, file).pipe(
          delay(1000),
          map(() => response),
          catchError((err) => {
            if (err.status === 200) {
              return of(response);
            }
          }));
      }));
  }

  fetchPosts (venueId, from, to, channels) {
    const channelsQuery = channels.length > 0 ? channels.map((channel) => `&channels[]=${channel.id}`).join('') : '';
    return this.http.get(`${CONSTANTS.API_ENDPOINT}posts/${venueId}/list?from=${from}&to=${to}${channelsQuery}`)
      .pipe(
        tap((response: any) => {
          this.store.set('venue-posts', response.data);
        })
      );
  }

  deleteScheduledPost(venueId, network, postId) {
    return this.http.delete(`${CONSTANTS.API_ENDPOINT}posts/${venueId}/${network}/remove/${postId}`);
  }

  fetchPerformance(venueId, from, to, grouped = false) {
    const query = `from=${from}&to=${to}&groupByDate=${grouped}`;
    return this.http.get(`${CONSTANTS.API_ENDPOINT}venues/${venueId}/performance?${query}`);
  }

  fetchPerformancePosts(venueId, from, to, sort, channelId) {
    const query = `from=${from}&to=${to}&sort_by=${sort}`;
    return this.http.get(`${CONSTANTS.API_ENDPOINT}venues/${venueId}/performance/${channelId}?${query}`);
  }

  fetchSlAnalytics (venueId, from, to, eventType) {
    const query = `from=${from}&to=${to}`;
    return this.http.get(`${CONSTANTS.API_ENDPOINT}venues/${venueId}/analytics/${eventType}?${query}`);
  }

  fetchFiles(venueId, skip?, take?, search?, delayValue?) {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}files/${venueId}?skip=${skip}&take=${take}&search=${search}`)
      .pipe(
        delay(delayValue)
      );
  }

  updateFile(fileId, newFile) {
    this.transformTags(newFile);
    return this.http.patch(`${CONSTANTS.API_ENDPOINT}files/${fileId}`, newFile);
  }

  transformTags(newFile) {
    newFile.tags = newFile.tags.map(tag => {
      return tag.name;
    });
  }

  fetchFilesByTag(venueId, tagId) {
    return this.http.get(`${CONSTANTS.API_ENDPOINT}files/${venueId}/tags/${tagId}`);
  }

  deleteFile(fileId) {
    return this.http.delete(`${CONSTANTS.API_ENDPOINT}files/${fileId}`);
  }

}
