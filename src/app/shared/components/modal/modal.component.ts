import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sl-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Output() close = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  hideModal() {
    this.close.emit();
  }

}
