import { Pipe, PipeTransform } from '@angular/core';
import { TransformTextService } from '../services/transform-text.service';

@Pipe({
  name: 'bold'
})
export class BoldPipe implements PipeTransform {

  constructor(private transformService: TransformTextService) {}

  transform(txt: string): string {
    const result = this.transformService.formatText('*', 'strong', txt);
    return result;
  }

}
