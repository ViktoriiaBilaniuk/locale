import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

const validator = {
  email: [
    Validators.required,
    Validators.pattern(/[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}/)
  ],
  password: [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(30)
  ],
  displayName: [
    Validators.required,
    Validators.maxLength(40)
  ],
  linkName: [
    Validators.maxLength(100)
  ],
  linkUrl: [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(1000)
  ]
};

@Injectable()
export class ValidationService {

  constructor() { }

  getValidator() {
    return validator;
  }

}
