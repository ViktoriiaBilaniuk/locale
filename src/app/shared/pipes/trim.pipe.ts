import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'trim'})
export class TrimPipe implements PipeTransform {
  transform(value: string, before, after , str = '...'): string {
    const radix = 10;
    const resultStringLength = parseInt(before, radix) + parseInt(after, radix) + String(str).length + 2;

    if (String(value).length > resultStringLength) {
      const splitedName = value.split('');
      // tslint:disable-next-line:max-line-length
      splitedName.splice(parseInt(before, radix), String(value).length - resultStringLength + (String(str).length + 2), ` ${str} `);
      return splitedName.join('');
    } else {
      return value;
    }
  }
}
