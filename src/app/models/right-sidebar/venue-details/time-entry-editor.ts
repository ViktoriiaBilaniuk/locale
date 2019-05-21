import { Moment } from 'moment';

import { TimeEntry } from './time-enrty';

export interface TimeEntryEditor extends TimeEntry {
  fromMoment: Moment;
  toMoment: Moment;
  fromLabel?: string;
  toLabel?: string;
}
