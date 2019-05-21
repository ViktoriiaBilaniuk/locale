import { PerformanceModalFilterComponent } from './performance-modal-filter.component';

describe('PerformanceModalFilterComponent', () => {
  let component;
  const applyFilterMock = {
    emit: function() {} as any
  };
  const eventMock = {
    stopPropagation: function() {} as any
  };
  const optionMock = {
    option: 'option',
    menuIsActive: true
  };
  let applyFilter;

  beforeEach(() => {
    component = new PerformanceModalFilterComponent();
    component.onChangeOptionAndCloseMenu = applyFilterMock;
    applyFilter = spyOn(component.applyFilter, 'emit');
    component.performanceMenuIsActive = false;
  });

  it('should set performanceMenuIsActive to true', () => {
    component.togglePerformanceMenu(eventMock);
    expect(component.performanceMenuIsActive).toBeTruthy();
  });

  it('should set performanceMenuIsActive to false', () => {
    component.onClickedOutside(eventMock);
    expect(component.performanceMenuIsActive).toBeFalsy();
  });

  it('should emit value', () => {
    component.changeOptionAndCloseMenu(optionMock);
    expect(applyFilter).toHaveBeenCalledWith(optionMock.option);
  });

  it('should set performanceMenuIsActive', () => {
    component.changeOptionAndCloseMenu(optionMock);
    expect(component.performanceMenuIsActive).toEqual(optionMock.menuIsActive);
  });

});
