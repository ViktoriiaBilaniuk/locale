import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sl-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.scss']
})
export class TagFilterComponent implements OnInit {
  @Input() content;
  @Output() remove = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onRemoveClick () {
    this.remove.emit();
  }

}
