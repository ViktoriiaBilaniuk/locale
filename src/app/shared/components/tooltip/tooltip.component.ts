import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sl-tooltip',
  template: `
  <div class="tooltip">
    <p translate>{{ content }}</p>
  </div>
  `,
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {

  @Input() content: string;

  constructor() { }

  ngOnInit() {
  }
}
