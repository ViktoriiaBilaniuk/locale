import { ShowHidePasswordComponent } from './show-hide-password.component';
import { ELEMENT_REF, RENDERER_STUB } from '../../../test/stubs/service-stubs';

describe('ShowHidePasswordComponent', () => {

  let component, querySelectorSpy, setAttributeSpy;
  const typeMock = {type: 'password'};

  beforeEach(() => {
    component = new ShowHidePasswordComponent(ELEMENT_REF, RENDERER_STUB);
    querySelectorSpy = spyOn(ELEMENT_REF.nativeElement, 'querySelector').and.returnValue(typeMock);
    setAttributeSpy = spyOn(RENDERER_STUB, 'setAttribute');
  });

  it ('should assign input', () => {
    component.ngOnInit();
    expect(component.input).toEqual(typeMock);
  });

  it ('should assign isHidden to true', () => {
    component.ngOnInit();
    expect(component.isHidden).toBeTruthy();
  });

  it ('should set isHidden to false', () => {
    component.isHidden = true;
    component.toggleShow();
    expect(component.isHidden).toBeFalsy();
  });

  it ('should call setAttribute', () => {
    component.toggleShow();
    expect(setAttributeSpy).toHaveBeenCalled();
  });
});
