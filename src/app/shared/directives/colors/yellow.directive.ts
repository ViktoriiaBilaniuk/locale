import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[slYellow]'
})
export class YellowDirective {

  constructor(element: ElementRef) {
    element.nativeElement.style.color = '#f9b83b';
  }

}
