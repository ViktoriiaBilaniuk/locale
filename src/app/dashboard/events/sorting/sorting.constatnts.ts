import { EVENTS_CONSTANTS } from '../events.constants';

export const EVENT_SORTING_CONSTANTS = {
  AVAILABLE_OPTIONS: [
    { value: EVENTS_CONSTANTS.SORTING_OPTIONS.DISTANCE, title: 'Events.distance', selected: true },
    { value: EVENTS_CONSTANTS.SORTING_OPTIONS.RELEVANCE, title: 'Events.relevance', selected: false},
  ]
};
