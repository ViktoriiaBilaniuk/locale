import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../../core/services/validation/validation.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { TrackingSerivce } from './../../core/services/tracking/tracking.service';
import { fadeInAnimation } from '../../shared/animations/fade-in.animation';

@Component({
  selector: 'sl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeInAnimation],
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  formIsSubmitted: boolean;

  constructor(
    public track: TrackingSerivce,
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private validation: ValidationService,
  ) {}

  ngOnInit() {
    this.createForm();
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', this.validation.getValidator().email],
      password: ['', this.validation.getValidator().password]
    });
  }

  /**
   * @description
   * On form submit => make request to login user
   * => Navigate user to dashboard
   *
   * @memberof LoginComponent
   */
  login() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value)
        .subscribe((res: any) => {
          this.track.login('Success');
          this.router.navigate(['']);
        }, (err) => this.track.login('Error'));
    } else {
      this.formIsSubmitted = true;
    }
  }
}
