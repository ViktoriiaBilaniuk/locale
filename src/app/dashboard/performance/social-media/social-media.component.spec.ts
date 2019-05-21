import {SocialMediaComponent} from './social-media.component';
import {PERFORMANCE_POST} from '../../../test/mocks/performance-mocks';
import {FB_COLUMN_NAMES, INSTAGRAM_COLUMN_NAMES, TWITTER_COLUMN_NAMES} from '../performance.constants';

describe('SocialMediaComponent', () => {
  let component;
  const changesMock = {data: [1]};
  const selectChannelMock = { emit: function() {} as any };
  const selectedChannelMock = {metrics: {fb_post_count: 2}};
  let emitSpy;

  beforeEach(() => {
    component = new SocialMediaComponent();
    component.data = [1];
    emitSpy = spyOn(selectChannelMock, 'emit');
  });

  it ('should call calculateMetrics', () => {
    const calculateMetricsSpy = spyOn(component, 'calculateMetrics');
    component.ngOnChanges(changesMock);
    expect(calculateMetricsSpy).toHaveBeenCalled();
  });

  it ('should emit value', () => {
    component.selectChannel = selectChannelMock;
    component.onViewPosts(selectedChannelMock);
    expect(emitSpy).toHaveBeenCalled();
  });

  describe('calculateMetrics', () => {
    const dataMock = [PERFORMANCE_POST];

    beforeEach(() => {
      component.data = dataMock;
    });

    it ('should calculate paidPercent', () => {
      component.calculateMetrics();
      dataMock.forEach(item => {
        expect((item as any).paidPercent).toBeDefined();
      });
    });
  });

  describe('sheck column names', () => {
    const fbNames = FB_COLUMN_NAMES;
    const inNames = INSTAGRAM_COLUMN_NAMES;
    const twNames = TWITTER_COLUMN_NAMES;

    beforeEach(() => {
      component.facebookColumns = fbNames;
      component.instagramColumns = inNames;
      component.tweetterColumns = twNames;
    });

    it ('should return facebook column names', () => {
      component.mediaType = 'fb';
      expect(component.columnNames).toEqual(fbNames);
    });

    it ('should return instagram column names', () => {
      component.mediaType = 'instagram';
      expect(component.columnNames).toEqual(inNames);
    });

    it ('should return twitter column names', () => {
      component.mediaType = 'twitter';
      expect(component.columnNames).toEqual(twNames);
    });
  });

  it ('should return facebook icon', () => {
    const columnMock = {className: 'Facebook Channels'};
    expect(component.getHeaderIcon(columnMock)).toEqual('facebook.svg');
  });

  it ('should return instagram icon', () => {
    const columnMock = {className: 'Instagram Channels'};
    expect(component.getHeaderIcon(columnMock)).toEqual('instagram.svg');
  });

  it ('should return twitter icon', () => {
    const columnMock = {className: 'Twitter Channels'};
    expect(component.getHeaderIcon(columnMock)).toEqual('twitter.svg');
  });

  it ('should return class name', () => {
    const columnMock = {className: 'Facebook Channels'};
    expect(component.getHeaderClass(columnMock)).toEqual('facebook-channels');
  });

  it ('should return true in isTwitter', () => {
    component.mediaType = 'twitter';
    expect(component.isTwitter).toBeTruthy();
  });

  it ('should return true in isInstagram', () => {
    component.mediaType = 'instagram';
    expect(component.isInstagram).toBeTruthy();
  });

  it ('should return true in isFacebook', () => {
    component.mediaType = 'fb';
    expect(component.isFacebook).toBeTruthy();
  });

  it ('should return class name for gain', () => {
    expect(component.getClassNameForGain(1)).toEqual('increase');
  });

  it ('should return true in isPaidOrganic', () => {
    const columnMock = {className: 'Paid Organic'};
    expect(component.isPaidOrganic(columnMock)).toBeTruthy();
  });




});
