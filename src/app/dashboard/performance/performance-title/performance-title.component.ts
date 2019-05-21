import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sl-performance-title',
  templateUrl: './performance-title.component.html',
  styleUrls: ['./performance-title.component.scss']
})
export class PerformanceTitleComponent implements OnInit {
  @Input() title;

  constructor() { }

  ngOnInit() {
  }

}
