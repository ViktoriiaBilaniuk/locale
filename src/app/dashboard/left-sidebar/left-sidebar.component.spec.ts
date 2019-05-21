import { LeftSidebarComponent } from './left-sidebar.component';
import { Store } from '../../core/store/store';
import { MENU_CONSTANTS } from './menu.constants';
import { of } from 'rxjs/index';

describe('LeftSidebarComponent', () => {

  let component: LeftSidebarComponent;
  const store = new Store();
  let storeSelectSpy;
  const permissionsMock = ['1', '2'];

  beforeEach(() => {
    component = new LeftSidebarComponent(store);
    component.collapsed = false;
    component.menuItems = MENU_CONSTANTS;
    storeSelectSpy = spyOn(store, 'select').and.returnValue(of(permissionsMock));
  });

  it ('should init', () => {
    const checkResponsiveSpy = spyOn(component, 'checkResponsive');
    component.ngOnInit();
    expect(checkResponsiveSpy).toHaveBeenCalled();
  });

  it ('should check responsive', () => {
    (window as any).innerWidth = 1300;
    component.checkResponsive();
    expect(component.collapsed).toBeTruthy();
  });
});
