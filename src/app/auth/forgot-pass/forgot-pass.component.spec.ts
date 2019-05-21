import { ValidationService } from './../../core/services/validation/validation.service';
import { FormBuilder } from '@angular/forms';
import { ForgotPassComponent } from './forgot-pass.component';
import { of } from 'rxjs/index';

describe ('ForgotPass component', () => {
  let component: ForgotPassComponent;

  // Mocks
  const fb = new FormBuilder();
  const auth = { forgotPass: () => of({}) } as any;
  const router = {} as any;

  beforeEach(() => {
    component = new ForgotPassComponent(fb, new ValidationService(), auth, router);
  });

  it('Init: should invoke create form method', () => {
    const spy1 = spyOn(component, 'createForm');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
  });

  it('createForm: should create form with one controls(email)', () => {
    component.createForm();
    expect(component.forgotForm.contains('email')).toBeTruthy();
  });

  it('createForm: should set correct validation for email control', () => {
    component.createForm();

    const emailCtrl = component.forgotForm.get('email');
    expect(emailCtrl.valid).toBeFalsy();

    emailCtrl.setValue('yavoua');
    expect(emailCtrl.valid).toBeFalsy();

    emailCtrl.setValue('yavorco@i.ua');
    expect(emailCtrl.valid).toBeTruthy();
  });

  it('should return emial formControl', () => {
    component.ngOnInit();
    expect(component.email.value).toEqual('');
    component.forgotForm.get('email').setValue('test@development.com');
    expect(component.email.value).toEqual('test@development.com');
  });

  it('should send forgot password request', () => {
    component.ngOnInit();
    component.forgotForm.get('email').setValue('test@development.com');
    const authSpy = spyOn(auth, 'forgotPass').and.returnValue(of({}));

    component.sentResetEmail();

    expect(authSpy).toHaveBeenCalledTimes(1);
    expect(authSpy).toHaveBeenCalledWith(component.forgotForm.value);
    expect(component.sendSuccessfully).toEqual(true);
  });

  it('should NOT send forgot password request with not valid form', () => {
    component.ngOnInit();
    component.sentResetEmail();
    expect(component.formIsSubmitted).toEqual(true);
  });
});
