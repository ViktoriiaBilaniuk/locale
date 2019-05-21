import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sl-performance-modal',
  templateUrl: './performance-modal.component.html',
  styleUrls: ['./performance-modal.component.scss']
})
export class PerformanceModalComponent {
  @Output() close = new EventEmitter();

  hideModal() {
    this.close.emit();
  }

}
