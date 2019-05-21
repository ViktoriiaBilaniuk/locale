import { NamedLinksComponent } from './named-links.component';
import { STORE_STUB, VENUE_SERVICE_STUB } from '../../../test/stubs/service-stubs';

describe('NamedLinksComponent', () => {
  let component: NamedLinksComponent;
  const venueServiceStub = VENUE_SERVICE_STUB;
  const store = STORE_STUB;
  const mockItem = {};
  const itemMock = {};
  const eventStub = {
    preventDefault: () => {},
  };

  beforeEach(() => {
    component = new NamedLinksComponent(venueServiceStub, store);
    component.editMode = component.showAdd = component.showEdit = true;
  });

  it ('should init editMode', () => {
    component.ngOnChanges();
    expect(component.editMode).toBeFalsy();
  });

  it ('should init showAdd', () => {
    component.ngOnChanges();
    expect(component.showAdd).toBeFalsy();
  });

  it ('should init showEdit', () => {
    component.ngOnChanges();
    expect(component.showEdit).toBeFalsy();
  });

  it ('should set editMode to false', () => {
    component.onToggleEditMode();
    expect(component.editMode).toBeFalsy();
  });

  it ('should set showAdd to false', () => {
    component.onToggleEditMode();
    expect(component.showAdd).toBeFalsy();
  });

  it ('should set showEdit to false', () => {
    component.onToggleEditMode();
    expect(component.showEdit).toBeFalsy();
  });

  it ('should set showAdd to true', () => {
    component.showAdd = false;
    component.editItem = {};
    component.showAddForm();
    expect(component.showAdd).toBeTruthy();
  });

  it ('should set editItem - to null', () => {
    component.showAdd = false;
    component.editItem = {};
    component.showAddForm();
    expect(component.editItem).toEqual(null);
  });

  it('should set showAdd to false in hideAddForm', () => {
    component.hideAddForm(mockItem);
    expect(component.showAdd).toBeFalsy();
  });

  it ('should prevent event', () => {
    const eventMockSpy = spyOn(eventStub, 'preventDefault');
    component.showEditForm(itemMock, eventStub);
    expect(eventMockSpy).toHaveBeenCalled();
  });

  it ('should assign editItem and set showEdit to true', () => {
    component.showEditForm(itemMock, eventStub);
    expect(component.showEdit).toBeTruthy();
  });

  it ('should set showEdit to true', () => {
    component.showEditForm(itemMock, eventStub);
    expect(component.editItem).toEqual(itemMock);
  });

  it ('should set showEdit to false in hideEditForm', () => {
    component.hideEditForm();
    expect(component.showEdit).toBeFalsy();
  });

  it ('should set showAdd to false in cancelAdd', () => {
    component.cancelAdd();
    expect(component.showAdd).toBeFalsy();
  });

  it ('should set showEdit to false in cancelEdit', () => {
    component.cancelEdit();
    expect(component.showEdit).toBeFalsy();
  });

  it ('should return initial url', () => {
    const urlMock = 'url';
    expect(component.getLink(urlMock)).toEqual(`//${urlMock}`);
  });

  it ('should return changed url', () => {
    const urlMock = 'http://url';
    expect(component.getLink(urlMock)).toEqual(urlMock);
  });

});
