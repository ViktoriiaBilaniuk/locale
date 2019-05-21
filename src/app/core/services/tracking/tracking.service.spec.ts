import { TrackingSerivce } from './tracking.service';

describe('Tracking Serivce', () => {
  let service;
  (<any>window).ga = function() {};

  beforeEach(() => {
    service = new TrackingSerivce();
    (<any>window).ga = spyOn((<any>window), 'ga');
  });

  afterEach(() => {
    (<any>window).ga = undefined;
  });

  it ('should be created', () => {
    expect(service).toBeDefined();
  });
  it ('should track login event', () => {
    service.login('success');
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Login', 'Login success', 'Onsite', undefined ]
    ]);
  });

  it ('should track forgot password pressed event', () => {
    service.forgotPasswordPressed();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Links', 'Forgot Password Link Clicked', undefined, undefined ]
    ]);
  });

  it ('should track reset password event', () => {
    service.userResetPassword('success');
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Reset Password', 'Reset Password success', undefined, undefined ]
    ]);
  });

  it ('should track change of user status event', () => {
    service.userChangeStatus('active');
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Profile', 'Changed Status To active', undefined, undefined ]
    ]);
  });

  it ('should track open settings event', () => {
    service.settingsOpened();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Profile', 'Opened Settings Page', undefined, undefined ]
    ]);
  });

  it ('should track edit user profile data event', () => {
    service.userDataWasEdited(['email', 'name']);
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Profile', 'Profile email,name Was Edited', undefined, undefined ]
    ]);
  });


  it ('should track filter posts event', () => {
    service.filterPosts('date');
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Right Sidebar', 'Filtered Posts By date', undefined, undefined ]
    ]);
  });

  it ('should track search chat event', () => {
    service.searchChat();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Left Sidebar', 'Search For Chat', undefined, undefined ]
    ]);
  });

  it ('should track change password event', () => {
    service.changePassword();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Profile', 'Chaged Password', undefined, undefined ]
    ]);
  });

  it ('should track logout event', () => {
    service.logout();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Logout', 'Logout Success', undefined, undefined ]
    ]);
  });

  it ('should track open of contact us page event', () => {
    service.contactUsOpened();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Links', 'Contact Us Link Clicked', undefined, undefined ]
    ]);
  });

  it ('should track view post event', () => {
    service.viewPublishedPost();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Right Sidebar', 'View Social Performance Published Post', undefined, undefined ]
    ]);
  });

  it ('should track date filter on social performance tab event', () => {
    service.socialPerformanceDateFiltered();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Right Sidebar', 'Filtered Social Performance date', undefined, undefined ]
    ]);
  });

  it ('should track open of details tab event', () => {
    service.detailsTabOpened();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Right Sidebar', 'Opened Details Tab', undefined, undefined ]
    ]);
  });

  it ('should track view of chat attachment event', () => {
    service.viewChatAttachment();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Chat', 'Viewed Chat Attachment', undefined, undefined ]
    ]);
  });

  it ('should track view of chat attachment event', () => {
    service.sendChatMessage('text');
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Chat', 'Send Message', 'text', undefined ]
    ]);
  });

  it ('should track calendarOpened', () => {
    service.calendarOpened();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Calendar', 'Opened Calendar Page', undefined, undefined ]
    ]);
  });

  it ('should track myEventsOpened', () => {
    service.myEventsOpened();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Calendar', 'Opened MyEvents Tab', undefined, undefined ]
    ]);
  });


  it ('should track calendarSettingsOpened', () => {
    service.calendarSettingsOpened();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Calendar', 'Opened CalendarSettings Page', undefined, undefined ]
    ]);
  });

  it ('should track allEventsOpened', () => {
    service.allEventsOpened();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Calendar', 'Opened AllEvents Tab', undefined, undefined ]
    ]);
  });

  it ('should track addEvent', () => {
    service.addEvent(1);
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Calendar', 'Event Added', 1, undefined ]
    ]);
  });

  it ('should track removeEvent', () => {
    service.removeEvent(1);
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Calendar', 'Event Removed', 1, undefined ]
    ]);
  });

  it ('should track contentPoolOpened', () => {
    service.contentPoolOpened();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Content pool', 'Opened Content Pool Page', undefined, undefined ]
    ]);
  });

  it ('should track editFileClicked', () => {
    service.editFileClicked();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Content pool', 'Edit File Button Clicked', undefined, undefined ]
    ]);
  });

  it ('should track openedFile', () => {
    service.openedFile();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Content pool', 'File Opened', undefined, undefined ]
    ]);
  });


  it ('should track tagClicked', () => {
    service.tagClicked('tag');
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Content pool', 'Tag Clicked', 'tag', undefined ]
    ]);
  });


  it ('should track fileRemoved', () => {
    service.fileRemoved(1);
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Content pool', 'File Removed', 1, undefined ]
    ]);
  });

  it ('should track searchApplied', () => {
    service.searchApplied();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Content pool', 'Search Applied', undefined, undefined ]
    ]);
  });

  it ('should track fileDetailsUpdated', () => {
    service.fileDetailsUpdated();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Content pool', 'File Details Updated', undefined, undefined ]
    ]);
  });

  it ('should track openChat', () => {
    service.openChat(1);
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Chat', 'Chat opened', 1, undefined ]
    ]);
  });

  it ('should track attachFile', () => {
    service.attachFile();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Chat', 'File attached', undefined, undefined ]
    ]);
  });

  it ('should track loadChatHistory', () => {
    service.loadChatHistory(1);
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Chat', 'Load history', 1, undefined ]
    ]);
  });

  it ('should track viewChatAttachment', () => {
    service.viewChatAttachment();
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Chat', 'Viewed Chat Attachment', undefined, undefined ]
    ]);
  });

  it ('should track sendChatMessage', () => {
    service.sendChatMessage('type');
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Chat', 'Send Message', 'type', undefined ]
    ]);
  });

  it ('should track chatOpenedFromPosts', () => {
    service.chatOpenedFromPosts(1);
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Chat', 'Chat opened from posts', 1, undefined ]
    ]);
  });

  it ('should track venueDetailsChanged', () => {
    const editedFields = 'field';
    service.venueDetailsChanged(editedFields);
    expect((<any>window).ga.calls.allArgs()).toEqual([
      [ 'send', 'event', 'Details', `Details ${editedFields.toString()} Was Edited`, undefined, undefined ]
    ]);
  });

});
