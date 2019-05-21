import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reference'
})
export class ReferencePipe implements PipeTransform {

  transform(value: any, path: string = '/'): any {
    if (!value) {
      return;
    }
    const replacedText = value.replace( /@(\w+)/gi, `<a class="insta-tag" href="${path}$1">@$1</a>`);
    return replacedText;
  }


}
