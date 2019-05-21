import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[slGreen]'
})
export class GreenDirective {

  constructor(element: ElementRef) {
    element.nativeElement.style.color = '#84a796';
  }

}
