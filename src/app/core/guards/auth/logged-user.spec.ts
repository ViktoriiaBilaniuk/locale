import { ROUTER, STORE_STUB } from '../../../test/stubs/service-stubs';
import { LoggedUserGuard } from './logged-user.guard';

describe('LoggedUserGuard', () => {
  let quard;
  const adminMock = {
    venues: []
  };

  beforeEach(() => {
    quard = new LoggedUserGuard(STORE_STUB, ROUTER);
    STORE_STUB.set('admin', adminMock);
  });

  it ('should return false', () => {
    expect(quard.canActivate()).toBeFalsy();
  });

  it ('should return true', () => {
    STORE_STUB.set('admin', undefined);
    expect(quard.canActivate()).toBeTruthy();
  });

});
