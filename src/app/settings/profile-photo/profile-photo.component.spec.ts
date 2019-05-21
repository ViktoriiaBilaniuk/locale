import { ProfilePhotoComponent } from './profile-photo.component';
import { Store } from '../../core/store/store';
import { of } from 'rxjs/index';

describe('ProfilePhotoComponent', () => {
  let component;
  const utilsServiceStub = {
    showInfoModal: function() {} as any,
  } as any;
  const trackStub = {
    userDataWasEdited: function() {} as any,
  } as any;
  const userServiceStub = {
    getPreSignedUrl: function() {} as any,
    uploadProfilePhoto: function() {} as any,
    updateUser: function() {return of(); } as any,
  } as any;
  const store = new Store();
  const file = {
    size: 500,
    type: 'image/png'
  } as any;
  const fileRes = {file_name: file.name, file_type: file.type};
  const files = [file as Blob];
  const fileInput = {
    nativeElement: {
      files: files
    }
  };
  const preSignedRes =  {data: {file_url: '', signed_request: ''}};
  let getPreSignedUrlSpy, uploadProfilePhotoSpy, userDataWasEditedSpy;

  beforeEach(() => {
    component = new ProfilePhotoComponent(store, userServiceStub, utilsServiceStub, trackStub);
    component.fileInput = fileInput;
    getPreSignedUrlSpy = spyOn(userServiceStub, 'getPreSignedUrl').and.returnValue(of(preSignedRes));
    uploadProfilePhotoSpy = spyOn(userServiceStub, 'uploadProfilePhoto').and.returnValue(of(fileRes));
    userDataWasEditedSpy = spyOn(trackStub, 'userDataWasEdited').and.returnValue(of(fileRes));
  });

  it ('should fetch user on init', () => {
    const spy2 = spyOn(store, 'select').and.returnValue(of({ image: 'test'}));
    component.ngOnInit();
    expect(spy2).toHaveBeenCalled();
    expect(component.avatarUrl).toBe('test');
  });

  it ('should init', () => {
    const spy2 = spyOn(store, 'select').and.returnValue(of({ image: 'test'}));
    component.ngOnInit();
    expect(spy2).toHaveBeenCalled();
    expect(component.avatarUrl).toBe('test');
  });

  it ('should return file', () => {
    expect(component.file).toEqual(file);
  });

  it ('should check valid state', () => {
    expect(component.isValid).toBeTruthy();
  });

  it ('should check size', () => {
    expect(component.validSize).toBeTruthy();
  });

  it ('should check type', () => {
    expect(component.validType).toBeTruthy();
  });

  it ('should call userDataWasEdited', () => {
    const readFileSpy = spyOn(component, 'readFile');
    component.fileChange();
    expect(userDataWasEditedSpy).toHaveBeenCalledWith(['avatar']);
  });

  it ('should upload file', () => {
    component.uploadFile();
    expect(getPreSignedUrlSpy).toHaveBeenCalledWith(fileRes);
  });

  it ('should post file', () => {
    component.postFile(preSignedRes);
    expect(uploadProfilePhotoSpy).toHaveBeenCalledWith('', file);
  });

  it ('should set cover image', () => {
    component.setCoverImage('src');
    expect(component.localImageStyle).toBeDefined();
    expect(component.showLocalCover).toBeTruthy();
  });

  it ('should clear file', () => {
    component.clearFile();
    expect(component.fileInput.nativeElement.value).toEqual('');
  });

  it ('should show info modal', () => {
    const showInfoModalSpy = spyOn(utilsServiceStub, 'showInfoModal');
    component.showModal();
    expect(showInfoModalSpy).toHaveBeenCalled();
  });
});
