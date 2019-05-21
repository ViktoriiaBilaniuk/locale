import { TextareaComponent } from './textarea.component';
import { APPLICATION_REF, RENDERER_STUB, UTILS_STUB } from '../../../test/stubs/service-stubs';

describe('TextareaComponent', () => {
  let component;

  beforeEach(() => {
    component = new TextareaComponent(UTILS_STUB, APPLICATION_REF, RENDERER_STUB);
  });

  describe('onSaveClick', () => {
    beforeEach(() => {
      component.required = true;
      component.inputRef = {
        nativeElement: {
          value: ''
        }
      };

    });

    it ('should show error modal', () => {
      const showErrorModalSpy = spyOn(UTILS_STUB, 'showErrorModal');
      component.onSaveClick();
      expect(showErrorModalSpy).toHaveBeenCalled();
    });

    it ('should emit value', () => {
      component.onSave = {emit: function() {}};
      component.required = false;
      const emitSpy = spyOn(component.onSave, 'emit');
      component.onSaveClick();
      expect(emitSpy).toHaveBeenCalled();
    });

  });

  it ('should emit value onCancel', () => {
    const onCancelSpy = spyOn(component.onCancel, 'emit');
    component.onCancelClick();
    expect(onCancelSpy).toHaveBeenCalled();
  });

  it ('should setup event listeners', () => {
    const setupEventListenersSpy = spyOn(component, 'setupEventListeners');
    component.ngOnInit();
    expect(setupEventListenersSpy).toHaveBeenCalled();
  });

});
