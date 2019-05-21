import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../../core/services/validation/validation.service';
import { UserService } from '../../core/services/user/user.service';
import { UtilsService } from '../../core/services/utils/utils.service';
import { TrackingSerivce } from '../../core/services/tracking/tracking.service';

@Component({
  selector: 'sl-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  formIsSubmitted: boolean;
  currentPasswordValid = true;

  constructor(
    private fb: FormBuilder,
    private validation: ValidationService,
    private userService: UserService,
    private utils: UtilsService,
    private track: TrackingSerivce) { }

  ngOnInit() {
    this.createForm();
  }

  save () {
    this.formIsSubmitted = true;
    if (this.form.valid && this.newPasswordMatched()) {
      this.userService.changePassword(this.form.value)
        .subscribe((res: any) => {
            this.showModal();
            this.resetForm();
            this.track.changePassword();
          },
          (err) => {
            if (err.error.code === 403) {
              this.currentPasswordValid = false;
            }
          });
    }
  }

  createForm () {
    this.form = this.fb.group({
      current_password: ['', this.validation.getValidator().password],
      new_password: ['', this.validation.getValidator().password],
      new_password_confirmation: ['', this.validation.getValidator().password]
    });
  }

  resetForm () {
    this.form.reset();
    this.formIsSubmitted = false;
    this.currentPasswordValid = true;
  }

  showModal () {
    this.utils.showInfoModal('Settings.modalTitle', 'Settings.modalText');
  }

  newPasswordMatched () {
    return !(this.new_password_confirmationCtrl.touched &&
      this.new_password_confirmationCtrl.valid &&
      this.new_passwordCtrl.touched &&
      this.new_passwordCtrl.valid &&
      this.form.value.new_password !== this.form.value.new_password_confirmation);
  }

  get current_passwordCtrl () {
    return this.form.controls.current_password;
  }

  get new_passwordCtrl () {
    return this.form.controls.new_password;
  }

  get new_password_confirmationCtrl () {
    return this.form.controls.new_password_confirmation;
  }

}
