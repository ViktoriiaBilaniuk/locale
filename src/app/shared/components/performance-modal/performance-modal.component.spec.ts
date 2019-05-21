import { PerformanceModalComponent } from './performance-modal.component';

describe('PerformanceModalComponent', () => {

  let component;
  const closeMock = {
    emit: function() {}
  };

  beforeEach(() => {
    component = new PerformanceModalComponent();
    component.close = closeMock;
  });

  it ('should emit value', () => {
    const closeSpy = spyOn(closeMock, 'emit');
    component.hideModal();
    expect(closeSpy).toHaveBeenCalled();
  });
});
