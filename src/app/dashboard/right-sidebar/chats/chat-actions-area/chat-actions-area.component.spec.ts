import { ChatActionsAreaComponent } from './chat-actions-area.component';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { CHAT_SERVICE, FILES_SERVICE, RENDERER_STUB, TRACK_STUB } from '../../../../test/stubs/service-stubs';
import { of } from 'rxjs';
import { EXPANDED_CHAT_MOCK } from '../../../../test/mocks/chats-mocks';

describe('ChatActionsAreaComponent', () => {

  let component;
  const utils = new UtilsService();
  const filesMock = [{name: '1', lastModified: 1, type: 'image', size: 5}];

  beforeEach(() => {
    component = new ChatActionsAreaComponent(utils, RENDERER_STUB, TRACK_STUB, CHAT_SERVICE);
  });

  describe('reset', () => {

    beforeEach(() => {
      component.message = {
        nativeElement: { value: '1'}
      };
    });

    it ('should reset files', () => {
      component.reset();
      expect(component.files).toEqual([]);
    });

    it ('should reset toasts', () => {
      component.reset();
      expect(component.toasts).toEqual([]);
    });

    it ('should reset errorMess', () => {
      component.reset();
      expect(component.errorMess).toEqual([]);
    });

    it ('should reset uploadSubscriptions', () => {
      component.reset();
      expect(component.uploadSubscriptions).toEqual([]);
    });

    it ('should reset message', () => {
      component.reset();
      expect(component.message.nativeElement.value).toEqual('');
    });

  });

  describe('fileChange', () => {

    const eventMock = {
      target: {
        files: filesMock
      }
    };
    let getPreSignedUrlSpy;
    const preSignedDataMock = {data: {file_url: 'file_url', signed_request: 'signed_request' }};

    beforeEach(() => {
      component.errorMess = [];
      component.fileInput = component.message = {
        nativeElement: { value: '1'}
      };
      getPreSignedUrlSpy = spyOn(CHAT_SERVICE, 'getPreSignedUrl').and.returnValue(of(preSignedDataMock));
      component.chat = {venue_chat_model_id: {_id: 1}};
    });

    it ('should init files', () => {
      component.fileChange(eventMock);
      expect(component.files).toBeDefined();
    });

    it ('should add toast for each file', () => {
      component.fileChange(eventMock);
      expect(component.toasts.length).toEqual(1);
    });

    it ('should call getPreSignedUrl', () => {
      component.fileChange(eventMock);
      expect(getPreSignedUrlSpy).toHaveBeenCalled();
    });

    it ('should clear file', () => {
      component.fileChange(eventMock);
      expect(component.fileInput.nativeElement.value).toEqual('');
    });

  });

  describe('putFile', () => {
    beforeEach(() => {
      component.files = filesMock;
      component.uploadSubscriptions = [];
      component.preSignedUrls = [{data: {file_url: 'url', signed_request: 'url'}}];
      component.chat = EXPANDED_CHAT_MOCK;
      spyOn(CHAT_SERVICE, 'uploadFile').and.returnValue(of({}));
      spyOn(FILES_SERVICE, 'uploadFiles').and.returnValue(of({}));
    });

    it ('should call putFile for each file', () => {
      const putFileSpy = spyOn(component, 'putFile');
      component.uploadFiles();
      expect(putFileSpy).toHaveBeenCalledTimes(filesMock.length);
    });

    it ('should add uploadSubscriptions', () => {
      component.uploadFiles();
      expect(component.uploadSubscriptions.length).toEqual(1);
    });

  });

  it ('should return toast', () => {
    const toastMock = {
      show: '1',
      text: '2',
      fileId: '3'
    };
    expect(component.getNewToast('1', '2', '3')).toEqual(toastMock);
  });

  it ('should return truncated text', () => {
    const stringArray = [
      {init: '1234567890', result: '1...0'},
      {init: '12345', result: '12345'},
    ];
    stringArray.forEach((item) => {
      expect(component.truncate(item.init, 5)).toEqual(item.result);
    });
  });

  it ('should return errorMessage', () => {
    component.errorMess = ['1', '2'];
    expect(component.generalErrorMessage).toEqual('1' + '\n' + '2' + '\n');
  });

  describe('sendMessage', () => {

    const message = 'mess';

    beforeEach(() => {
      component.message = {
        nativeElement: {
          value: ''
        }
      };
      component.chat = { venue_chat_model_id: {_id: 1} };
      component.preSignedUrls = [{data: {file_url: 'url', signed_request: 'url'}}];
    });

    it ('should call sendMessage', () => {
      const sendMessageSpy = spyOn(CHAT_SERVICE, 'sendMessage').and.returnValue(of({}));
      component.sendMessage(message);
      expect(sendMessageSpy).toHaveBeenCalled();
    });

    it ('should call setStyle', () => {
      const setStyleSpy = spyOn(RENDERER_STUB, 'setStyle').and.returnValue(of({}));
      spyOn(CHAT_SERVICE, 'sendMessage').and.returnValue(of({}));
      component.sendMessage(message);
      expect(setStyleSpy).toHaveBeenCalled();
    });

  });

  describe('cancelUpload', () => {
    const arrayMock = [1, 2];
    const subscriptionMock = {unsubscribe: function() {} as any};
    const subscriptionArrayMock = [subscriptionMock, subscriptionMock];
    const generalLength = arrayMock.length;

    beforeEach(() => {
      component.files = component.preSignedUrls = component.toasts = arrayMock;
      component.uploadSubscriptions = subscriptionArrayMock;
    });

    it ('should remove file', () => {
      component.cancelUpload(1);
      expect(component.files.length).toEqual(generalLength - 1);
    });

    it ('should remove toast', () => {
      component.cancelUpload(1);
      expect(component.toasts.length).toEqual(generalLength - 1);
    });

    it ('should unsubscribe from current uploadSubscription', () => {
      const unsubscribeSpy = spyOn(subscriptionMock, 'unsubscribe');
      component.cancelUpload(1);
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });

});
