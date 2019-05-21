import { TrimPipe } from './trim.pipe';

describe('TrimPipe', () => {

  let pipe;

  beforeEach(() => {
    pipe = new TrimPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should not trim', () => {
    const value = 'qwertyui asdfghjk zxcvbnm';
    const result = pipe.transform(value, 0, 10);
    expect(result).toEqual(' ... jk zxcvbnm');
  });

  it('should trim', () => {
    const value = 'qwertyuiop';
    const result = pipe.transform(value, 12, 23);
    expect(result).toEqual(value);
  });
});
