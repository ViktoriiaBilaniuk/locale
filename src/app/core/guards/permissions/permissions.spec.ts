import { ROUTER, STORE_STUB } from '../../../test/stubs/service-stubs';
import { PermissionsGuard } from './permissions.guard';

describe('PermissionsGuard', () => {
  let quard;

  const routeMock = {
    data: {
      permission: '1'
    }
  };

  beforeEach(() => {
    quard = new PermissionsGuard(STORE_STUB, ROUTER);
    STORE_STUB.set('permissions', ['1']);
  });

  it ('should return true', () => {
    expect(quard.canActivate(routeMock, undefined)).toBeTruthy();
  });

  it ('should return false', () => {
    STORE_STUB.set('permissions', []);
    expect(quard.canActivate(routeMock, undefined)).toBeFalsy();
  });

});
