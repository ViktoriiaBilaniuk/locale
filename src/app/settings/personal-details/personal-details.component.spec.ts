import { PersonalDetailsComponent } from './personal-details.component';
import { ValidationService } from './../../core/services/validation/validation.service';
import { FormBuilder } from '@angular/forms';
import { Store } from '../../core/store/store';
import { of } from 'rxjs/index';

describe('PersonalDetailsComponent', () => {
  let component;
  const validDetails = { display_name: '12', email: 'test@test.test'};
  const invalidDetails = { display_name: '12', email: 'test@test'};
  const store = new Store();
  const mockTracker = {
    userDataWasEdited () {}
  } as any;
  const userService = {
    updateUser() { return of({}); },
    fetchCurrentUser() { return  of({}); }
  } as any;
  const utilsService = {
    showInfoModal () {},
    showErrorModal () {}
  } as any;
  const formMock = {
    patchValue: () => {}
  };

  beforeEach(() => {
    component = new PersonalDetailsComponent(
      new FormBuilder(), new ValidationService(), userService, store, utilsService, mockTracker
    );
    component.form = formMock;
  });

  describe('Validation', () => {
    beforeEach(() => {
      component.createForm();
    });

    it('should validate display name', () => {
      const ctrl = component.display_nameCtrl;
      expect(ctrl.valid).toBeFalsy();
      ctrl.setValue('1');
      expect(ctrl.valid).toBeTruthy();
    });

    it('should validate email', () => {
      const ctrl = component.emailCtrl;

      expect(ctrl.valid).toBeFalsy();

      ctrl.setValue('yavoua');
      expect(ctrl.valid).toBeFalsy();

      ctrl.setValue('yavorco@i.ua');
      expect(ctrl.valid).toBeTruthy();
    });
  });

  it ('should get user', () => {
    const storeSpy = spyOn(store, 'select').and.returnValue(of(validDetails));
    component.getUser();
    expect(storeSpy).toHaveBeenCalledWith('current-user');
  });

  it ('should patch form value', () => {
    const patchSpy = spyOn(component.form, 'patchValue');
    component.setFormValue(validDetails);
    expect(patchSpy).toHaveBeenCalledWith(validDetails);
  });


  it ('should save valid personal details', () => {
    const spy2 = spyOn(userService, 'updateUser').and.returnValue(of({}));
    component.createForm();
    component.form.setValue(invalidDetails);
    component.save();
    expect(spy2).not.toHaveBeenCalled();
    component.form.setValue(validDetails);
    component.save();
    expect(spy2).toHaveBeenCalled();
  });
});
