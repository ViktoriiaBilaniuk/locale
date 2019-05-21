import { FilesComponent } from './files.component';
import { TRACK_STUB, UTILS_STUB, VENUE_SERVICE_STUB } from '../../test/stubs/service-stubs';
import { Store } from '../../core/store/store';
import { VENUE_DETAILS_MOCK } from '../../test/mocks/details-mocks';
import { of } from 'rxjs/index';

describe('FilesComponent', () => {

  let component;
  const venueServiceStub = VENUE_SERVICE_STUB;
  const storeStub = new Store();
  const trackStub = TRACK_STUB;
  const utilsStub = UTILS_STUB;
  const venueDetailsMock = VENUE_DETAILS_MOCK;
  const filesDataMock = {
    files: []
  };
  const fileDataMock = {
    file: []
  };
  const fileToDeleteMock = {
    file: {id: 1}
  };
  const filesMock = [1, 2];
  const fileMock = {
    id: 1,
    index: 0,
    name: 'name',
    tags: ['tag']
  };
  const filterMock = {
    value: 1,
    next: function () {} as any
  };

  beforeEach(() => {
    component = new FilesComponent(venueServiceStub, storeStub, trackStub, utilsStub);
    component.venueFilesSubscriptions = undefined;
    component.venueFilesSubscriptions = [];
    component.venueId = 1;
    component.filter = filterMock;
  });

  describe('ngOnInit', () => {

    beforeEach(() => {
      storeStub.set('venue-details', venueDetailsMock);
    });

    it ('should init venueFilesSubscriptions', () => {
      component.ngOnInit();
      expect(component.venueFilesSubscriptions).toBeDefined();
    });

    it ('should call contentPoolOpened in track service', () => {
      const contentPoolOpenedSpy = spyOn(trackStub, 'contentPoolOpened');
      component.ngOnInit();
      expect(contentPoolOpenedSpy).toHaveBeenCalled();
    });

    it ('should set filesLoading to true', () => {
      component.ngOnInit();
      expect(component.filesLoading).toBeTruthy();
    });

    it ('should call select method for venue details', () => {
      const storeSelectSpy = spyOn(storeStub, 'select').and.returnValue(of(venueDetailsMock));
      component.ngOnInit();
      expect(storeSelectSpy).toHaveBeenCalledWith('venue-details');
    });

    it ('should define venueId', () => {
      component.venueId = undefined;
      component.ngOnInit();
      expect(component.venueId).toBeDefined();
    });

    it ('should set searchValue to empty string', () => {
      component.searchValue = undefined;
      component.ngOnInit();
      expect(component.searchValue).toEqual('');
    });

    it ('should set searchByTag to false', () => {
      component.searchByTag = undefined;
      component.ngOnInit();
      expect(component.searchByTag).toBeFalsy();
    });

    it ('should set skipNumber to zero', () => {
      component.skipNumber = undefined;
      component.ngOnInit();
      expect(component.skipNumber).toEqual(0);
    });

    it ('should set files to empty array', () => {
      component.files = undefined;
      component.ngOnInit();
      expect(component.files).toEqual([]);
    });
  });

  it ('should call fetchFiles method', () => {
    const fetchFilesSpy = spyOn(venueServiceStub, 'fetchFiles').and.returnValue(of(filesDataMock));
    component.fetchFiles(1);
    expect(fetchFilesSpy).toHaveBeenCalled();
  });

  describe('getFiles', () => {
    it ('should set files with existing files array', () => {
      component.files = [0];
      component.skipNumber = 1;
      component.getFiles(filesMock);
      expect(component.files).toEqual([0, 1, 2]);
    });

    it ('should set files', () => {
      component.files = [0];
      component.skipNumber = undefined;
      component.getFiles(filesMock);
      expect(component.files).toEqual([1, 2]);
    });

    it ('should set scrollToNewFiles to false', () => {
      component.numberItemsToLoad = 3;
      component.getFiles(filesMock);
      expect(component.scrollToNewFiles).toBeFalsy();
    });

    it ('should set filesLoading to false', () => {
      component.numberItemsToLoad = 1;
      component.getFiles(filesMock);
      expect(component.filesLoading).toBeFalsy();
    });
  });

  it ('should return true in hasFiles', () => {
    component.numberItemsToLoad = 3;
    expect(component.hasFiles(1)).toBeTruthy();
  });

  describe('updateFile', () => {
    let updateFileSpy;

    beforeEach(() => {
      updateFileSpy = spyOn(venueServiceStub, 'updateFile').and.returnValue(of(fileDataMock));
      component.files = [];
    });

    it ('should call updateFile method in updateFile', () => {
      component.updateFile(fileMock);
      expect(updateFileSpy).toHaveBeenCalled();
    });

    it ('should init updatedFile', () => {
      component.updateFile(fileMock);
      expect(component.updatedFile).toEqual([]);
    });

    it ('should set file by index', () => {
      component.updateFile(fileMock);
      expect(component.files[0]).toEqual([]);
    });
  });

  describe('tests with tag', () => {

    let tagMock, fetchFilesByTagSpy;

    beforeEach(() => {
      tagMock = {name: 'name'};
      component.searchValue = '';
      component.searchByTag = false;
      fetchFilesByTagSpy = spyOn(venueServiceStub, 'fetchFilesByTag').and.returnValue(of(filesDataMock));
    });

    it ('should set searchValue into tag name', () => {
      component.onTagClick(tagMock);
      expect(component.searchValue).toEqual('name');
    });

    it ('should set searchByTag to true', () => {
      component.onTagClick(tagMock);
      expect(component.searchByTag).toBeTruthy();
    });
  });

  it ('should set searchValue on search', () => {
    const searchText = 'search';
    component.onSearch(searchText);
    expect(component.searchValue).toEqual(searchText);
  });

  describe('confirm modal logic', () => {
    it ('should set visibleConfirmWindow to true', () => {
      component.openConfirmModal(1);
      expect(component.visibleConfirmWindow).toBeTruthy();
    });

    it ('should set fileIdForRemove', () => {
      component.openConfirmModal(1);
      expect(component.fileIdForRemove).toEqual(1);
    });

    it ('should set visibleConfirmWindow to false', () => {
      component.closeConfirmModal();
      expect(component.visibleConfirmWindow).toBeFalsy();
    });
  });

  it('should call deleteFile', () => {
    const deleteFileSpy = spyOn(venueServiceStub, 'deleteFile').and.returnValue(of(fileToDeleteMock));
    component.deleteFile();
    expect(deleteFileSpy).toHaveBeenCalled();
  });

  it ('should return true in noFiles', () => {
    component.filter = 1;
    expect(component.noFiles).toBeTruthy();
  });

  describe('onFinishUpload', () => {

    it ('should set skipNumber to 0', () => {
      component.onFinishUpload('');
      expect(component.skipNumber).toEqual(0);
    });

    it ('should set filesLoading to false', () => {
      component.onFinishUpload('');
      expect(component.filesLoading).toBeFalsy();
    });
  });

  it ('should set filesUploaddedOnClick', () => {
    const files = [1];
    component.onUploadClick(files);
    expect(component.filesUploaddedOnClick).toEqual(files);
  });

  it ('should set drag', () => {
    const eventMock = 1;
    component.onDrag(eventMock);
    expect(component.drag).toEqual(eventMock);
  });

});
