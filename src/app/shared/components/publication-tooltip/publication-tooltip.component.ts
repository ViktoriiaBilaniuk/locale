import { Component, Input } from '@angular/core';

@Component({
  selector: 'sl-publication-tooltip',
  templateUrl: './publication-tooltip.component.html',
  styleUrls: ['./publication-tooltip.component.scss']
})
export class PublicationTooltipComponent  {
  @Input() content: string;
  @Input() top: number;
  @Input() right: number;
  @Input() visible: boolean;
}
