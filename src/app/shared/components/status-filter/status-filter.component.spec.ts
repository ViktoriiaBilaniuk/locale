import { StatusFilterComponent } from './status-filter.component';

describe('StatusFilterComponent', () => {

  let component;
  const statusMock = {selected: true};
  const statusesMock = [statusMock];
  const confirmMock = {
    emit: function () {}
  };

  beforeEach( () => {
    component = new StatusFilterComponent();
    component.confirm = confirmMock;
    component.statuses = statusesMock;
  });

  it ('should return true', () => {
    expect(component.allFilterChecked).toBeTruthy();
  });

  it ('should return selected statuses', () => {
    expect(component.selected).toEqual(statusesMock);
  });

  it ('should change status selected', () => {
    component.select(statusMock);
    expect(statusMock.selected).toBeFalsy();
  });

  it ('should emit value', () => {
    const emitSpy = spyOn(component.confirm, 'emit');
    component.select(statusMock);
    expect(emitSpy).toHaveBeenCalled();
  });

  it ('should emit value on clickOutside', () => {
    component.clickOutside = confirmMock;
    const emitSpy = spyOn(component.clickOutside, 'emit');
    component.onClickedOutside();
    expect(emitSpy).toHaveBeenCalled();
  });


});
