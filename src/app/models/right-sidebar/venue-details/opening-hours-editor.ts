import { Moment } from 'moment';

import { OpeningHours } from './opening-hours';
import { TimeEntryEditor } from './time-entry-editor';

export interface OpeningHoursEditor extends OpeningHours {
  selected: boolean;
  items: TimeEntryEditor[];
  sliderMode: boolean;
  index: number;
}
