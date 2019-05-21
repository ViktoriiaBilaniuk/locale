import { Pipe, PipeTransform } from '@angular/core';
import * as  moment from 'moment';

@Pipe({
  name: 'postDate'
})
export class PostDatePipe implements PipeTransform {

  transform(utcTimestamp: any, network: string): any {
    if (!utcTimestamp || !network) {
      return;
    }
    return utcTimestamp.format(this.getDateFormat(network));
  }

  getDateFormat(network) {
    switch (network) {
      case 'facebook': return 'MMMM DD [at] hh:mm A';
      case 'instagram': return 'DD MMMM [at] HH:mm';
      case 'twitter': return 'DD MMM HH:mm';
    }
  }

}
