import { Directive, ElementRef, HostListener } from '@angular/core';
import { PostErrorsHandlerService } from '../../core/services/publication/post-errors-handler.service';

@Directive({
  selector: '[slCheckDuration]'
})
export class CheckDurationDirective {

  constructor(
    private element: ElementRef,
    private postErrorsHandlerService: PostErrorsHandlerService) {
  }

  @HostListener('loadedmetadata') onMouseEnter() {
    this.postErrorsHandlerService.validateVideoDuration(this.element.nativeElement.duration);
  }

}
