import { PermissionsService } from './permissions.service';
import { Store } from '../../store/store';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/index';

describe('PermissionsService', () => {
  let permissionsService: PermissionsService;
  const http = new HttpClient(null);
  const store = new Store();
  let httpPermSpy, storePermSpy;
  const response = {
    permissions: []
  };

  beforeEach(() => {
    permissionsService = new PermissionsService(http, store);
    httpPermSpy = spyOn(http, 'get').and.returnValue(of(response));
    storePermSpy = spyOn(store, 'set');
  });

  it ('should fetch permission', () => {
    permissionsService.fetchPermissionsByVenue();
    expect(storePermSpy).toHaveBeenCalledWith('permissions', []);
  });

  it ('should fetch all permission', () => {
    permissionsService.fetchPermissions();
    expect(storePermSpy).toHaveBeenCalledWith('all-permissions', []);
  });

});
