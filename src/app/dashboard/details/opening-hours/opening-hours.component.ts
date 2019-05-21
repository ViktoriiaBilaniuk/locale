import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { OpeningHours } from './../../../models/right-sidebar/venue-details/opening-hours';
import { TimeEntry } from '../../../models/right-sidebar/venue-details/time-enrty';
import { OpeningHoursEditor } from './../../../models/right-sidebar/venue-details/opening-hours-editor';
import { TimeEntryEditor } from './../../../models/right-sidebar/venue-details/time-entry-editor';
import * as moment from 'moment';

@Component({
  selector: 'sl-opening-hours',
  templateUrl: './opening-hours.component.html',
  styleUrls: ['./opening-hours.component.scss']
})
export class OpeningHoursComponent implements OnChanges {
  @Input() timetable: OpeningHours[] = [];
  @Input() canEdit: boolean;
  @Output() onEdit = new EventEmitter<OpeningHours[]>();
  moment = moment;
  editMode = false;
  sliderMode = false;
  editableHours = [];

  // duplicate of timetable with additional fields to handle changes of inputs
  timeEditor: OpeningHoursEditor[] = [];

  ngOnChanges(changes) {
    if (changes.timetable && changes.timetable.currentValue) {
      this.onCancelClick();
    }
  }

  toggleSliderMode (weekday, item, index) {
    this.timeEditor
      .filter((day) => day !== weekday)
      .forEach((day) => {
      day.sliderMode = false;
      day.index = null;
    });

    if (weekday.selected) {
      this.editableHours = item.values;
      weekday.sliderMode = weekday.index !== index;
      weekday.index = weekday.sliderMode ? index : null;
    }
  }

  changeTime (item, values) {
    if (!item) {
      return;
    }
    const fromHours = Math.floor(values[0] / 60);
    const fromMinutes = values[0] - (fromHours * 60);
    const toHours = Math.floor(values[1] / 60);
    const toMinutes = values[1] - (toHours * 60);
    item.fromMoment.hours(fromHours);
    item.fromMoment.minutes(fromMinutes);
    item.from = item.fromMoment.valueOf();
    item.toMoment.hours(toHours);
    item.toMoment.minutes(toMinutes);
    item.to = item.toMoment.valueOf();
    item.fromLabel = this.createTimeStringFromMoment(item.fromMoment);
    item.toLabel = this.createTimeStringFromMoment(item.toMoment);
    item.values = values.slice();
  }


  /**
   * @description
   * input[type=time] change value listener
   * Reset values for current time entry of some day in the week
   *
   * @memberof OpeningHoursComponent
   *
   * @param event change event
   * @param timeEntry the time entry values for current opening hours
   * @param valueType 'from' or 'to' value - defines which of time inputs are handling
   */
  onTimePickerChange(event, timeEntry: TimeEntryEditor, valueType: string) {
    const momentValue = moment(event.target.value, 'HH:mm');
    timeEntry[`${valueType}Moment`] = momentValue;
    timeEntry[valueType] = momentValue.valueOf();
  }

  /**
   * @description
   * Save button click listener
   * Emits timeEditor to parent component
   *
   * @memberof OpeningHoursComponent
   */
  onSaveClick() {
    this.editMode = false;
    this.timeEditor = this.timeEditor.map((day) => this.reorderDay(day));
    this.onEdit.emit(this.timeEditor);
  }

  /**
   * @description
   * Cancel button click listener
   * reset configuration for timeEditor entity
   *
   * @memberof OpeningHoursComponent
   */
  onCancelClick() {
    this.editMode = false;
    this.timeEditor = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      .map((weekday) => this.createTimeEditorEnrty(weekday));
  }

  /**
   * @description
   * Add time entry to some day of week
   *
   * @memberof OpeningHoursComponent
   *
   * @param day the OpeningHours entry of week
   */
  addTimeEntry(day: OpeningHours) {
    if (day.items.length < 10) {
      day.items.push(this.createNewTimeEntry());
    }
  }

  /**
   * @description
   * Removes TimeEntry from day in week
   *
   * @memberof OpeningHoursComponent
   *
   * @param day the OpeningHours day entry of week
   * @param index the index of entry that should be removed
   */
  removeTimeEntry(day: OpeningHoursEditor, index: number) {
    day.items.splice(index, 1);
  }

  /**
   * @description
   * Create the copy of timetable
   * fill it with additional information to manage the time editor
   *
   * @memberof OpeningHoursComponent
   *
   * @param weekday name of weekday [monday...sunday]
   * @returns new OpeningHours entry with necessary information
   */
  createTimeEditorEnrty(weekday: string): OpeningHoursEditor {
    const day = Object.assign({}, this.timetable.find((item) => item.weekday.toLowerCase() === weekday.toLowerCase()));
    day.items = day.items.map((item) => this.createNewTimeEntry(item));
    return Object.assign(day, {
      selected: day.is_open ? true : false,
      items: day.items.length ? day.items : [this.createNewTimeEntry()]
    }) as OpeningHoursEditor;
  }

  /**
   * @description
   * Creates a new TimeEntry entity or modifies existing TimeEntry if such passed as parameter
   *
   * @memberof OpeningHoursComponent
   *
   * @param existingEntry the TimeEntry that already exists and needs to be converted
   * @returns new TimeEntry with start time as 9AM and end time as 6PM or existing modified TimeEntry entity
   */
  private createNewTimeEntry(existingEntry?: TimeEntry): TimeEntryEditor {
    return existingEntry ? Object.assign({}, existingEntry, {
      from: moment(existingEntry.from).valueOf(),
      to: moment(existingEntry.to).valueOf(),
      fromMoment: moment(existingEntry.from),
      values: this.getValues(existingEntry),
      toMoment: moment(existingEntry.to),
      fromLabel: this.createTimeStringFromMoment(moment(existingEntry.from)),
      toLabel: this.createTimeStringFromMoment(moment(existingEntry.to))
    }) as TimeEntryEditor : {
      order: 0,
      from: moment().hours(9).startOf('hour').valueOf(),
      to: moment().hours(18).startOf('hour').valueOf(),
      values: [ 540, 1080 ],
      fromMoment: moment().hours(9).startOf('hour'),
      toMoment: moment().hours(18).startOf('hour'),
      label: '',
      fromLabel: '09:00',
      toLabel: '18:00'
    } as TimeEntryEditor;
  }

  getValues (entry) {
    const from = moment(entry.from);
    const to = moment(entry.to);
    const fromValue = from.hours() * 60 + from.minutes();
    const toValue = to.hours() * 60 + from.minutes();
    return [fromValue, toValue];
  }

  /**
   * @description
   * Represent moment() entry as string in format HH:MM
   *
   * @memberof OpeningHoursComponent
   *
   * @param moment moment to convert
   * @returns string in format 'HH:MM'
   */
  private createTimeStringFromMoment(time: moment.Moment): string {
    return `${(time.hours() > 9 ? '' : '0') + time.hours()}:${(time.minutes() > 9 ? '' : '0') + time.minutes()}`;
  }

  /**
   * @description
   * change TimeEntry order value so their order will not be mixed
   *
   * @memberof OpeningHoursComponent
   *
   * @param day day of the week
   * @returns OpeningHoursEditor entry with reordered opening hours
   */
  private reorderDay(day: OpeningHoursEditor): OpeningHoursEditor {
    day.items.forEach((item, i) => Object.assign(item, { order: i }));
    return day;
  }
}
