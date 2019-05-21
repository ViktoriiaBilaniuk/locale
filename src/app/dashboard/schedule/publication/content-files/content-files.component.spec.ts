import { ContentFilesComponent } from './content-files.component';
import { PUBLICATION_PROXY_SERVICE, VENUE_SERVICE_STUB } from '../../../../test/stubs/service-stubs';
import { BehaviorSubject } from 'rxjs';

describe('ContentFilesComponent', () => {
  let component;
  const filterMock = new BehaviorSubject(1);
  let onScrollSpy, onSearchSpy;

  beforeEach(() => {
    component = new ContentFilesComponent(VENUE_SERVICE_STUB, PUBLICATION_PROXY_SERVICE);
    component.venueId = 1;
    component.filter = filterMock;
    component.filterSubscription = undefined;
    component.subscriptions = [];
    onScrollSpy = spyOn(component, 'onScroll');
    onSearchSpy = spyOn(component, 'onSearch');
  });

  describe('ngOnInit', () => {

    it ('should call onScroll', () => {
      component.ngOnInit();
      expect(onScrollSpy).toHaveBeenCalled();
    });

    it ('should call onSearch', () => {
      component.ngOnInit();
      expect(onSearchSpy).toHaveBeenCalled();
    });

    it ('should set contentFilesLoading to true', () => {
      component.ngOnInit();
      expect(PUBLICATION_PROXY_SERVICE.contentFilesLoading).toBeTruthy();
    });

    it ('should set searchValue to empty string', () => {
      component.ngOnInit();
      expect(component.searchValue).toEqual('');
    });

    it ('should set skipNumber to 0', () => {
      component.ngOnInit();
      expect(component.skipNumber).toEqual(0);
    });

    it ('should set files to empty array', () => {
      component.ngOnInit();
      expect(component.files).toEqual([]);
    });

    it ('should setup filter', () => {
      component.ngOnInit();
      expect(component.filter.getValue()).toEqual(component.searchValue);
    });
  });

  describe('getFiles', () => {
    it ('should set files with existing files array', () => {
      component.files = [0];
      component.skipNumber = 1;
      component.ngOnInit();
      expect(component.files).toEqual([]);
    });

    it ('should set files', () => {
      component.files = [0];
      component.skipNumber = undefined;
      component.ngOnInit();
      expect(component.files).toEqual([]);
    });

    it ('should set scrollToNewFiles to false', () => {
      component.numberItemsToLoad = 3;
      component.ngOnInit();
      expect(component.scrollToNewFiles).toBeFalsy();
    });

    it ('should set filesLoading to false', () => {
      component.numberItemsToLoad = 1;
      component.ngOnInit();
      expect(component.filesLoading).toBeFalsy();
    });
  });

  it ('should call onSearch', () => {
    component.ngOnChanges({scrollToNewFiles: true});
    expect(onScrollSpy).toHaveBeenCalled();
  });

  it ('should return true', () => {
    component.numberItemsToLoad = 2;
    expect(component.hasFiles(1)).toBeTruthy();
  });
});
