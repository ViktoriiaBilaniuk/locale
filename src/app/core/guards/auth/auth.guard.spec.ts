import {AuthGuard} from './auth.guard';
import {ROUTER, STORE_STUB, UTILS_STUB} from '../../../test/stubs/service-stubs';

describe('AuthGuard', () => {
  let quard, logoutSpy;

  beforeEach(() => {
    quard = new AuthGuard(STORE_STUB, ROUTER, UTILS_STUB);
    logoutSpy = spyOn(quard, 'logout');
  });

  describe('no admin logic', () => {

    beforeEach(() => {
      STORE_STUB.set('admin', undefined);
    });

    it ('should call logout method', () => {
      quard.canActivate();
      expect(logoutSpy).toHaveBeenCalled();
    });
  });

  describe('no venues logic', () => {
    const adminMock = {
      venues: []
    };
    let showErrorModalSpy;

    beforeEach(() => {
      STORE_STUB.set('admin', adminMock);
      showErrorModalSpy = spyOn(UTILS_STUB, 'showErrorModal');
    });

    it ('should call logout method', () => {
      quard.canActivate();
      expect(logoutSpy).toHaveBeenCalled();
    });

    it ('should call showErrorModal', () => {
      quard.canActivate();
      expect(showErrorModalSpy).toHaveBeenCalled();
    });

  });

  describe('valid admin value logic', () => {
    const adminMock = {
      venues: [1]
    };

    beforeEach(() => {
      STORE_STUB.set('admin', adminMock);
    });

    it ('should return true', () => {
      expect(quard.canActivate()).toBeTruthy();
    });

    it ('should return true in hasVanue', () => {
      expect(quard.hasVanue(adminMock)).toBeTruthy();
    });

  });


});
