import { PerformanceModalDropdownComponent } from './performance-modal-dropdown.component';

describe('PerformanceModalDropdownComponent', () => {
  let component;
  const eventMock = {
    emit: function() {} as any
  };
  const optionMock = 'option';
  let emitSpy;

  beforeEach(() => {
    component = new PerformanceModalDropdownComponent();
    component.onChangeOptionAndCloseMenu = eventMock;
    emitSpy = spyOn(eventMock, 'emit');
  });

  it('should emit event', () => {
    component.optionClick(optionMock);
    expect(emitSpy).toHaveBeenCalledWith({option: 'option', menuIsActive: false});
  });

});
