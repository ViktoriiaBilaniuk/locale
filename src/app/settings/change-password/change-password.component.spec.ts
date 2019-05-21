import { ValidationService } from './../../core/services/validation/validation.service';
import { FormBuilder } from '@angular/forms';
import { ChangePasswordComponent } from './change-password.component';
import { of } from 'rxjs/index';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;

  const userService = { changePassword: (value) => of({}) } as any;
  const utils = { showInfoModal(title, text) {} } as any;
  const track = { changePassword() {} } as any;
  const fb = new FormBuilder();
  const vs = new ValidationService();

  beforeEach(() => {
    component = new ChangePasswordComponent(fb, vs, userService, utils, track);
  });

  it('should create form on init', () => {
    const spy1 = spyOn(component, 'createForm');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
  });

  describe('Validation', () => {
    beforeEach(() => {
      component.createForm();
    });

    const validatePass = (ctrl) => {
      expect(ctrl.valid).toBeFalsy();

      ctrl.setValue('123');
      expect(ctrl.valid).toBeFalsy();

      ctrl.setValue('12345678');
      expect(ctrl.valid).toBeTruthy();
    };

    it('should validate current password', () => {
      const currentPass = component.current_passwordCtrl;

      validatePass(currentPass);
    });

    it('should validate new password', () => {
      const newPass = component.new_passwordCtrl;

      validatePass(newPass);
    });

    it('should validate new password retype', () => {
      const confirmNewPass = component.new_password_confirmationCtrl;
      validatePass(confirmNewPass);
    });
  });

  it('should call method to show modal', () => {
    const serviceSpy = spyOn(utils, 'showInfoModal');
    component.showModal();
    expect(serviceSpy).toHaveBeenCalledWith('Settings.modalTitle', 'Settings.modalText');
  });

  it('should reset form', () => {
    component.createForm();
    component.resetForm();
    expect(component.formIsSubmitted).toEqual(false);
    expect(component.currentPasswordValid).toEqual(true);
  });

  it('should save new password', () => {
    const serviceSpy = spyOn(userService, 'changePassword').and.returnValue(of({}));
    const trackSpy = spyOn(track, 'changePassword');

    component.createForm();
    component.form.get('current_password').setValue('11111111');
    component.form.get('new_password').setValue('12341234');
    component.form.get('new_password_confirmation').setValue('12341234');
    component.save();

    expect(serviceSpy).toHaveBeenCalledWith({
      current_password: '11111111',
      new_password: '12341234',
      new_password_confirmation: '12341234'
    });
    expect(trackSpy).toHaveBeenCalledTimes(1);
  });
});
