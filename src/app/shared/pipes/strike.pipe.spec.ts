import { StrikePipe } from './strike.pipe';
import { TransformTextService } from '../services/transform-text.service';

describe('StrikePipe', () => {
  let pipe;

  const FORMAT_CONSTANTS = [
    { label: 'strike', text: '~strike~', tag: 'del' },
    { label: '~~test', text: '~~test', tag: '' },
    { label: 'test', text: 'test', tag: '' },
    { label: '~~', text: '~~', tag: '' }
  ];

  const transformTextService = new TransformTextService();

  beforeEach(() => {
    pipe = new StrikePipe(transformTextService);
  });

  afterEach(() => {
    pipe = null;
  });

  describe('should check text formatting', () => {

    FORMAT_CONSTANTS.forEach((format) => {
      it(`should return ${format.label} text`, () => {
        const result = pipe.transform(format.text);
        if (format.tag) {
          expect(result).toBe(`<${format.tag}>${format.label}</${format.tag}>`);
        } else {
          expect(result).toBe(`${format.text}`);
        }
      });
    });

    it('should return nested tags', () => {
      const text = '<strong>~Text~</strong>';
      const expectedText = '<strong><del>Text</del></strong>';
      const result = pipe.transform(text);
      expect(result).toBe(expectedText);
    });


    it('should return plain text ~text*', () => {
      const text = '~text*';
      const expectedText = '~text*';
      const result = pipe.transform(text);
      expect(result).toBe(expectedText);
    });

    it('should return plain text ~text~~', () => {
      const text = '~text~~';
      const expectedText = '~text~~';
      const result = pipe.transform(text);
      expect(result).toBe(expectedText);
    });

    it('should return formated text', () => {
      const text = '<em>~TEST~</em>  <em>TEST</em>';
      const expectedText = '<em><del>TEST</del></em>  <em>TEST</em>';
      const result = pipe.transform(text);
      expect(result).toBe(expectedText);
    });

    it('should return formated text ~*TEST*~ TEST~~', () => {
      const text = '~<strong>TEST</strong>~ TEST~~';
      const expectedText = '<del><strong>TEST</strong></del> TEST~~';
      const result = pipe.transform(text);
      expect(result).toBe(expectedText);
    });


    it('should return plain text ~test~~ test~~', () => {
      const text = '~test~~ test~~';
      const expectedText = '~test~~ test~~';
      const result = pipe.transform(text);
      expect(result).toBe(expectedText);
    });

  });

});
