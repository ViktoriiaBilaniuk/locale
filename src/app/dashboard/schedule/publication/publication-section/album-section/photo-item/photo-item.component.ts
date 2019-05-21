import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sl-photo-item',
  templateUrl: './photo-item.component.html',
  styleUrls: ['./photo-item.component.scss']
})
export class PhotoItemComponent {
  @Input() file;
  @Output() remove = new EventEmitter();

  removeFile() {
    this.remove.emit();
  }

}
