import { PostErrorsHandlerService } from './post-errors-handler.service';
import { PUBLICATION_PROXY_SERVICE } from '../../../test/stubs/service-stubs';
import { BehaviorSubject } from 'rxjs';
import { FACEBOOK_MAX_IMAGE_SIZE } from '../../../dashboard/schedule/publication/publication.constants';

describe('PostErrorsHandlerService', () => {
  let service;
  const emptyBehaviorSubject = new BehaviorSubject(null as any);

  beforeEach(() => {
    service = new PostErrorsHandlerService(PUBLICATION_PROXY_SERVICE);
  });

  describe('clearData', () => {

    it('should set network to null', () => {
      service.clearData();
      expect(service.network).toBeNull();
    });

    it('should set fileDurationError to empty BehaviorSubject', () => {
      service.clearData();
      expect(service.fileDurationError).toEqual(emptyBehaviorSubject);
    });

    it('should set fileSizeError to empty BehaviorSubject', () => {
      service.clearData();
      expect(service.fileSizeError).toEqual(emptyBehaviorSubject);
    });

    it('should set fileErrorMess to null', () => {
      service.clearData();
      expect(service.fileErrorMess).toBeNull();
    });

    it('should set maxFileLimit to null', () => {
      service.clearData();
      expect(service.maxFileLimit).toBeNull();
    });

    it('should set fileSize to null', () => {
      service.clearData();
      expect(service.fileSize).toBeNull();
    });

    it('should set fileType to null', () => {
      service.clearData();
      expect(service.fileType).toBeNull();
    });
  });

  describe('validInputFile', () => {
    const fileMock = {size: 11000000, type: 'image'};
    const networkMock = 'facebook';

    beforeEach(() => {
      service.network = 'facebook';
    });

    it('should define network', () => {
      service.validInputFile(fileMock, networkMock);
      expect(service.network).toBeDefined();
    });

    it('should return false', () => {
      expect(service.validInputFile(fileMock, networkMock)).toBeFalsy();
    });

    it('should set true as next value for fileSizeError', () => {
      service.validInputFile(fileMock, networkMock);
      expect(service.fileSizeError.getValue()).toBeTruthy();
    });

    it('should set fileErrorMess', () => {
      service.validInputFile(fileMock, networkMock);
      expect(service.fileErrorMess).toEqual('Channels.imageError');
    });

    it('should set maxFileLimit', () => {
      service.validInputFile(fileMock, networkMock);
      expect(service.maxFileLimit).toEqual(FACEBOOK_MAX_IMAGE_SIZE + 'MB');
    });
  });

  describe('validateVideoDuration', () => {

    beforeEach(() => {
      service.fileDurationError = emptyBehaviorSubject;
    });

    it('should set false as next value for fileDurationError', () => {
      service.validateVideoDuration(11);
      expect(service.fileDurationError.getValue()).toBeFalsy();
    });

    it('should set true as next value for fileDurationError', () => {
      service.validateVideoDuration(11000000);
      expect(service.fileDurationError.getValue()).toBeTruthy();
    });

    it('should set fileErrorMess', () => {
      service.validateVideoDuration(11000000);
      expect(service.fileErrorMess).toEqual('Channels.videoDurationShouldBeLessThan');
    });

    it('should call clearCurrentFile', () => {
      const clearCurrentFileSpy = spyOn(PUBLICATION_PROXY_SERVICE, 'clearCurrentFile');
      service.validateVideoDuration(11000000);
      expect(clearCurrentFileSpy).toHaveBeenCalled();
    });
  });

  describe('setFileInfo', () => {
    const size = 11000000;
    const type = 'image';

    it('should set fileSize', () => {
      service.setFileInfo(size, type);
      expect(service.fileSize).toEqual(size / 1000 / 1000);
    });

    it('should set fileType', () => {
      service.setFileInfo(size, type);
      expect(service.fileType).toEqual(type);
    });
  });

});
