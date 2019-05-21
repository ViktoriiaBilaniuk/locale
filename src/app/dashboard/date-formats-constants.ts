import {NativeDateAdapter} from '@angular/material';
import * as moment from 'moment';
import { Injectable } from '@angular/core';

export const DATE_FORMAT = 'DD/MM/YYYY';
export const MONTH_NAME_DATE_FORMAT = 'DD MMMM YYYY';
export const HOUR_FORMAT = 'HH:mm';
export const LONG_DATE_FORMAT = 'DD/MM/YYYY HH:mm';

export const DD_MM_YYYY_Format = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const MONTH_NAME_Format = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD MMMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    return moment(date).format(DATE_FORMAT);
  }
}

@Injectable()
export class CustomDateAdapterMonthName extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    return moment(date).format(MONTH_NAME_DATE_FORMAT);
  }
}
