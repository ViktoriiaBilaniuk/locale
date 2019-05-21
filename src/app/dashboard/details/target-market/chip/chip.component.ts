import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sl-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent {
  @Input() icon: string;
  @Input() value: any;
  @Output() remove = new EventEmitter();

  removeItem() {
    this.remove.emit();
  }

}
