import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[slBlue]'
})
export class BlueDirective {

  constructor(element: ElementRef) {
    element.nativeElement.style.color = '#3366cc';
  }

}
