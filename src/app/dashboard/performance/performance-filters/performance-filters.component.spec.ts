import { PerformanceFiltersComponent } from './performance-filters.component';

describe('PerformanceFiltersComponent', () => {
  let component;

  beforeEach(() => {
    component = new PerformanceFiltersComponent();
  });

  it ('should init fromDatepickerSettings', () => {
    component.ngOnInit();
    expect(component.fromDatepickerSettings).toBeDefined();
  });

  it ('should init toDatepickerSettings', () => {
    component.ngOnInit();
    expect(component.toDatepickerSettings).toBeDefined();
  });
});
