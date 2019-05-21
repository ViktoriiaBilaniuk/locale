import { ItalicPipe } from './italic.pipe';
import { TransformTextService } from '../services/transform-text.service';

describe('ItalicPipe', () => {
  let pipe;

  const FORMAT_CONSTANTS = [
    { label: 'italic', text: '_italic_', tag: 'em' },
    { label: '__test', text: '__test', tag: '' },
    { label: 'test', text: 'test', tag: '' },
    { label: '__', text: '__', tag: '' }
  ];

  const transformTextService = new TransformTextService();

  beforeEach(() => {
    pipe = new ItalicPipe(transformTextService);
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
      const text = '<strong>_Text_</strong>';
      const expectedText = '<strong><em>Text</em></strong>';
      const result = pipe.transform(text);
      expect(result).toBe(expectedText);
    });

    it('should return plain text *text_', () => {
      const text = '*text_';
      const expectedText = '*text_';
      const result = pipe.transform(text);
      expect(result).toBe(expectedText);
    });

    it('should return plain text _text__', () => {
      const text = '_text__';
      const expectedText = '_text__';
      const result = pipe.transform(text);
      expect(result).toBe(expectedText);
    });

    it('should return formated text', () => {
      const text = '<strong>_TEST_</strong>  <strong>TEST</strong>';
      const expectedText = '<strong><em>TEST</em></strong>  <strong>TEST</strong>';
      const result = pipe.transform(text);
      expect(result).toBe(expectedText);
    });

    it('should return formated text _*TEST*_ TEST__', () => {
      const text = '_<strong>TEST</strong>_ TEST__';
      const expectedText = '<em><strong>TEST</strong></em> TEST__';
      const result = pipe.transform(text);
      expect(result).toBe(expectedText);
    });


    it('should return plain text _test__ test__', () => {
      const text = '_test__ test__';
      const expectedText = '_test__ test__';
      const result = pipe.transform(text);
      expect(result).toBe(expectedText);
    });

  });

});
