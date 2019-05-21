import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sl-code-title',
  templateUrl: './code-title.component.html',
  styleUrls: ['./code-title.component.scss']
})
export class CodeTitleComponent {

  @Output() closeCodeModal = new EventEmitter();

  closeViewCodeModal() {
    this.closeCodeModal.emit();
  }

}
