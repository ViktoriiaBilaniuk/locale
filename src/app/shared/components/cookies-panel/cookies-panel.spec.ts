import { CookiesPanelComponent } from './cookies-panel.component';
import { STORE_STUB } from '../../../test/stubs/service-stubs';
import { of } from 'rxjs';

describe('CookiesPanelComponent', () => {

  let component, selectSpy;

  beforeEach(() => {
    component = new CookiesPanelComponent(STORE_STUB);
    selectSpy = spyOn(STORE_STUB, 'select').and.returnValue(of(1));
    localStorage.setItem('sl-cookies-panel', 'data');
  });

  it ('should select user', () => {
    component.ngOnInit();
    expect(selectSpy).toHaveBeenCalled();
  });

  it ('should call checkIsCookiesNotification', () => {
    const checkIsCookiesNotificationSpy = spyOn(component, 'checkIsCookiesNotification');
    component.ngOnInit();
    expect(checkIsCookiesNotificationSpy).toHaveBeenCalled();
  });

  it ('should set isCookiesPanelShown to false', () => {
    component.ngOnInit();
    expect(component.isCookiesPanelShown).toBeFalsy();
  });

  describe('', () => {
    beforeEach(() => {
      localStorage.removeItem('sl-cookies-panel');
    });

    it ('should set isCookiesPanelShown to true', () => {
      component.ngOnInit();
      expect(component.isCookiesPanelShown).toBeTruthy();
    });

  });

  describe('closeCookiesPanel', () => {

    it ('should set isCookiesPanelShown to false', () => {
      component.closeCookiesPanel();
      expect(component.isCookiesPanelShown).toBeFalsy();
    });

    it ('should set item to localStorage', () => {
      const setItemSpy = spyOn(localStorage, 'setItem');
      component.closeCookiesPanel();
      expect(setItemSpy).toHaveBeenCalled();
    });

  });

});
