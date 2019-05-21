import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[slPink]'
})
export class PinkDirective {

  constructor(element: ElementRef) {
    element.nativeElement.style.color = '#fc5671';
  }

}
