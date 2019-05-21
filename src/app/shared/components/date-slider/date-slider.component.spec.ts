/*
import { DateSliderComponent } from './date-slider.component';
import * as moment from 'moment';
describe('DateSliderComponent', () => {
  let component: DateSliderComponent;
  let from, to;
  beforeEach(() => {
    from = moment('20171203');
    to = moment('20171210');
    component = new DateSliderComponent();
    component.baseFrom = from;
    component.baseTo = to;
  });

  it('should display date range using appropriate format', () => {
    component.type = 'month';

    expect(component.displayDate).toBe('December 2017');

    component.type = 'week';

    expect(component.displayDate).toBe('Dec 3rd - 10th');
  });

  it('should change week range by 7 days', (done) => {
    component.type = 'week';
    spyOn(component.onChange, 'emit').and.callFake((value) => {
      expect(value.from.toString()).toBe(from.add(7, 'days').toString());
      expect(value.to.toString()).toBe(to.add(7, 'days').toString());
      done();
    });
    component.next();
  });

  it('should change month range by 30 days', (done) => {
    component.type = 'month';
    spyOn(component.onChange, 'emit').and.callFake((value) => {
      expect(value.from.toString()).toBe(from.add(-1, 'months').toString());
      expect(value.to.toString()).toBe(to.add(-1, 'months').toString());
      done();
    });
    component.back();
  });
});
*/
