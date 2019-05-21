import { Component, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'sl-site-preview',
  templateUrl: './site-preview.component.html',
  styleUrls: ['./site-preview.component.scss']
})
export class SitePreviewComponent {
  @ViewChild('image') image;
  @Input() data;
  @Input() loading;
  isHorizontalImage = false;

  isImageElementWithMetadataSource() {
    return this.image && this.image.nativeElement && this.data.metadata && this.data.metadata.image &&
      this.image.nativeElement.src === this.data.metadata.image;
  }

  getInfoWidth() {
    if (!this.data.metadata.image || this.isHorizontalImage) {
      return '100%';
    }
  }

  getInfoLeftWidth() {
    if (this.data.callToActionButton) {
      return '64%';
    }
  }

  infoImageChange() {
    if (this.isImageElementWithMetadataSource()) {
      const imageWidth = this.image.nativeElement.width;
      const imageHeight = this.image.nativeElement.height;
      this.isHorizontalImage = imageHeight < imageWidth;
    }
  }

  getSiteName(url) {
    if (!url) {
      return;
    }
    return this.extractHostname(url);
  }

  extractHostname(url) {
    let hostname;
    if (url.indexOf('//') > -1) {
      hostname = url.split('/')[2];
    } else {
      hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    if (hostname.split('.').length >= 3) {
      hostname = hostname.slice(hostname.indexOf('.') + 1);

    }
    return hostname;
  }

}
