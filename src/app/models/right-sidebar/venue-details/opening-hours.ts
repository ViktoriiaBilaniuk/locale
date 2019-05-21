import { TimeEntry } from './time-enrty';

export interface OpeningHours {
  weekday: string;
  is_open: number;
  order: number;
  items: TimeEntry[];
}
