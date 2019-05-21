import {
  Component,
  Input,
  OnChanges,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  HostListener,
  ViewChild,
  ElementRef
} from '@angular/core';
import { OBJECTIVE_CONSTANTS } from './objective-constants';

@Component({
  selector: 'sl-objective',
  templateUrl: './objective.component.html',
  styleUrls: ['./objective.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectiveComponent implements OnChanges {
  @Input() objective: string;
  @Input() canEdit: boolean;
  @Output() onEdit = new EventEmitter<string>();
  @ViewChild('objectiveRef') objectiveRef: ElementRef;

  /* START: dropdown settings */
  editMode = false;
  availableOptions = OBJECTIVE_CONSTANTS.AVAILABLE_OPTIONS;
  dropdownPosition = '40px 0px 0px -120px';
  /* END: dropdown settings */

  ngOnChanges() {
    this.editMode = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: Event) {
    if (this.objectiveRef && !this.objectiveRef.nativeElement.contains(e.target)) {
      this.editMode = false;
    }
  }

  onChangeOption(option: string) {
    this.editMode = false;
    this.onEdit.emit(option);
  }
}
