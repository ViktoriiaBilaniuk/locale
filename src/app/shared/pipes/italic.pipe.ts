import { Pipe, PipeTransform } from '@angular/core';
import { TransformTextService } from '../services/transform-text.service';

@Pipe({
  name: 'italic'
})
export class ItalicPipe implements PipeTransform {

  constructor(private transformService: TransformTextService) {}

  transform(txt: string): string {

    const result = this.transformService.formatText('_', 'em', txt);
    return result;

  }

}
