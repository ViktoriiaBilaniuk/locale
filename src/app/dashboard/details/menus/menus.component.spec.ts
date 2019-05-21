import { MenusComponent } from './menus.component';
import { DetailsMenu } from '../../../models/right-sidebar/venue-details/details-menu';
import { UTILS_STUB, VENUE_SERVICE_STUB } from '../../../test/stubs/service-stubs';
import { DETAILS_MENU_MOCK } from '../../../test/mocks/details-mocks';
import { of } from 'rxjs/index';

describe('MenusComponent', () => {
  let component: MenusComponent;
  const venueService = VENUE_SERVICE_STUB;
  const utilsStub = UTILS_STUB;
  const detailsMenuMock = DETAILS_MENU_MOCK;
  const placeholderImageMock = '1';
  const emptyDetailsMenuMock = [
    {
      name: '',
      source: '',
    } as DetailsMenu
  ];
  const editorMenusMock = [
    {
      name: '1',
      source: 'source1',
    } as DetailsMenu,
    {
      name: '2',
      source: 'source2',
    } as DetailsMenu,
  ];

  const newMenusMock = [
    {
      name: 'name1',
      source: 'source1',
    } as DetailsMenu,
    {
      name: 'name2',
      source: 'source2',
    } as DetailsMenu,
  ];

  const initDetailsMenuMock = {
    name: '2',
    source: 'source2',
  } as DetailsMenu;

  const resultEditorMenusMock = [
    {
      name: '1',
      source: 'source1',
    } as DetailsMenu,
  ];

  beforeEach(() => {
    component = new MenusComponent(venueService, utilsStub);
    component.editMode = true;
    component.menus = editorMenusMock;
    component.editorMenus = [];
    component.onEdit = { emit: function() {} } as any;
    component.error = true;
  });

  it ('should init editor menus', () => {
    component.ngOnChanges();
    expect(component.editorMenus).toEqual(editorMenusMock);
  });

  it ('should set edit mode to false', () => {
    component.ngOnChanges();
    expect(component.editMode).toBeFalsy();
  });

  it ('should return placeholderImage', () => {
    component.placeholderImage = placeholderImageMock;
    expect(component.getMenuStyle(detailsMenuMock)).toBe(placeholderImageMock);
  });

  it ('should return url', () => {
    detailsMenuMock.source = 'source.img';
    const url = `url(${detailsMenuMock.source})`;
    expect(component.getMenuStyle(detailsMenuMock)).toBe(url);
  });

  it ('should return empty string', () => {
    detailsMenuMock.source = undefined;
    expect(component.getMenuStyle(detailsMenuMock)).toBe('');
  });

  it ('should return false', () => {
    detailsMenuMock.source = 'source.img';
    expect(component.isPdf(detailsMenuMock)).toBeFalsy();
  });

  it ('should return true', () => {
    detailsMenuMock.source = 'source.pdf';
    expect(component.isPdf(detailsMenuMock)).toBeTruthy();
  });

  it ('should add empty DetailsMenu object to editorMenus', () => {
    component.onAddNewMenuClick();
    expect(component.editorMenus).toEqual(emptyDetailsMenuMock);
  });

  it ('should remove menu object from editorMenus', () => {
    component.editorMenus = editorMenusMock;
    component.onRemoveMenuClick(initDetailsMenuMock);
    expect(component.editorMenus).toEqual(resultEditorMenusMock);
  });

  it ('should validate menu items', () => {
    component.editorMenus = emptyDetailsMenuMock;
    component.onSaveClick();
    expect(component.error).toBeTruthy();
  });

  it ('should assign editMode to false', () => {
    component.editorMenus = editorMenusMock;
    component.onSaveClick();
    expect(component.error).toBeTruthy();
  });

  it ('should emit new menus list', () => {
    component.error = true;
    const onEditSpy = spyOn(component.onEdit, 'emit');
    component.editorMenus = newMenusMock;
    component.onSaveClick();
    expect(onEditSpy).toHaveBeenCalled();
    expect(onEditSpy).toHaveBeenCalledWith(newMenusMock);
  });

  it ('should set edit mode to false on CancelClick', () => {
    component.editMode = true;
    component.onCancelClick();
    expect(component.editMode).toBeFalsy();
  });

  it ('should set editorMenus', () => {
    component.editMode = true;
    component.menus = editorMenusMock;
    component.onCancelClick();
    expect(component.editorMenus).toEqual(editorMenusMock);
  });

  describe('onToggleEditMode', () => {
    let addEventListenerSpy;
    let removeEventListenerSpy;

    beforeEach(() => {
      component.editMode = true;
      addEventListenerSpy = spyOn(window, 'addEventListener');
      removeEventListenerSpy = spyOn(window, 'removeEventListener');
    });

    it ('should set editMode to false in onToggleEditMode', () => {
      component.onToggleEditMode();
      expect(component.editMode).toBeFalsy();
    });

    it ('should add event listener ', () => {
      component.editMode = false;
      component.onToggleEditMode();
      expect(addEventListenerSpy).toHaveBeenCalled();
    });

    it ('should remove event listener ', () => {
      component.onToggleEditMode();
      expect(removeEventListenerSpy).toHaveBeenCalled();
    });

  });

  describe('onToggleEditMode', () => {
    let uploadFileSpy;
    let event;
    const res = {
      data: {
        file_url: 'url',
        signed_request: ''
      }
    };

    beforeEach(() => {
      uploadFileSpy = spyOn(venueService, 'uploadFile').and.returnValue(of(res));
      component.fileUploadSubscription = {unsubscribe: () => {}};
      event = {
        target: {
          files: ['file'],
          value: ''
        }
      };
    });

    it ('should upload photo', () => {
      component.onEditMenuAttachment(event, editorMenusMock as any);
      expect(uploadFileSpy).toHaveBeenCalled();
    });
  });
});
