import { Component, Output, EventEmitter, Input } from '@angular/core';
import { PERFORMANCE_DROPDOWN_CONSTANTS } from '../performance.constants';

@Component({
  selector: 'sl-performance-modal-filter',
  templateUrl: './performance-modal-filter.component.html',
  styleUrls: ['./performance-modal-filter.component.scss']
})
export class PerformanceModalFilterComponent {
  @Input() currentPostFilter;
  @Output() applyFilter = new EventEmitter();
  performanceMenuIsActive: Boolean;
  options  = PERFORMANCE_DROPDOWN_CONSTANTS;

  togglePerformanceMenu(event) {
    event.stopPropagation();
    this.performanceMenuIsActive = !this.performanceMenuIsActive;
  }

  onClickedOutside(event) {
    event.stopPropagation();
    this.performanceMenuIsActive = false;
  }

  changeOptionAndCloseMenu(option) {
    this.applyFilter.emit(option.option);
    this.performanceMenuIsActive = option.menuIsActive;
  }

}
