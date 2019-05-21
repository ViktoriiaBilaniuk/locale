import { Component, OnInit, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

const isChrome = window.navigator.userAgent.includes('Chrome');
const animationTime = isChrome ? 500 : 0;
const animationString = `${animationTime}ms ease-in`;

@Component({
  selector: 'sl-media-viewer',
  templateUrl: './media-viewer.component.html',
  styleUrls: ['./media-viewer.component.scss'],
  animations: [
    trigger('mediaChange', [
      state('previous', style({
        transform: 'translateX(-360px)',
        opacity: '0'
      })),
      state('current', style({
        transform: 'translateX(0)',
        opacity: '1'
      })),
      state('next', style({
        transform: 'translateX(360px)',
        opacity: '0'
      })),
      transition('current => previous', animate(animationString)),
      transition('previous => current', animate( animationString)),
      transition('current => next', animate( animationString)),
      transition('next => current', animate(animationString)),
    ])
  ]
})
export class MediaViewerComponent implements OnInit {
  private videoBackground = 'assets/images/dashboard/video-background.jpg';
  current = 0;
  @Input() slides: any;
  sources = [];

  constructor() { }

  ngOnInit() {
    this.setSources();
    if (this.sources.length !== 1) {
      this.setupCarousel();
    }
  }

  private setSources () {
    this.sources = this.slides.map((source) => ({...source}));
    // for consistent animation during navigation min slides count is 3.
/*    if (this.sources.length === 2) {
      this.sources = [...this.sources, ...this.sources.map((source) => ({...source}))];
    }*/
  }

  private setupCarousel () {
    this.setStatus('next');
    this.sources[this.current].status = 'current';
    this.sources[this.sources.length - 1].status = 'previous';
  }

  next () {
    const previous = this.current;
    this.current = this.sources.length - 1 === this.current ? 0 : this.current + 1;
    this.setStatus('next');
    this.sources[previous].status = 'previous';
    this.sources[this.current].status = 'current';
  }

  back () {
    const next = this.current;
    this.current =  this.current === 0 ? this.sources.length - 1 : this.current - 1;
    this.setStatus('previous');
    this.sources[next].status = 'next';
    this.sources[this.current].status = 'current';

  }

  private setStatus (status: string) {
    this.sources.forEach((source, i) => {
      source.status = status;
    });
  }

  getBackgroundUrl (source) {
    return source.type === 'picture' ?
      source.url :
      this.videoBackground;
  }

}
