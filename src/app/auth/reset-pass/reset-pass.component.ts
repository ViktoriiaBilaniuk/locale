import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../core/services/auth/auth.service';
import { ValidationService } from './../../core/services/validation/validation.service';
import { TrackingSerivce } from './../../core/services/tracking/tracking.service';

@Component({
  selector: 'sl-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss']
})
export class ResetPassComponent implements OnInit {
  resetForm: FormGroup;
  formIsSubmitted: boolean;
  resetSuccessfully: boolean;
  type: string;
  private resetToken: string;
  private initial: boolean;

  constructor(
    private fb: FormBuilder,
    private validation: ValidationService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private track: TrackingSerivce
  ) { }

  ngOnInit() {
    this.createForm();
    this.getQueryParams();
  }

  // Getters
  get password() {
    return this.resetForm.get('password');
  }

  get password_confirmation() {
    return this.resetForm.get('password_confirmation');
  }

  /**
  * @description
  * Create reactive form
  *
  * @memberof LoginComponent
  */
  createForm() {
    this.resetForm = this.fb.group({
      password: ['', this.validation.getValidator().password],
      password_confirmation: ['', this.validation.getValidator().password]
    });
  }

  /**
   * @description
   * Get query params from url
   * => In case no params - redirect to login page
   *
   * @memberof ResetPassComponent
   */
  getQueryParams() {
    this.route.queryParams.subscribe((params) => {
      this.initial = JSON.parse(params.initial);
      if (params.type && params.token) {
        this.type = params.type;
        this.resetToken = params.token;
      } else {
        this.router.navigate(['auth/login']);
      }
    });
  }

  /**
   * @description
   * Reset pass for user/employee
   *
   * @memberof ResetPassComponent
   */
  reset() {
    if (this.resetForm.valid) {
      this.authCall
        .subscribe(() => {
          this.resetSuccessfully = true;
          this.track.userResetPassword('Success');
        }, () => this.track.userResetPassword('Error'));
    } else {
      this.formIsSubmitted = true;
    }
  }
  get authCall () {
    return this.initial ?
      this.auth.initPass(this.resetForm.value, this.type, this.resetToken) :
      this.auth.resetPass(this.resetForm.value, this.type, this.resetToken);
  }
}
