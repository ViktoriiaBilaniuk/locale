import { RadiusRangeComponent } from './radius-range.component';
import { CALENDAR_SERVICE_STUB } from '../../../test/stubs/service-stubs';

describe('RadiusRangeComponent', () => {

  let component: RadiusRangeComponent;
  const calendarService = CALENDAR_SERVICE_STUB;

  beforeEach(() => {
    component = new RadiusRangeComponent(calendarService);
  });

  afterEach(() => {
    component = null;
  });

  it('should check max value for radius', () => {
    const max = 75;
    expect(component.max).toBe(max);
  });

  it('should check min value for radius', () => {
    const min = 1;
    expect(component.min).toBe(min);
  });

});
