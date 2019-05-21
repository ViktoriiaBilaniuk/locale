import { HeaderComponent } from './header.component';
import { Permissions } from '../../core/services/permissions/permissions.constant';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let onVenueSelectSpy;

  beforeEach(() => {
    component = new HeaderComponent();
    onVenueSelectSpy = spyOn(component.onVenueSelect, 'emit');
  });

  it ('should emit onVenueSelect', () => {
    component.onVenueSelectEvent({});
    expect(onVenueSelectSpy).toHaveBeenCalled();
  });

  it ('should call setPermissions', () => {
    const setPermissions = spyOn(component, 'setPermissions');
    component.ngOnChanges({permissions: true});
    expect(setPermissions).toHaveBeenCalled();
  });

  describe('setPermissions', () => {

    beforeEach(() => {
      component.permissions = [Permissions.CHAT, Permissions.REACH_OUT];
    });

    it ('should define chatPermissionForCurrentVenue', () => {
      component.setPermissions();
      expect(component.chatPermissionForCurrentVenue).toBeDefined();
    });

    it ('should define reachOutPermissionForCurrentVenue', () => {
      component.setPermissions();
      expect(component.reachOutPermissionForCurrentVenue).toBeDefined();
    });

  });

  it ('should set expand status to false', () => {
    component.onExpand(false);
    expect(component.expand).toBeFalsy();
  });

});
