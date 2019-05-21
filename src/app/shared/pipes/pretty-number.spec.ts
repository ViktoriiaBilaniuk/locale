import { PrettyNumberPipe } from './pretty-number.pipe';

describe('TrimPipe', () => {

  let pipe;

  beforeEach(() => {
    pipe = new PrettyNumberPipe();
  });

  describe('should transform numbers', () => {
    const tests = [
      { number: 1, expected: '1' },
      { number: 10, expected: '10' },
      { number: 999, expected: '999' },
      { number: 1000, expected: '1K' },
      { number: 1001, expected: '1K' },
      { number: 1100, expected: '1.1K' },
      { number: 1590, expected: '1.6K' },
      { number: 999999, expected: '1M' },
      { number: 1001000, expected: '1M' },
      { number: 1001001000, expected: '1G' },
      { number: 1001001001000, expected: '1T' },
      { number: 1001001001001000, expected: '1P' },
      { number: 1001001001001001000, expected: '1E' },
      { number: 1001001001001001001000, expected: '1Z' },
      { number: 1001001001001001001001000, expected: '1Y' },
      { number: 1555555, decimals: 0, expected: '2M' },
      { number: 1555555, decimals: 2, expected: '1.56M' },
      { number: 1555555, decimals: 3, expected: '1.556M' },
      { number: -1000, expected: '-1K' },
      { number: -1, expected: '-1' },
      { number: 0.5333, expected: '0.5' }
    ];

    tests.forEach((test: any) => {
      it(`formats ${test.number} as ${test.expected}`, () => {
        const result = pipe.transform(test.number, test.decimals);
        expect(result).toBe(test.expected);
      });
    });
  });
});
