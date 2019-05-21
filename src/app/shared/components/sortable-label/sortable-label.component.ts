import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sl-sortable-label',
  templateUrl: './sortable-label.component.html',
  styleUrls: ['./sortable-label.component.scss']
})
export class SortableLabelComponent implements OnInit {
  @Input() order: string;
  constructor() { }

  ngOnInit() {
  }

}
