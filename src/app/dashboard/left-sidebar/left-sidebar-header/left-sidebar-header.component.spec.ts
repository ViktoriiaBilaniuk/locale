import { LeftSidebarHeaderComponent } from './left-sidebar-header.component';
import { ROUTER } from '../../../test/stubs/service-stubs';

describe('LeftSidebarHeaderComponent', () => {

  let component: LeftSidebarHeaderComponent;
  const routerStub = ROUTER;

  beforeEach(() => {
    component = new LeftSidebarHeaderComponent(routerStub);
  });

  it ('should navigate to dashboard', () => {
    const navigateSpy = spyOn(routerStub, 'navigate');
    component.goToDashboard();
    expect(navigateSpy).toHaveBeenCalled();
  });

});
