import { Component, OnInit } from '@angular/core';
import { LinkedPostService } from '../../../../../../../core/services/publication/linked-post.service';

@Component({
  selector: 'sl-main-link',
  templateUrl: './main-link.component.html',
  styleUrls: ['./main-link.component.scss']
})
export class MainLinkComponent implements OnInit {

  value = '';

  constructor(
    private linkedPostService: LinkedPostService) {
  }

  ngOnInit() {
    if (this.linkedPostService.siteLinkForLinkedPost.getValue()) {
      this.value = this.linkedPostService.siteLinkForLinkedPost.getValue();
      this.inputChange(this.value);
    }
  }

  inputChange(value) {
    const links = this.linkedPostService.fetchLinks(value);
    if (links && links[0]) {
      this.setSiteLinkForLinkedPost(links[0].href);
    } else {
      this.setSiteLinkForLinkedPost(null);
    }
  }

  setSiteLinkForLinkedPost(value) {
    this.linkedPostService.setSiteLinkForLinkedPost(value);
  }

}
