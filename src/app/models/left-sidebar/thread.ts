import { Venue } from './venue';

export interface Thread {
  title: string;
  emptyText?: string;
  highlightActive?: boolean;
  venues: Venue[];
  isUnanswered?: boolean;
}
