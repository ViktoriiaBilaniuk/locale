import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limit'
})
export class LimitPipe implements PipeTransform {

  transform(description: any, descriptionLimit: any, descriptionLimitRows: any): any {
    if (!description) {
      return;
    }
    description = description.trim();
    if (description.length > descriptionLimit) {
      return description.substring(0, descriptionLimit);
    }
    const descElements = description.split('\n');
    let res = '';
    if (descElements.length > descriptionLimitRows) {
      descElements.forEach((elem, i) => {
        if (i < descriptionLimitRows - 1) {
          res = res + elem + '\n';
        }
        if (i === descriptionLimitRows - 1 ) {
          res = res + elem;
        }
      });
      return res;
    }
    return description;
  }
}
