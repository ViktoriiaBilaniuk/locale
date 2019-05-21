import { Component, Input } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'sl-code-body',
  templateUrl: './code-body.component.html',
  styleUrls: ['./code-body.component.scss']
})
export class CodeBodyComponent {
  @Input() codeSnippet: string;
  @Input() type: string;
  isAnimation;

  constructor(private _clipboardService: ClipboardService) {}

  copyCode() {
    if (this.codeSnippet) {
      this._clipboardService.copyFromContent(this.codeSnippet);
      this.setAnimationOnTooltip();
    }
  }

  setAnimationOnTooltip() {
    this.isAnimation = true;
  }

  resetAnimationOnTooltip() {
    this.isAnimation = false;
  }

}
