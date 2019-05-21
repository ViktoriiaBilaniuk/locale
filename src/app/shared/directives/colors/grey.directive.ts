import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[slGrey]'
})
export class GreyDirective {

  constructor(element: ElementRef) {
    element.nativeElement.style.color = '#a7a7a7';
  }

}
