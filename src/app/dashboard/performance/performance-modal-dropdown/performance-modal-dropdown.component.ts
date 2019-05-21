import { Component, Output, EventEmitter } from '@angular/core';
import { PERFORMANCE_DROPDOWN_CONSTANTS } from '../../performance/performance.constants';
@Component({
  selector: 'sl-performance-modal-dropdown',
  templateUrl: './performance-modal-dropdown.component.html',
  styleUrls: ['./performance-modal-dropdown.component.scss']
})
export class PerformanceModalDropdownComponent {
  @Output() onChangeOptionAndCloseMenu = new EventEmitter();
  options = PERFORMANCE_DROPDOWN_CONSTANTS;

  optionClick(option) {
    this.onChangeOptionAndCloseMenu.emit({option: option, menuIsActive: false});
  }

}
