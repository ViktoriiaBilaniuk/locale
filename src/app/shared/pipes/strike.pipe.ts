import { Pipe, PipeTransform } from '@angular/core';
import { TransformTextService } from '../services/transform-text.service';

@Pipe({
  name: 'strike'
})
export class StrikePipe implements PipeTransform {

  constructor(private transformService: TransformTextService) {}

  transform(txt: string): string {

    const result = this.transformService.formatText('~', 'del', txt);
    return result;

  }

}
