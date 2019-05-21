import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'sl-show-hide-password',
  templateUrl: './show-hide-password.component.html',
  styleUrls: ['./show-hide-password.component.scss']
})
export class ShowHidePasswordComponent implements OnInit {
  public input: any;
  public isHidden: boolean;
  private inputTypes = { password: 'password', text: 'text'};

  constructor(private elem: ElementRef,
              private renderer: Renderer2) { }

  ngOnInit() {
    this.input = this.elem.nativeElement.querySelector('input');
    if (this.input) {
      this.isHidden = this.input.type === this.inputTypes.password;
    }
  }

  toggleShow () {
    this.isHidden = !this.isHidden;
    this.renderer.setAttribute(this.input,
      'type',
      this.isHidden ?
        this.inputTypes.password :
        this.inputTypes.text);
  }
}
