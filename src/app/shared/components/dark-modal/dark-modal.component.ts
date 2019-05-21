import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sl-dark-modal',
  templateUrl: './dark-modal.component.html',
  styleUrls: ['./dark-modal.component.scss']
})
export class DarkModalComponent implements OnInit {

  @Output() close = new EventEmitter();
  @Input() title;
  @Input() width;

  constructor() { }

  ngOnInit() {
  }

  hideModal() {
    this.close.emit();
  }

}
