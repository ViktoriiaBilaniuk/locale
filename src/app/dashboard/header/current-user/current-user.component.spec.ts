import { CurrentUserComponent } from './current-user.component';
import {
  AUTH,
  CHANGE_DETECTION,
  CHAT_SERVICE,
  NOTIFICATIONS,
  STORE_STUB,
  TRACK_STUB,
  USER_SERVICE
} from '../../../test/stubs/service-stubs';
import { of } from 'rxjs';

describe('CurrentUserComponent', () => {
  let component;

  beforeEach(() => {
    component = new CurrentUserComponent(AUTH, STORE_STUB, CHANGE_DETECTION, USER_SERVICE, TRACK_STUB, CHAT_SERVICE, NOTIFICATIONS);
  });

  describe('ngOnInit', () => {
    let getVenueIdSpy, getUserSpy;

    beforeEach(() => {
      getVenueIdSpy = spyOn(component, 'getVenueId');
      getUserSpy = spyOn(component, 'getUser');
    });

    it('should call getVenueId', () => {
      component.ngOnInit();
      expect(getVenueIdSpy).toHaveBeenCalled();
    });

    it('should call getUser', () => {
      component.ngOnInit();
      expect(getUserSpy).toHaveBeenCalled();
    });
  });

  describe('clearData', () => {
    it ('should set showReachOutDropdown to false', () => {
      component.clearData();
      expect(component.showReachOutDropdown).toBeFalsy();
    });

    it ('should set menuIsActive to false', () => {
      component.clearData();
      expect(component.menuIsActive).toBeFalsy();
    });

    it ('should set reachOutReasons to empty array', () => {
      component.clearData();
      expect(component.reachOutReasons).toEqual([]);
    });

  });

  describe('getUser', () => {
    let selectSpy;

    beforeEach(() => {
      selectSpy = spyOn(STORE_STUB,  'select').and.returnValue(of({}));
    });

    it ('should select current user', () => {
      component.getUser();
      expect(selectSpy).toHaveBeenCalledWith('current-user');
    });

    it ('should init user', () => {
      component.getUser();
      expect(component.user).toBeDefined();
    });

    it ('should call markForCheck', () => {
      const markForCheckSpy = spyOn(CHANGE_DETECTION, 'markForCheck');
      component.getUser();
      expect(markForCheckSpy).toHaveBeenCalled();
    });
  });

  it ('should toggle menu', () => {
    component.menuIsActive = false;
    component.toggleMenu();
    expect(component.menuIsActive).toBeTruthy();
  });

  it ('should set menuIsActive to false', () => {
    component.onClickedOutside();
    expect(component.menuIsActive).toBeFalsy();
  });

  describe('logout', () => {

    it ('should reset selectedChatId', () => {
      component.logout();
      expect(CHAT_SERVICE.selectedChatId).not.toBeDefined();
    });

    it ('should call handleLogout', () => {
      const handleLogoutSpy = spyOn(NOTIFICATIONS, 'handleLogout');
      component.logout();
      expect(handleLogoutSpy).toHaveBeenCalled();
    });

    it ('should call logoutSpy', () => {
      const logoutSpy = spyOn(TRACK_STUB, 'logout');
      component.logout();
      expect(logoutSpy).toHaveBeenCalled();
    });

    it ('should call authLogoutSpy', () => {
      const authLogoutSpy = spyOn(AUTH, 'logout');
      component.logout();
      expect(authLogoutSpy).toHaveBeenCalled();
    });

  });

  describe('changeChatStatus', () => {

    it ('should call updateChatStatus', () => {
      const updateChatStatusSpy = spyOn(USER_SERVICE, 'updateChatStatus');
      component.changeChatStatus(1);
      expect(updateChatStatusSpy).toHaveBeenCalledWith(1);
    });

    it ('should call userChangeStatus', () => {
      const userChangeStatusSpy = spyOn(TRACK_STUB, 'userChangeStatus');
      component.changeChatStatus(1);
      expect(userChangeStatusSpy).toHaveBeenCalledWith(1);
    });
  });

  it ('should return chatStatuses', () => {
    const allStatusesMock = [{
      value: '1'
    }];
    component.allStatuses = allStatusesMock;
    expect(component.chatStatuses).toEqual(allStatusesMock);
  });

  it ('should return chatStatus', () => {
    expect(component.chatStatus).toEqual('');
  });

  describe('getStatusClass', () => {
    const statusTests = [
      {input: 'active', output: 'icon-check'},
      {input: 'away', output: 'icon-clock'},
      {input: 'offline', output: 'icon-ban'},
    ];
    statusTests.forEach(test => {
      it (`should return ${test.output} for ${test.input}`, () => {
        expect(component.getStatusClass('active')).toEqual('icon-check');
      });
    });

  });

  describe('bellClick', () => {

    it('should set showReachOutDropdown to false', () => {
      component.showReachOutDropdown = true;
      component.bellClick();
      expect(component.showReachOutDropdown).toBeFalsy();
    });

    it('should set menuIsActive to false', () => {
      component.menuIsActive = true;
      component.bellClick();
      expect(component.menuIsActive).toBeFalsy();
    });

  });

  it('should return true for isReachOut', () => {
    component.reachOutPermissionForCurrentVenue = true;
    component.reachOutReasons = [1];
    expect(component.isReachOut()).toBeTruthy();
  });

});
