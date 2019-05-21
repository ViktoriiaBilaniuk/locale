import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {

  let component;
  const closeMock = {
    emit: function() {}
  };

  beforeEach(() => {
    component = new ModalComponent();
    component.close = closeMock;
  });

  it ('should emit value', () => {
    const closeSpy = spyOn(closeMock, 'emit');
    component.hideModal();
    expect(closeSpy).toHaveBeenCalled();
  });
});
