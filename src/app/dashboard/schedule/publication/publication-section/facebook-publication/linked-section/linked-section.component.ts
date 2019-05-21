import { Component, OnInit } from '@angular/core';
import { NETWORKS } from '../../../publication.constants';
import { LinkedPostService } from '../../../../../../core/services/publication/linked-post.service';

@Component({
  selector: 'sl-linked-section',
  templateUrl: './linked-section.component.html',
  styleUrls: ['./linked-section.component.scss']
})
export class LinkedSectionComponent implements OnInit {
  NETWORKS = NETWORKS;
  isContentPoolOpen = false;
  indexOfCarouselItemWhichOpenedContentPool;

  constructor(private linkedPostService: LinkedPostService) { }

  ngOnInit() {

  }

  addNewLinkSection() {
    this.linkedPostService.addNewItemToCarousel();
    this.closeContentPool();
  }

  carouselItems() {
    return this.linkedPostService.carousel;
  }

  removeCarouselItem(i) {
    this.linkedPostService.removeCarouselItem(i);
    this.closeContentPool();
  }

  openContentPool(i) {
    if ( this.indexOfCarouselItemWhichOpenedContentPool === i) {
      this.isContentPoolOpen = !this.isContentPoolOpen;
    } else {
      this.indexOfCarouselItemWhichOpenedContentPool = i;
      this.isContentPoolOpen = true;
    }
  }

  closeContentPool() {
    this.isContentPoolOpen = false;
  }

  onAttachFileFromContentPool(file) {
    this.linkedPostService.addContentPoolFileToCaruselItem(file, this.indexOfCarouselItemWhichOpenedContentPool);
    this.isContentPoolOpen = false;
  }

  selectCtaButton(button) {
    this.linkedPostService.setCtaButton(button);
  }

  makeCarouselPost() {
    this.addNewLinkSection();
    this.addNewLinkSection();
  }

}
