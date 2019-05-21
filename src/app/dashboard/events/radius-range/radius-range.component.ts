import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EVENTS_CONSTANTS } from '../events.constants';
import { CalendarService } from '../../../core/services/calendar/calendar.service';

@Component({
  selector: 'sl-radius-range',
  templateUrl: './radius-range.component.html',
  styleUrls: ['./radius-range.component.scss']
})
export class RadiusRangeComponent implements OnInit {

  @Output() onSliderChange = new EventEmitter<any>();

  max = EVENTS_CONSTANTS.MAX_RADIUS;
  min = EVENTS_CONSTANTS.MIN_RADIUS;

  constructor(public calendarService: CalendarService) { }

  ngOnInit() {
    this.onSliderChange.emit({value: this.calendarService.sliderValue * 1000, init: true});
  }

  onChangeSlider() {
    this.onSliderChange.emit({value: this.calendarService.sliderValue * 1000, init: false});
  }

}
