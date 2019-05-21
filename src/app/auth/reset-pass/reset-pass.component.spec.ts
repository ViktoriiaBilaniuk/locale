import { ResetPassComponent } from './reset-pass.component';
import { ValidationService } from './../../core/services/validation/validation.service';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs/index';

describe ('ResetPass component', () => {
  let component: ResetPassComponent;

  // Mocks
  const fb = new FormBuilder();

  const route = {
    value: of({id: 2, initial: 'true'}),
    get queryParams() {
      return this.value;
    }
  } as any;
  const router = {
    navigate(path: string) {}
  } as any;
  const mockTracker = {
    userResetPassword () {}
  } as any;

  const auth = {
    resetPass() { return of({}); },
    initPass() { return of({}); }
  } as any;

  beforeEach(() => {
    component = new ResetPassComponent(fb, new ValidationService(), auth, route, router, mockTracker);
  });

  it('Init: should invoke create form method', () => {
    const spy1 = spyOn(component, 'createForm');

    component.ngOnInit();

    expect(spy1).toHaveBeenCalled();
  });

  it ('createForm: should create form with two controls(password & password_confirmation)', () => {
    component.createForm();

    expect(component.resetForm.contains('password')).toBeTruthy();
    expect(component.resetForm.contains('password_confirmation')).toBeTruthy();
  });

  it ('createForm: should set correct validation for password control', () => {
    component.createForm();

    const passCtrl = component.resetForm.get('password');
    expect(passCtrl.valid).toBeFalsy();

    passCtrl.setValue('1234567');
    expect(passCtrl.valid).toBeFalsy();

    passCtrl.setValue('12345678910');
    expect(passCtrl.valid).toBeTruthy();

    passCtrl.setValue('1234567891234567554555555555767');
    expect(passCtrl.valid).toBeFalsy();
  });

  it ('createForm: should set correct validation for password_confirmation control', () => {
    component.createForm();

    const passCtrl = component.resetForm.get('password_confirmation');
    expect(passCtrl.valid).toBeFalsy();

    passCtrl.setValue('1234567');
    expect(passCtrl.valid).toBeFalsy();

    passCtrl.setValue('12345678910');
    expect(passCtrl.valid).toBeTruthy();

    passCtrl.setValue('1234567891234567554555555555767');
    expect(passCtrl.valid).toBeFalsy();
  });

  describe ('Submit', () => {
    let resetSpy, initSpy;

    const fillForm = () => {
      const passCtrl = component.resetForm.get('password');
      passCtrl.setValue('12345678910');
      const passConfirmCtrl = component.resetForm.get('password_confirmation');
      passConfirmCtrl.setValue('12345678910');
    };
    beforeEach(() => {
      resetSpy = spyOn(auth, 'resetPass').and.returnValue(of({}));
      initSpy = spyOn(auth, 'initPass').and.returnValue(of({}));
    });

    it('should not call backend if form is invalid', () => {
      component.ngOnInit();
      fillForm();

      const passCtrl = component.resetForm.get('password');
      passCtrl.setValue('0');
      component.reset();

      expect(resetSpy).not.toHaveBeenCalled();
      expect(initSpy).not.toHaveBeenCalled();
    });

    it('should call init password backend in query params have initial = true', () => {
      route.value = of({type: 'user', token: 'token', initial: 'true'});
      component.ngOnInit();
      fillForm();

      component.reset();

      expect(resetSpy).not.toHaveBeenCalled();
      expect(initSpy).toHaveBeenCalled();
    });

    it('should call reset password backend in query params have initial = false', () => {
      route.value = of({type: 'user', token: 'token', initial: 'false'});
      component.ngOnInit();
      fillForm();

      component.reset();

      expect(resetSpy).toHaveBeenCalled();
      expect(initSpy).not.toHaveBeenCalled();
    });
  });
});
