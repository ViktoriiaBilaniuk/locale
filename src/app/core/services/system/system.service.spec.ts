import { SystemService } from './system.service';
import { HTTP, STORE_STUB } from '../../../test/stubs/service-stubs';
import { CONSTANTS } from '../../constants';
import { of } from 'rxjs';

describe('SystemService', () => {

  let service, getSpy, setSpy;
  const responseMock = {
    preferences: {
      categories: 1,
      demographic_options: 1,
      target_market_options: 1,
    }
  };

  beforeEach(() => {
    service = new SystemService(HTTP, STORE_STUB);
    getSpy = spyOn(HTTP, 'get').and.returnValue(of(responseMock));
    setSpy = spyOn(STORE_STUB, 'set');
  });

  it('should call get', () => {
    service.getSystemInfo().subscribe();
    expect(getSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}system`);
  });

  it('should set values to store', () => {
    service.getSystemInfo().subscribe();
    expect(setSpy).toHaveBeenCalledTimes(3);
  });

});
