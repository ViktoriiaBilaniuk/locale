import {
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import { LinkedPostService } from '../../../../../../core/services/publication/linked-post.service';
import { CTA_BUTTON } from '../../../publication-section/facebook-publication/linked-section/link-constants';

@Component({
  selector: 'sl-link-carousel',
  templateUrl: './link-carousel.component.html',
  styleUrls: ['./link-carousel.component.scss'],
})
export class LinkCarouselComponent {
  @Input() data: any;
  @ViewChild('slides') slidesContainer: ElementRef<HTMLDivElement>;

  slideWidth = 300;
  sidebarWidth = 102;
  initialScrollWidth = 90;
  slidesIndex = 0;

  constructor(private linkedPostService: LinkedPostService) {}

  maxRightPosition() {
    return this.initialScrollWidth + ((this.slideWidth + 6) * (this.data.length - 2));
  }

  back() {
    if (this.slidesContainer.nativeElement.scrollLeft === this.maxRightPosition()) {
      this.slidesContainer.nativeElement.scrollLeft -= this.slideWidth - this.sidebarWidth;
    } else {
      this.slidesContainer.nativeElement.scrollLeft -= (this.slideWidth - this.sidebarWidth) + this.sidebarWidth;
    }


    if (this.slidesIndex > 0) {
      this.slidesIndex--;
    }
  }

  next() {
    if (this.slidesContainer.nativeElement.scrollLeft === 0) {
      this.slidesContainer.nativeElement.scrollLeft += this.slideWidth - this.sidebarWidth;
    } else {
      this.slidesContainer.nativeElement.scrollLeft += (this.slideWidth - this.sidebarWidth) + this.sidebarWidth;
    }

    if (this.slidesIndex < this.data.length - 1) {
      this.slidesIndex++;
    }
  }

  ctaButtonText(slide) {
    if (slide.callToActionButton) {
      return slide.callToActionButton.value;
    }
    if (!this.linkedPostService.generalLinkedPost.callToActionButton) {
      return;
    }
    return this.linkedPostService.generalLinkedPost.callToActionButton.value;
  }

  isCtaButton(slide) {
    return this.ctaButtonText(slide) && this.ctaButtonText(slide) !== CTA_BUTTON.NO_BUTTON;
  }

  getLink(slide) {
    if (slide.link) {
      return slide.link;
    }
    if (this.linkedPostService.siteLinkForLinkedPost.getValue()) {
      return this.linkedPostService.siteLinkForLinkedPost.getValue();
    }
    return '';
  }

  getSourceUrl(slide) {
    return slide.file.base64 ? slide.file.base64 : slide.file.url;
  }

}
