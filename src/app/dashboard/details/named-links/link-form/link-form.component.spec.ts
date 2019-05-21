import { LinkFormComponent } from './link-form.component';
import { FORM_BUILDER_STUB, VALIDATION_SERVICE_STUB } from '../../../../test/stubs/service-stubs';
import { LINK_MOCK, NAMED_LINK_FORM } from '../../../../test/mocks/details-mocks';

describe('LinkFormComponent', () => {
  let component: LinkFormComponent;
  const formBuilderStub = FORM_BUILDER_STUB;
  const validationStub = VALIDATION_SERVICE_STUB;
  const linkMock = LINK_MOCK;
  const formMock = NAMED_LINK_FORM;
  const eventMock = {
    preventDefault: () => {},
  };
  let saveSpy;
  let patchValueSpy;
  let preventDefaultSpy;
  let removeSpy;
  let cancelSpy;

  beforeEach(() => {
    component = new LinkFormComponent(formBuilderStub, validationStub);
    component.form = formMock;
    component.formIsSubmitted = false;
    saveSpy = spyOn(component.save, 'emit');
    patchValueSpy = spyOn(formMock, 'patchValue');
    preventDefaultSpy = spyOn(eventMock, 'preventDefault');
    removeSpy = spyOn(component.remove, 'emit');
    cancelSpy = spyOn(component.cancel, 'emit');
    component.item = linkMock;
  });

  it ('should assign form', () => {
    component.form = undefined;
    component.createForm();
    expect(component.form).toBeDefined();
  });
  it ('should set form value', () => {
    component.setFormValue(linkMock);
    expect(patchValueSpy).toHaveBeenCalled();
  });

  it('should return controls name', () => {
    expect(component.nameCtrl).toEqual('name' as any);
  });

  it('should return controls url', () => {
    expect(component.urlCtrl).toEqual('url' as any);
  });

  it('should set formIsSubmitted to true', () => {
    component.submit();
    expect(component.formIsSubmitted).toBeTruthy();
  });

  it('should call patchValue in save method', () => {
    component.submit();
    expect(patchValueSpy).toHaveBeenCalled();
  });

  it('should emit value', () => {
    component.item = undefined;
    component.submit();
    expect(saveSpy).toHaveBeenCalledWith({item: formMock.value});
  });

  it('should emit value in delete', () => {
    component.delete(eventMock);
    expect(removeSpy).toHaveBeenCalledWith({item: linkMock});
  });

  it('should call preventDefault in event', () => {
    component.delete(eventMock);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should emit value in cancel method', () => {
    component.onCancel(eventMock);
    expect(cancelSpy).toHaveBeenCalledWith({});
  });

  it('should call preventDefault in cancel method', () => {
    component.onCancel(eventMock);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
