import { PerformancePostComponent } from './performance-post.component';
import { POST } from '../../../test/mocks/performance-mocks';

describe('PerformancePostComponent', () => {
  let component;

  beforeEach(() => {
    component = new PerformancePostComponent();
    component.post = POST;
  });

  it('should return paid', () => {
    expect(component.paid).toEqual([200]);
  });

  it('should return organic', () => {
    expect(component.organic).toEqual([400]);
  });

  it('should calculate organicPercentage', () => {
    component.getPercentagesDiff();
    expect(Math.round(component.organicPercentage)).toEqual(67);
  });

  it('should calculate paidPercentage', () => {
    component.getPercentagesDiff();
    expect(Math.round(component.paidPercentage)).toEqual(33);
  });

  it('should return likes', () => {
    expect(component.likes).toEqual([2]);
  });

  it('should return comments', () => {
    expect(component.comments).toEqual([0]);
  });

  it('should return shares', () => {
    expect(component.shares).toEqual([0]);
  });

});
