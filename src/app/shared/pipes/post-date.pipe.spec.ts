import { PostDatePipe } from './post-date.pipe';

describe('PostDatePipe', () => {

  let pipe;

  beforeEach(() => {
    pipe = new PostDatePipe();
  });

  describe('should transform dates', () => {
    const tests = [
      { utcTimestamp: 1615377600000, network: 'facebook', expected: 'March 10 at 04:00 AM' },
      { utcTimestamp: 1615386780000, network: 'facebook', expected: 'March 10 at 06:33 AM' },
      { utcTimestamp: 1615852980000, network: 'facebook', expected: 'March 15 at 03:03 PM' },
      { utcTimestamp: 1616029200000, network: 'facebook', expected: 'March 17 at 04:00 PM' },
      { utcTimestamp: 1616029860000, network: 'facebook', expected: 'March 18 at 06:11 AM' },
      { utcTimestamp: 1612181520000, network: 'instagram', expected: '01 February at 14:12' },
      { utcTimestamp: 1612872720000, network: 'instagram', expected: '09 February at 15:12' },
      { utcTimestamp: 1612872240000, network: 'instagram', expected: '09 February at 14:04' },
      { utcTimestamp: 1613558400000, network: 'instagram', expected: '17 February at 12:40' },
      { utcTimestamp: 1613556600000, network: 'instagram', expected: '18 February at 00:10' },
      { utcTimestamp: 1614420600000, network: 'twitter', expected: '28 Feb 00:10' },
      { utcTimestamp: 1614427800000, network: 'twitter', expected: '28 Feb 02:10' },
      { utcTimestamp: 1614427920000, network: 'twitter', expected: '27 Feb 14:12' },
      { utcTimestamp: 1613603520000, network: 'twitter', expected: '17 Feb 16:12' },
      { utcTimestamp: 1613603520000, network: 'twitter', expected: '17 Feb 15:12' },
    ];

    /*tests.forEach(test => {
      it(`formats value with utcTimestamp-${test.utcTimestamp}, network-${test.network},
      utcOffset-${test.utcOffset}  as ${test.expected}`, () => {
        const result = pipe.transform(test.utcTimestamp, test.network, test.utcOffset);
        expect(result).toBe(test.expected);
      });
    });*/

  });

});
