import { RightSidebarSearchComponent } from './right-sidebar-search.component';
import { STORE_STUB, TRACK_STUB } from '../../../test/stubs/service-stubs';

describe('RightSidebarSearchComponent', () => {
  let component;
  const trackStub = TRACK_STUB;
  const searchInputMock = {
    nativeElement: {
      focus: function() {},
      value: 'value'
    }
  };

  beforeEach(() => {
    component = new RightSidebarSearchComponent(trackStub, STORE_STUB);
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      component.searchInput = searchInputMock;
    });

    it ('should set searchInput value', () => {
      component.searchValue = 'searchValue';
      component.ngOnChanges();
      expect(searchInputMock.nativeElement.value).toEqual('searchValue');
    });
  });

  describe('search', () => {

    beforeEach(() => {
      component.onSearch = {
        emit: function() {}
      };
    });

    it ('should emit search value', () => {
      const onSearchSpy = spyOn(component.onSearch, 'emit');
      component.search('text');
      expect(onSearchSpy).toHaveBeenCalledWith('text');
    });

    it ('should call searchApplied', () => {
      const searchAppliedSpy = spyOn(trackStub, 'searchApplied');
      component.search('text');
      expect(searchAppliedSpy).toHaveBeenCalled();
    });
  });

  describe('', () => {
    const eventMock = {
      target: {
        files: []
      }
    };

    beforeEach(() => {
      component.fileInput = searchInputMock;
      component.onUpload = {
        emit: function() {}
      };
    });

    it ('should emit value onUpload', () => {
      const onUploadSpy = spyOn(component.onUpload, 'emit');
      component.fileChange(eventMock);
      expect(onUploadSpy).toHaveBeenCalled();
    });
  });

  it ('should clear file', () => {
    component.fileInput = searchInputMock;
    component.clearFile();
    expect(component.fileInput.nativeElement.value).toEqual('');
  });
});



