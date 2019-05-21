import { Injectable } from '@angular/core';
import {CONSTANTS} from '../../constants';
declare const ga: any;

@Injectable()
export class TrackingSerivce {
  constructor() {
    ga('create', CONSTANTS.GA_ID,  'auto');
    ga('send', 'pageview');
  }

  public login(status) {
    this.sendEvent('Login', `Login ${status}`, 'Onsite');
  }
  public forgotPasswordPressed() {
    this.sendEvent('Links', 'Forgot Password Link Clicked');
  }
  public userResetPassword(status) {
    this.sendEvent('Reset Password', `Reset Password ${status}`);
  }
  public userChangeStatus(status) {
    this.sendEvent('Profile', `Changed Status To ${status}`);
  }
  public settingsOpened() {
    this.sendEvent('Profile', 'Opened Settings Page');
  }
  public userDataWasEdited(editedFields: string[]) {
    this.sendEvent('Profile', `Profile ${editedFields.toString()} Was Edited`);
  }
  public filterPosts(filterType) {
    this.sendEvent('Right Sidebar', `Filtered Posts By ${filterType}`);
  }
  public searchMessage() {
    this.sendEvent('Right Sidebar', 'Search for message');
  }
  public searchChat() {
    this.sendEvent('Left Sidebar', 'Search For Chat');
  }
  public changePassword() {
    this.sendEvent('Profile', 'Chaged Password');
  }
  public logout() {
    this.sendEvent('Logout', 'Logout Success');
  }
  public contactUsOpened() {
    this.sendEvent('Links', 'Contact Us Link Clicked');
  }
  public viewPublishedPost() {
    this.sendEvent('Right Sidebar', 'View Social Performance Published Post');
  }
  public socialPerformanceDateFiltered() {
    this.sendEvent('Right Sidebar', 'Filtered Social Performance date');
  }
  public detailsTabOpened() {
    this.sendEvent('Right Sidebar', 'Opened Details Tab');
  }

  /* start calendar tracking */

  public calendarOpened() {
    this.sendEvent('Calendar', 'Opened Calendar Page');
  }
  public myEventsOpened() {
    this.sendEvent('Calendar', 'Opened MyEvents Tab');
  }
  public allEventsOpened() {
    this.sendEvent('Calendar', 'Opened AllEvents Tab');
  }
  public calendarSettingsOpened() {
    this.sendEvent('Calendar', 'Opened CalendarSettings Page');
  }
  public addEvent(eventId) {
    this.sendEvent('Calendar', 'Event Added', eventId);
  }
  public removeEvent(eventId) {
    this.sendEvent('Calendar', 'Event Removed', eventId);
  }

  /* end calendar tracking */

  /* start content pool tracking */

  public contentPoolOpened() {
    this.sendEvent('Content pool', 'Opened Content Pool Page');
  }
  public editFileClicked() {
    this.sendEvent('Content pool', 'Edit File Button Clicked');
  }
  public openedFile() {
    this.sendEvent('Content pool', 'File Opened');
  }
  public tagClicked(tag) {
    this.sendEvent('Content pool', 'Tag Clicked', tag);
  }
  public fileRemoved(fileId) {
    this.sendEvent('Content pool', 'File Removed', fileId);
  }
  public searchApplied() {
    this.sendEvent('Content pool', 'Search Applied');
  }
  public fileDetailsUpdated() {
    this.sendEvent('Content pool', 'File Details Updated');
  }
  /* end content pool tracking */


  /* start content pool tracking */

  /* end content pool tracking */

  public openChat(chatId) {
    this.sendEvent('Chat', 'Chat opened', chatId);
  }

  public attachFile() {
    this.sendEvent('Chat', 'File attached');
  }

  public loadChatHistory(chatId) {
    this.sendEvent('Chat', 'Load history', chatId);
  }

  public viewChatAttachment() {
    this.sendEvent('Chat', 'Viewed Chat Attachment');
  }
  public sendChatMessage(messageType) {
    this.sendEvent('Chat', 'Send Message', messageType);
  }

  public chatOpenedFromPosts(chatId) {
    this.sendEvent('Chat', 'Chat opened from posts', chatId);
  }

  /* start details tracking */

  public venueDetailsChanged(editedFields) {
    this.sendEvent('Details', `Details ${editedFields.toString()} Was Edited`);
  }

  /* end details tracking */

  /**
   * @description
   * Send GA event to track
   *
   * @param category Typically the object that was interacted with (e.g. 'Video')
   * @param action The type of interaction (e.g. 'play')
   * @param label Useful for categorizing events (e.g. 'Fall Campaign')
   * @param value A numeric value associated with the event (e.g. 42)
   *
   * @memberof TrackingService
   */
  private sendEvent(category: string, action: string, label?: string, value?: number) {
    ga('send', 'event', category, action, label, value);
  }
}
