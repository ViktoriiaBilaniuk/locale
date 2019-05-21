import { SettingsComponent } from './settings.component';
import { of } from 'rxjs/index';

describe('SettingsComponent', () => {
  let component;
  const mockTracker = {
    settingsOpened () {}
  } as any;

  const userService = {
    updateUser() { return of({}); },
    fetchCurrentUser() { return  of({}); }
  } as any;

  beforeEach(() => {
    component = new SettingsComponent(userService, mockTracker);
  });

  it ('should fetch user on init', () => {
    const spy2 = spyOn(userService, 'fetchCurrentUser').and.returnValue(of({}));
    component.ngOnInit();
    expect(spy2).toHaveBeenCalled();
  });
});
