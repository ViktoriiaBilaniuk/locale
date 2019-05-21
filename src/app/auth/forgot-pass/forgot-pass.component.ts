import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { ValidationService } from './../../core/services/validation/validation.service';
import {fadeInAnimation} from '../../shared/animations/fade-in.animation';

@Component({
  selector: 'sl-forgot-pass',
  templateUrl: 'forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss'],
  animations: [fadeInAnimation],
})
export class ForgotPassComponent implements OnInit {
  forgotForm: FormGroup;
  formIsSubmitted: boolean;
  sendSuccessfully: boolean;

  constructor(
    private fb: FormBuilder,
    private validation: ValidationService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
  }

  // Getters
  get email() {
    return this.forgotForm.get('email');
  }

  /**
    * @description
    * Create reactive form
    *
    * @memberof ForgotPassComponent
    */
  createForm() {
    this.forgotForm = this.fb.group({
      email: ['', this.validation.getValidator().email]
    });
  }

  sentResetEmail() {
    if (this.forgotForm.valid) {
      this.auth.forgotPass(this.forgotForm.value).subscribe(() => {
        this.sendSuccessfully = true;
      });
    } else {
      this.formIsSubmitted = true;
    }
  }
}
