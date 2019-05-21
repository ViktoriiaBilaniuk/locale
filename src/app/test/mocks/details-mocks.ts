import { VenueDetails } from '../../models/right-sidebar/venue-details/venue-details';
import { DetailsMenu } from '../../models/right-sidebar/venue-details/details-menu';
import { TimeEntry } from '../../models/right-sidebar/venue-details/time-enrty';

export const VENUE_DETAILS_MOCK = {
  id: '1',
  name: 'Details',
  brand_guidelines: 'brand',
  current_objective: 'obj',
  special_offers: 'offers',
  opening_hours: [{
    weekday: 'Monday',
    is_open: 1,
    order: 1,
    items: [{
      label: 'item1',
      order: 1,
      from: 123,
      to: 234
    }]
  }],
  menus: [{
    name: 'menu',
    source: 'src'
  }],
} as VenueDetails;

export const DETAILS_MENU_MOCK = {
  name: 'name',
  source: 'source.pdf',
} as DetailsMenu;

export const TIME_ENTRY_EDITOR = {
  fromMoment: null,
  toMoment: null,
  fromLabel: '9',
  toLabel: '18',
  label: null,
  selected: false
};

export const OPENING_HOURS_EDITOR = {
  selected: false,
  items: [TIME_ENTRY_EDITOR],
  sliderMode: true,
  index: 1,
};
export const OPENING_HOURS_EDITOR_RESULT = [{
  selected: false,
  items: [TIME_ENTRY_EDITOR],
  sliderMode: false,
  index: null,
}];
export const TIME_EDITOR = [OPENING_HOURS_EDITOR];

export const TIME_ENTRY_MOCK: TimeEntry = {
  label: 'label',
  order: 1,
  from: 2,
  to: 3,
};


export const getDay = (day) => {
  return {
    weekday: day,
    is_open: 1,
    order: 1,
    selected: true,
    items: [TIME_ENTRY_MOCK],
  };
};


export const TIMETABLE_MOCK = [
  getDay('Monday'),
  getDay('Tuesday'),
  getDay('Wednesday'),
  getDay('Thursday'),
  getDay('Friday'),
  getDay('Saturday'),
  getDay('Sunday'),
];


export const WEEKDAY_MOCK = {
  weekday: 'Monday',
  is_open: 1,
  order: 1,
  selected: true,
  items: [TIME_ENTRY_MOCK],
};

export const TARGET_MARKET_DATA = ['item1', 'item2'];

export const FORMED_TARGET_MARKET_DATA = [
  {value: 'item1', title: 'Item1'},
  {value: 'item2', title: 'Item2'},
];

export const TARGET_MARKET_ITEM = 'item';

export const FORMED_OBJECT_TARGET_MARKET = {value: 'item', title: 'Item'};

export const DEFAULT_OPTIONS_CHAT_INPUT = [
  { value: 'val1' },
  { value: 'val2' }
];

export const VENUE_OPTIONS_CHAT_INPUT = [
  { value: 'val1' }
];

export const SUGGESTIONS_CHAT_INPUT = [
  { value: 'val2' }
];

export const DEFAULT_VENUE_OPTIONS_CHAT_INPUT = [
  {value: 'item1', title: 'Item1'},
  {value: 'item2', title: 'Item2'},
];

export const LINK_MOCK = {
  url: 'url',
  name: 'name'
};

export const NAMED_LINK_FORM = {
  value: LINK_MOCK,
  controls: LINK_MOCK,
  patchValue: () => {},
  valid: true,
} as any;
