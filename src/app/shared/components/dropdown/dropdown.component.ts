import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sl-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  @Input() options;
  @Input() show;
  @Input() position;
  @Output() onChangeOption = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  optionClick(option) {
    this.onChangeOption.emit(option);
  }

}
