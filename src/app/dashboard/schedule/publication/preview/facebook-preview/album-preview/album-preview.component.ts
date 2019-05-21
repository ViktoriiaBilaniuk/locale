import { Component, Input, OnInit } from '@angular/core';
import { PublicationProxyService } from '../../../../../../core/services/publication/publication-proxy.service';
import { fadeInAnimation } from '../../../../../../shared/animations/fade-in.animation';

@Component({
  selector: 'sl-album-preview',
  templateUrl: './album-preview.component.html',
  styleUrls: ['./album-preview.component.scss'],
  animations: [fadeInAnimation],
})
export class AlbumPreviewComponent implements OnInit {
  @Input() desktopMode;

  constructor(public publicationProxyService: PublicationProxyService) { }

  ngOnInit() {
  }

  getVerticalImage(img) {
    return img.height > img.width;
  }

  getHorizontalImage(img) {
    return img.width > img.height;
  }

  getSquareImage(img) {
    return img.width === img.height;
  }

  getImagesClass(value) {
    if (!this.publicationProxyService.albumFiles[0].url) {
      return;
    }
    switch (value) {
      case 2: return this.getTwoImagesClass(this.getFirstImage());
      case 3: return this.getThreeImagesClass(this.getFirstImage());
      case 4: return this.getForImagesClass(this.getFirstImage());
    }
  }

  getFirstImage() {
    const img = new Image();
    img.src = this.publicationProxyService.albumFiles[0].url;
    return img;
  }

  getTwoImagesClass(img) {
    return {
      'album__2_vertical': this.getVerticalImage(img),
      'album__2_horizontal': this.getHorizontalImage(img),
      'album__2_square': this.getSquareImage(img)
    };
  }

  getThreeImagesClass(img) {
    return {
      'album__3_vertical': this.getVerticalImage(img),
      'album__3_horizontal': this.getHorizontalImage(img),
      'album__3_square': this.getSquareImage(img)
    };
  }

  getForImagesClass(img) {
    return {
      'album__4_vertical': this.getVerticalImage(img),
      'album__4_horizontal': this.getHorizontalImage(img),
      'album__4_square': this.getSquareImage(img)
    };
  }

  getAlbumTitle() {
    return this.publicationProxyService.albumName ? this.publicationProxyService.albumName : 'Untitled album';
  }

  numberOfPhotos() {
    return this.publicationProxyService.albumFiles.length;
  }

}
