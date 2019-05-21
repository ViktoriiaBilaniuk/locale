import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'sl-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {
  @Input() venueId;
  @Input() expand;

  constructor() { }

  ngOnInit() {
  }

}
