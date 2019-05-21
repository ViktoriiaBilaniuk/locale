import { Component, OnInit, ViewChild, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import * as noUiSlider from 'nouislider';

@Component({
  selector: 'sl-time-slider',
  templateUrl: './time-slider.component.html',
  styleUrls: ['./time-slider.component.scss']
})
export class TimeSliderComponent implements OnInit, OnChanges {
  from: any;
  to: any;
  values: any;
  @ViewChild('slider') slider;
  @Input() hours: any;
  @Input() item: boolean;
  @Input() sliderMode: boolean;
  @Input() top: number;
  @Output() change = new EventEmitter();
  element: any;
  constructor() { }

  ngOnInit() {
    this.setValues(this.hours && this.hours.length ? this.hours : [ 540, 1080 ]);
  }

  ngOnChanges (changes) {
    if (changes.hours && this.element) {
      this.element.noUiSlider.set(this.hours);
    }
  }

  setValues (values) {
    this.values = values;
    this.slide();
    this.createSlider();
  }

  createSlider() {
    this.element = this.slider.nativeElement.getElementsByClassName('slider')[0];
    noUiSlider.create(this.element, {
      start: this.values,
      step: 15,
      range: {
        'min': 0,
        'max': 1440
      },
      connect: true
    });
    // @ts-ignore
    this.element.noUiSlider.on('update', (values) => {
      this.values = values;
      this.slide();
      this.change.emit({values: this.values});
    });
  }

  private slide () {
    const fromHours = Math.floor(this.values[0] / 60);
    const fromMinutes = this.values[0] - (fromHours * 60);
    const toHours = Math.floor(this.values[1] / 60);
    const toMinutes = this.values[1] - (toHours * 60);
    this.updateFrom(fromHours, fromMinutes);
    this.updateTo(toHours, toMinutes);
  }

  private updateFrom (hours, minutes) {
    const fromHours = this.formatValue(hours);
    const fromMinutes = this.formatValue(minutes);
    this.from = `${fromHours} : ${fromMinutes}`;
  }

  private formatValue (value) {
    return value < 10 ? `0${value}` : value;
  }

  private updateTo (hours, minutes) {
    const toHours = this.formatValue(hours);
    const toMinutes = this.formatValue(minutes);
    this.to = `${toHours} : ${toMinutes}`;
  }

}
