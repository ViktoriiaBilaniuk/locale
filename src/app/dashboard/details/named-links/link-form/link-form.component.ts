import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../../../../core/services/validation/validation.service';

@Component({
  selector: 'sl-link-form',
  templateUrl: './link-form.component.html',
  styleUrls: ['./link-form.component.scss']
})
export class LinkFormComponent implements OnInit {
  formIsSubmitted: boolean;
  form: FormGroup;
  @Input() item: any;
  @Output() save = new EventEmitter<object>();
  @Output() cancel = new EventEmitter<object>();
  @Output() remove = new EventEmitter<object>();
  constructor(private fb: FormBuilder,
              private validation: ValidationService) { }

  ngOnInit() {
    this.createForm();
    if (this.item) {
      this.setFormValue(this.item);
    }
  }

  createForm () {
    this.form = this.fb.group({
      url: ['', this.validation.getValidator().linkUrl],
      name: ['', this.validation.getValidator().linkName]
    });
  }

  setFormValue (link) {
    this.form.patchValue({
      url: link.url,
      name: link.name
    });
  }

  get nameCtrl () {
    return this.form.controls.name;
  }

  get urlCtrl () {
    return this.form.controls.url;
  }

  submit () {
    this.formIsSubmitted = true;
    this.form.patchValue({ url: this.form.value.url.trim()});
    if (this.form.valid) {
      if (this.item) {
        this.item.name = this.form.value.name.trim();
        this.item.url = this.form.value.url;
        this.save.emit();
      } else {
        this.save.emit({item: this.form.value});
      }
    }
  }

  delete($event) {
    this.remove.emit({item: this.item});
    $event.preventDefault();
  }

  onCancel($event) {
    this.cancel.emit({});
    $event.preventDefault();
  }

}
