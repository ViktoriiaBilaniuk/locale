import * as moment from 'moment';

export interface Datepicker {
  value: moment.Moment;
  min: moment.Moment;
  max: moment.Moment;
}
