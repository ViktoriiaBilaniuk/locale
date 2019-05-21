import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../../core/services/validation/validation.service';
import { UserService } from '../../core/services/user/user.service';
import { Store } from '../../core/store/store';
import { UtilsService } from '../../core/services/utils/utils.service';
import { TrackingSerivce } from './../../core/services/tracking/tracking.service';
import { filter } from 'rxjs/internal/operators';

@Component({
  selector: 'sl-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {
  form: FormGroup;
  user: any;
  formIsSubmitted: boolean;
  emailInUse: boolean;

  constructor(
    private fb: FormBuilder,
    private validation: ValidationService,
    private userService: UserService,
    private store: Store,
    private utils: UtilsService,
    private track: TrackingSerivce) { }

  ngOnInit() {
    this.createForm();
    this.getUser();
  }

  getUser () {
    this.store.select('current-user')
      .pipe(
        filter((user: any) => user)
      )
      .subscribe(this.setFormValue.bind(this));
  }

  setFormValue (user) {
    this.form.patchValue({
      email: user.email,
      display_name: user.display_name
    });
  }

  createForm () {
    this.form = this.fb.group({
      email: ['', this.validation.getValidator().email],
      display_name: ['', this.validation.getValidator().displayName]
    });
  }

  save () {
    this.formIsSubmitted = true;
    if (this.form.valid) {
      this.userService.updateUser(this.form.value)
        .subscribe((res) => {
            this.showModal();
            this.track.userDataWasEdited(['name', 'email']);
          },
          (err) => {
            // TODO: validate on backend and return appropriate error
            if (err.status === 500 && err.error.error.indexOf('duplicate') !== -1) {
              this.emailInUse = true;
              return;
            }
            this.utils.showErrorModal(err.error.message);
          });
    }
  }

  showModal () {
    this.utils.showInfoModal('Settings.modalTitle', 'Settings.modalText');
  }

  get display_nameCtrl () {
    return this.form.controls.display_name;
  }

  get emailCtrl () {
    return this.form.controls.email;
  }

}
