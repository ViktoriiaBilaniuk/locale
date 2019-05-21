import { PostDetailsComponent } from './post-details.component';
import { POST_MOCK } from '../../../../test/mocks/schedule-mocks';
import * as moment from 'moment';
import { LINKED_POST_SERVICE, MAT_LINK_PREVIEW_SERVICE } from '../../../../test/stubs/service-stubs';

describe('PostDetailsComponent', () => {
  let component;

  beforeEach(() => {
    component = new PostDetailsComponent(LINKED_POST_SERVICE, MAT_LINK_PREVIEW_SERVICE);
    component.post = POST_MOCK;
  });

  describe('checkPostDate', () => {

    it ('should set showWarning to true', () => {
      component.ngOnInit();
      expect(component.showWarning).toBeTruthy();
    });

    it ('should set canOpenChat to false', () => {
      component.ngOnInit();
      expect(component.canOpenChat).toBeFalsy();
    });
  });

  it ('should return media', () => {
    expect(component.media).toEqual([{ url: 'image', type: 'picture' }]);
  });

  it ('should return date', () => {
    const dateMock = moment(POST_MOCK.date).format('Do') + ' ' + moment(POST_MOCK.date).format('MMM').toUpperCase();
    expect(component.getDate()).toEqual(dateMock);
  });

  it ('should return time', () => {
    const timeMock = moment(POST_MOCK.date).format('HH:mm');
    expect(component.getTime()).toEqual(timeMock);
  });

  describe('getPostStatus', () => {
    it ('should return status', () => {
      expect(component.getPostStatus('status')).toEqual('status');
    });

    it ('should return error status', () => {
      expect(component.getPostStatus('publish_error')).toEqual('Error');
    });

  });

  it ('should return post timezone text', () => {
    component.post.timezone = null;
    expect(component.getPostTimezoneText()).toEqual('Local Time');
  });

  it ('should return true from isErrorPost', () => {
    component.post.status = 'publish_error';
    expect(component.isErrorPost()).toBeTruthy();
  });

  it ('should return post error message', () => {
    spyOn(component, 'isErrorPost').and.returnValue(true);
    component.post.error_message = 'error_message';
    expect(component.getErrorMessage()).toEqual('error_message');
  });

  it ('should emit links', () => {
    const emitSpy = spyOn(MAT_LINK_PREVIEW_SERVICE.onLinkFound, 'emit');
    component.fetchSitePreview();
    expect(emitSpy).toHaveBeenCalled();
  });
});
