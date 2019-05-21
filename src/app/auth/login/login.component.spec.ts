import { FormBuilder } from '@angular/forms';
import { ValidationService } from '../../core/services/validation/validation.service';
import { LoginComponent } from './login.component';
import { of } from 'rxjs/index';

describe ('Login Component', () => {
  let component: LoginComponent;

  // Mocks
  const fb = new FormBuilder();
  const router = {
    navigate(route: string) {}
  } as any;
  const auth = {
    login() {
      return of({});
    }
  } as any;
  const mockTracker = { login() {} } as any;

  const validUser = {'email': 'yavo@i.ua', 'password': '12345678'};
  const inValidUser = {'email': 'yavo', 'password': '123456'};

  beforeEach(() => {
    component = new LoginComponent(mockTracker, fb, router, auth, new ValidationService());
  });

  it('Init: should invoke create form method', () => {
    const spy1 = spyOn(component, 'createForm');

    component.ngOnInit();

    expect(spy1).toHaveBeenCalled();
  });

  it ('createForm: should create form with two controls(email & password)', () => {
    component.createForm();

    expect(component.loginForm.contains('email')).toBeTruthy();
    expect(component.loginForm.contains('password')).toBeTruthy();
  });

  it ('createForm: should set correct validation for email control', () => {
    component.createForm();

    const emailCtrl = component.loginForm.get('email');
    expect(emailCtrl.valid).toBeFalsy();

    emailCtrl.setValue('yavoua');
    expect(emailCtrl.valid).toBeFalsy();

    emailCtrl.setValue('yavorco@i.ua');
    expect(emailCtrl.valid).toBeTruthy();
  });

  it ('createForm: should set correct validation for password control', () => {
    component.createForm();

    const passCtrl = component.loginForm.get('password');
    expect(passCtrl.valid).toBeFalsy();

    passCtrl.setValue('1234567');
    expect(passCtrl.valid).toBeFalsy();

    passCtrl.setValue('12345678910');
    expect(passCtrl.valid).toBeTruthy();

    passCtrl.setValue('1234567891234567554555555555767');
    expect(passCtrl.valid).toBeFalsy();
  });

  it ('login: should call the service to login, only if form is valid', () => {
    component.ngOnInit();
    const spy1 = spyOn(auth, 'login').and.returnValue(of({}));

    component.loginForm.setValue(inValidUser);
    expect(component.loginForm.valid).toBeFalsy();

    component.login();
    expect(spy1).not.toHaveBeenCalled();

    component.loginForm.setValue(validUser);
    expect(component.loginForm.valid).toBeTruthy();

    component.login();
    expect(spy1).toHaveBeenCalledWith(validUser);
  });

  it ('login: should mark formIsSubmitted as true if form invalid but has been tried to submit', () => {
    component.ngOnInit();
    const spy1 = spyOn(auth, 'login').and.returnValue(of({}));

    component.login();
    expect(spy1).not.toHaveBeenCalled();
    expect(component.formIsSubmitted).toBeTruthy();
  });
});
