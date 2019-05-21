import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CONSTANTS } from '../../../core/constants';

@Component({
  selector: 'sl-view-code-modal',
  templateUrl: './view-code-modal.component.html',
  styleUrls: ['./view-code-modal.component.scss']
})
export class ViewCodeModalComponent {

@Input() venuePublicId: string;
@Input() type: string;
@Output() close = new EventEmitter();

hideModal() {
  this.close.emit();
}

get codeSnippet() {
  return CONSTANTS.TRACKING_CODE
    .replace('TYPE', this.type)
    .replace('VENUE_PUBLIC_ID', this.venuePublicId)
    .replace('TRACKING_SCRIPT', CONSTANTS.TRACKING_SCRIPT);
}

}
