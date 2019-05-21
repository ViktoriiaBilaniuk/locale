import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sl-new-tab-wrapper',
  templateUrl: './new-tab-wrapper.component.html',
  styleUrls: ['./new-tab-wrapper.component.scss']
})
export class NewTabWrapperComponent implements OnInit {
  @Input() url: string;
  constructor() { }

  ngOnInit() {
  }

}
