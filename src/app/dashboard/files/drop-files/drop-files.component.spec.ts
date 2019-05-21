import { DropFilesComponent } from './drop-files.component';
import { CHAT_SERVICE, FILES_SERVICE, UTILS_STUB } from '../../../test/stubs/service-stubs';
import { of } from 'rxjs/index';
import { EXPANDED_CHAT_MOCK } from '../../../test/mocks/chats-mocks';

describe('DropFilesComponent', () => {

  let component;
  const fileServiceStub = FILES_SERVICE;
  const chatServiceStub = CHAT_SERVICE;
  const utilsStub = UTILS_STUB;
  const fileMock = {
    type: 'image'
  };
  const eMock = {
    preventDefault: function() {} as any,
    dataTransfer: {
      files: [fileMock]
    }
  };

  beforeEach(() => {
    component = new DropFilesComponent(fileServiceStub, chatServiceStub, utilsStub);
  });

  describe('ngOnChanges', () => {
    const changesMock = {
      filesUploaddedOnClick: [fileMock],
    };

    beforeEach(() => {
      component.filesUploaddedOnClick = [fileMock];
      component.files = [fileMock];
      component.errorMess = [];
    });

    it ('should define files', () => {
      component.ngOnChanges(changesMock);
      expect(component.files).toBeDefined();
    });

    it ('should call showDragWrapper method', () => {
      const showDragWrapperSpy = spyOn(component, 'showDragWrapper');
      component.ngOnChanges(changesMock);
      expect(showDragWrapperSpy).toHaveBeenCalled();
    });

    it ('should call validation method', () => {
      const validationSpy = spyOn(component, 'validation');
      component.ngOnChanges(changesMock);
      expect(validationSpy).toHaveBeenCalled();
    });
  });

  describe('drop', () => {

    it ('should call reset method', () => {
      const resetSpy = spyOn(component, 'reset');
      component.drop(eMock);
      expect(resetSpy).toHaveBeenCalled();
    });

    it ('should define files', () => {
      component.drop(eMock);
      expect(component.files).toBeDefined();
    });

    it ('should call validation method', () => {
      const validationSpy = spyOn(component, 'validation');
      component.drop(eMock);
      expect(validationSpy).toHaveBeenCalled();
    });
  });

  describe('validation', () => {
    const errorMessMock = ['1'];

    beforeEach(() => {
      component.errorMess = errorMessMock;
      spyOn(CHAT_SERVICE, 'uploadFile').and.returnValue(of({}));
      component.chat = EXPANDED_CHAT_MOCK;
    });

    it('should call showErrorModal method in utils service', () => {
      const showErrorModalSpy = spyOn(utilsStub, 'showErrorModal');
      component.validation();
      expect(showErrorModalSpy).toHaveBeenCalled();
    });

    it('should call hideDragWrapper', () => {
      const hideDragWrapperSpy = spyOn(component, 'hideDragWrapper');
      component.validation();
      expect(hideDragWrapperSpy).toHaveBeenCalled();
    });

    it('should call getPreSignedUrls', () => {
      const getPreSignedUrlsSpy = spyOn(component, 'getPreSignedUrls');
      spyOn(FILES_SERVICE, 'uploadFiles').and.returnValue(of({}));
      component.errorMess = [];
      component.validation();
      expect(getPreSignedUrlsSpy).toHaveBeenCalled();
    });
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

  it ('should return generalErrorMessage', () => {
    component.errorMess = ['1'];
    expect(component.generalErrorMessage).toEqual('1<br>');
  });

  describe('getPreSignedUrls', () => {

    beforeEach(() => {
      component.files = [{
        name: 'name',
        type: 'image',
        lastModified: '1'
      }];
      component.toasts = [];
      component.subscriptions = [];
      component.preSignedUrls = [];
      spyOn(fileServiceStub, 'getPreSignedUrl').and.returnValue(of({data: 1}));
    });

    it ('should add toast', () => {
      component.getPreSignedUrls();
      expect(component.toasts.length).toEqual(1);
    });

    it ('should add preSignedUrls', () => {
      component.getPreSignedUrls();
      expect(component.preSignedUrls.length).toEqual(1);
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

/*  describe('filesToUpload', () => {
    const uploadMock = [{
      type: 'file',
      name: 'name',
      url: '1'
    }];

    beforeEach(() => {
      component.preSignedUrls = [{file_url: '1'}];
      component.files = [{
        name: 'name',
        type: 'image',
        lastModified: '1'
      }];
    });

    it ('should return files to upload', () => {
      expect(component.filesToUpload).toEqual(uploadMock);
    });
  });*/

  describe('onUploadOutput', () => {
    let showDragWrapperSpy, hideDragWrapperSpy;

    beforeEach(() => {
      showDragWrapperSpy = spyOn(component, 'showDragWrapper');
      hideDragWrapperSpy = spyOn(component, 'hideDragWrapper');
    });

    it ('should call showDragWrapper', () => {
      const outputMock = {type: 'dragOver'};
      component.onUploadOutput(outputMock);
      expect(showDragWrapperSpy).toHaveBeenCalled();
    });

    it ('should call hideDragWrapper', () => {
      const outputMock = {type: 'dragOut'};
      component.onUploadOutput(outputMock);
      expect(hideDragWrapperSpy).toHaveBeenCalled();
    });

  });

  it('should return error message', () => {
    const fileMockNew = {name: 'file', type: 'image'};
    const errorMessMock = 'The file size' + ' (' + fileMockNew.name + ') ' + 'cannot exceed 5 MB.';
    expect(component.getErrorMessage(fileMockNew)).toEqual(errorMessMock);
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

    it ('should remove preSignedUrl', () => {
      component.cancelUpload(1);
      expect(component.preSignedUrls.length).toEqual(generalLength - 1);
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

