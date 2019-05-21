import { BehaviorSubject, of } from 'rxjs';
import { VENUE_DETAILS_MOCK } from '../mocks/details-mocks';
import { FormBuilder } from '@angular/forms';
import { ValidationService } from '../../core/services/validation/validation.service';
import { Store } from '../../core/store/store';
import { PERFORMANCE_POSTS } from '../mocks/performance-mocks';
import { HttpClient } from '@angular/common/http';
import { FACEBOOK_DEFAULT_POST_TYPE } from '../../dashboard/schedule/publication/publication.constants';

export const VENUE_SERVICE_STUB = {
  fetchDetails(id) {
    return of({ venue: { public_id: '1'}});
  },
  updateDetails(id, newDetails) {
    return of({});
  },
  updateDetailsWithoutStoreUpdate(id, newDetails) {
    return of({venue: VENUE_DETAILS_MOCK});
  },
  uploadFile(file) {
    return of({});
  },
  fetchPerformancePosts() {
    return of(PERFORMANCE_POSTS);
  },
  fetchFiles() {
    return of({files: []});
  },
  updateFile() {},
  fetchFilesByTag() {
    return of({files: []});
  },
  deleteFile() {
    of({file: {id: 1}});
  },
  fetchPosts() {},
  deleteScheduledPost() {}
} as any;

export const TRACK_STUB = {
  detailsTabOpened() {},
  venueDetailsChanged() {},
  contentPoolOpened() {},
  fileDetailsUpdated() {},
  tagClicked() {},
  openedFile() {},
  fileRemoved() {},
  calendarOpened() {},
  searchApplied() {},
  loadChatHistory() {},
  openChat() {},
  userChangeStatus() {},
  logout() {},
  attachFile() {},
  chatOpenedFromPosts() {},
  filterPosts() {},
  addEvent() {},
  removeEvent() {},
} as any;

export const PERMISSION_SERVICE_STUB = {
  fetchPermissionsByVenue(id) {
    return of({});
  },
  fetchPermissions() {}
} as any;

export const PERFORMANCE_SERVICE_STUB = {
  selectedPerformanceSources: new BehaviorSubject([])
} as any;

export const CALENDAR_SERVICE_STUB = {
  fetchMyEventsMonthly( venueId, from, to, radius?, categories? ) {
    return of({});
  },
  fetchAllEvents(venueId, selected_date, radius?, categories?) {
    return of({});
  },
  getCalendarDataForMyEvents(venueId, year, month, radius?, categories?) {
    return of({});
  },
  getCalendarDataForAllEvents(venueId, year, month, radius?, categories?) {
    return of({});
  },
  addEvent( venueId, external_id, body) {
    return of({});
  },
  removeEvent(venueId, eventId) {
    return of({});
  },
  sliderValue: null,
} as any;

export const STORE_STUB = new Store();

export const UTILS_STUB = {
  showErrorModal() {},
} as any;

export const FORM_BUILDER_STUB = new FormBuilder();

export const VALIDATION_SERVICE_STUB = new ValidationService();

export const USER_SERVICE = {
  updateUser() { return of({}); },
  updateChatStatus() {},
  fetchCurrentUser() { return  of({}); }
} as any;

export const AUTH = {
  resetPass() { return of({}); },
  initPass() { return of({}); },
  logout() {},
  getFirebaseToken() {},
  loginToFirebase() {},
} as any;

export const ROUTER = {
  navigate: () => {},
} as any;

export const ROUTE = {
  data: of({}),
  queryParams: of({})
} as any;

export const SUBSCRIPTION_STUB = {
  unsubscribe() {},
};


export const FILES_SERVICE = {
  getPreSignedUrl() {},
  uploadFiles() {},
} as any;

export const CHAT_SERVICE = {
  uploadFile() { return of({}); },
  sendMessage() { return of({}); },
  getNotifications() {},
  fetchVenueChats() {},
  getPreSignedUrl() {},
  getChat() {
    return {
      valueChanges: function() {
        return of(
          [
            {
              payload: {
                val: function () {return {_user: 1, type: 'notification'}; },
              }
            }
          ]
        );
      },
      snapshotChanges: function () {
        return of(
          [
            {
              payload: {
                val: function () {return {_user: 1, type: 'notification'}; },
              }
            }
          ]
        );
      }
    };
  },
  setLastReadMessage() {},
  refreshChats() {},
  selectedChatId: 1,
  selectedChat: new BehaviorSubject(1),
  postId: new BehaviorSubject(1),
  participants: new BehaviorSubject(1),
} as any;

export const RENDERER_STUB = {
  setStyle() {},
  setAttribute() {},
} as any;

export const CHANGE_DETECTION = {
  detectChanges() {},
  markForCheck() {}
} as any ;

export const NOTIFICATIONS = {
  handleLogout() {},
  subscribeForPushNotifications() {},
} as any;

export const ELEMENT_REF = {
  nativeElement: {
    querySelector: function() {},
  }
} as any;

export const APPLICATION_REF = {} as any;

export const NETWORKS_SERVICE = {
  getConnectedChannels() {},
  connectChannels() {},
  removeChannel() {},
  getAuthOptions() {},
  reconnectChannel() {},
  getChanelsList() {},
} as any;

export const NETWORK_PROXY = {
  channelsList: new BehaviorSubject({list: [], network: 'facebook'}),
  reconnectStatus: new BehaviorSubject(true),
  connectChannels: function() {},
} as any;

export const PERMISSIONS = {
  fetchPermissionsByVenue() {},
} as any;

export const CLIPBOARD_SERVICE = {
  copyFromContent() {},
} as any;

export const HTTP = new HttpClient(null);

export const PUBLICATION_SERVICE = {
  getPreSignedUrl() {},
  createPost() {},
  editPost() {},
} as any;

export const PUBLICATION_PROXY_SERVICE = {
  description: null,
  albumFiles: null,
  albumName: null,
  file: null,
  mentions: null,
  selectedChannels: null,
  scrollToNewContentPoolFiles: new BehaviorSubject(true),
  network: new BehaviorSubject(''),
  contentFilesSearchText: new BehaviorSubject('text'),
  fbPostType: new BehaviorSubject(FACEBOOK_DEFAULT_POST_TYPE.title),
  contentFilesLoading: null,
  schedule: {timezone: null, utcTimestamp: null, error: false, dateForEdit: null},
  clearCurrentPost() {},
  clearCurrentFile() {},
  isScheduledPost() {},
  isVideo() {},
  isImage() {},
  isFbAlbumPost() {},
  isFbStatusPost() {},
  localFileUrl() {},
  isEmptyPost() {},
  descriptionValue() {},
  validDescription() {},
  isValidAlbumPost() {},
  validChannels() {},
  isInstagram() {},
  isFacebook() {},
  isTwitter() {},
  networkValue() {},
  checkPostData() {},
  getTimezoneDate() {},
  defaultImageUrl() {},
  getNetworkAvatarUrl() {},
  getNetworkChannelName() {},
  getNetworkChannelLink() {},
  setDateForPost() {},
} as any;

export const POST_ERROR_HANDLER_SERVICE = {
  fileSizeError: new BehaviorSubject(false),
  clearData() {},
  validateFile() {},
  validInputFile() {},
} as any;

export const CREATE_POST_SERVICE = {
  resetData() {},
  venueId: '1',
  startPostCreating() {},
  postCreated: new BehaviorSubject(undefined),
} as any;

export const LINKED_POST_SERVICE = {
  fetchLinks() {}

} as any;

export const LINKIFY_SERVICE = {
  find() {},
} as any;

export const MAT_LINK_PREVIEW_SERVICE = {
  onLinkFound: {emit() {}}

} as any;
