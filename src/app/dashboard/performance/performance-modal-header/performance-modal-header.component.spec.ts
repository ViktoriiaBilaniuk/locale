import { PerformanceModalHeaderComponent } from './performance-modal-header.component';

describe('PerformanceModalHeaderComponent', () => {
  let component;
  const closeMock = {
    emit: function() {} as any
  };
  let closeSpy;

  beforeEach(() => {
    component = new PerformanceModalHeaderComponent();
    component.close = closeMock;
    closeSpy = spyOn(closeMock, 'emit');
  });

  it('should emit value', () => {
    component.closePerformanceModal();
    expect(closeSpy).toHaveBeenCalled();
  });

});
