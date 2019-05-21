import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[slBold]'
})
export class BoldDirective {

  constructor(element: ElementRef) {
    element.nativeElement.style.fontWeight = '600';
  }

}
