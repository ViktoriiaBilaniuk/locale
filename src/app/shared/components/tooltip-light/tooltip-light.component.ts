import { Component, Input } from '@angular/core';

@Component({
  selector: 'sl-tooltip-light',
  templateUrl: './tooltip-light.component.html',
  styleUrls: ['./tooltip-light.component.scss']
})
export class TooltipLightComponent {

  @Input() content: string;
  @Input() top: string;
  @Input() hover: string;

}
