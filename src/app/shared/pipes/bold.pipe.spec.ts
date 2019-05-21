import { BoldPipe } from './bold.pipe';
import { TransformTextService } from '../services/transform-text.service';

describe('BoldPipe', () => {
  let pipe;

  const FORMAT_CONSTANTS = [
    { label: 'bold', text: '*bold*', tag: 'strong' },
    { label: '**test', text: '**test', tag: '' },
    { label: 'test', text: 'test', tag: '' },
    { label: '**', text: '**', tag: '' },

  ];

  const transformTextService = new TransformTextService();

  beforeEach(() => {
    pipe = new BoldPipe(transformTextService);
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
      const text = '<em>*Text*</em>';
      const expectedText = '<em><strong>Text</strong></em>';
      const result = pipe.transform(text);
      expect(result).toBe(expectedText);
    });

    it('should return plain text _text*', () => {
      const text = '_text*';
      const expectedText = '_text*';
      const result = pipe.transform(text);
      expect(result).toBe(expectedText);
    });

    it('should return plain text *text**', () => {
      const text = '*text**';
      const expectedText = '*text**';
      const result = pipe.transform(text);
      expect(result).toBe(expectedText);
    });

    it('should return formated text <em>*TEST*</em>  <em>TEST</em>', () => {
      const text = '<em>*TEST*</em>  <em>TEST</em>';
      const expectedText = '<em><strong>TEST</strong></em>  <em>TEST</em>';
      const result = pipe.transform(text);
      expect(result).toBe(expectedText);
    });

    it('should return formated text *_TEST_* TEST**', () => {
      const text = '*<em>TEST</em>* TEST**';
      const expectedText = '<strong><em>TEST</em></strong> TEST**';
      const result = pipe.transform(text);
      expect(result).toBe(expectedText);
    });


    it('should return plain text *test** test**', () => {
      const text = '*test** test**';
      const expectedText = '*test** test**';
      const result = pipe.transform(text);
      expect(result).toBe(expectedText);
    });

  });

});
