import { Injectable } from '@angular/core';

@Injectable()
export class TransformTextService {

  formatText(symb, tag, txt) {

  class Token {
    type;
    text;
    constructor(type, text) {
      this.type = type;
      this.text = text;
    }
  }

  const tokenize = (text) => {
    let chunk;
    let i = 0;
    const tokens = [];

    const delimited = (delim, type) => {
      const delimIndex = chunk.indexOf(delim);
      if (
        chunk[delimIndex] === delim &&
        chunk[delimIndex + 1] !== delim &&
        chunk[delimIndex + 1] !== ' ' &&
        chunk[chunk.indexOf(delim, delimIndex + 1) + 1] !== delim
       ) {
        const firstChunk = chunk.slice(0, delimIndex);
        if (firstChunk.length && chunk.indexOf(delim, delimIndex + 1) !== -1 ) {
          tokens.push(new Token('word', firstChunk));
        }
        const end = chunk.indexOf(delim, delimIndex + 1);
        if (end !== -1) {
          tokens.push(new Token(type, chunk.slice(delimIndex + 1, end)));
          i += end + 1;
          return true;
        }
      }
    };

    const space = () => {
      const m = /^\s+/.exec(text.slice(i));
      if (m) {
        tokens.push(new Token('word', m[0]));
        i += m[0].length;
      }
    };

    while (chunk = text.slice(i)) {
      const found = delimited(symb, tag);
      if (!found) {
        let end = chunk.indexOf(' ', 1) + 1;
        if (end === 0) {
          end = chunk.length;
        }
        tokens.push(new Token('word', chunk.slice(0, end)));
        i += end;
      }

      space();
    }
    return tokens;
  };

  const transformText = (text) => {
    return tokenize(text).reduce((str, tok) => {
      return str + (tok.type === tag ? `<${tag}>${transformText(tok.text)}</${tag}>` : tok.text);
    }, '');
  };

  const result = transformText(txt);
  return result;


  }
}
