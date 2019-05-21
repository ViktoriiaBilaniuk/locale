import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[slRed]'
})
export class RedDirective {

  constructor(element: ElementRef) {
    element.nativeElement.style.color = '#d0021b';
  }

}
