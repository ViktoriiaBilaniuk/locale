import { CodeTitleComponent } from './code-title.component';

describe('CodeTitleComponent', () => {

  let component;
  const emitMock = {
    emit: function () {}
  };

  beforeEach(() => {
    component = new CodeTitleComponent();
    component.closeCodeModal = emitMock;
  });

  it ('should emit value', () => {
    const closeViewCodeModalSpy = spyOn(emitMock, 'emit');
    component.closeViewCodeModal();
    expect(closeViewCodeModalSpy).toHaveBeenCalled();
  });

});
