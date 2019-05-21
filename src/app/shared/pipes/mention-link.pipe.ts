import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mentionLink'
})
export class MentionLinkPipe implements PipeTransform {

  transform(value: any, mentions: any): any {
    if (!value) {
      return;
    }
    if (!mentions || !mentions.length) {
      return value;
    }
    const initialText = value;
    mentions.forEach(mention => {
      const initFrom = mention.offset;
      const initTo = mention.offset + mention.length;
      const mentionValue = initialText.substring(initFrom, initTo);
      value = value.replace(mentionValue, `<a class="mention-link" target="_blank" href="${mention.permalink}">${mentionValue}</a>`);
    });
    return value;
  }

}
