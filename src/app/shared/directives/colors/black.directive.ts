import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[slBlack]'
})
export class BlackDirective {

  constructor(element: ElementRef) {
    element.nativeElement.style.color = '#4a4a4a';
  }

}
