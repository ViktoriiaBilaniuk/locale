import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'sl-performance-modal-header',
  templateUrl: './performance-modal-header.component.html',
  styleUrls: ['./performance-modal-header.component.scss']
})
export class PerformanceModalHeaderComponent {
  @Input() selectedChannel;
  @Output() close = new EventEmitter;

  closePerformanceModal() {
    this.close.emit();
  }
}
