import { FilesService } from './files.service';
import { HTTP } from '../../../test/stubs/service-stubs';
import { of } from 'rxjs';
import { CONSTANTS } from '../../constants';

describe('FilesService', () => {

  let service, postSpy, putSpy;

  beforeEach(() => {
    service = new FilesService(HTTP);
    postSpy = spyOn(HTTP, 'post').and.returnValue(of(1));
    putSpy = spyOn(HTTP, 'put').and.returnValue(of(1));
  });

  it('should call post', () => {
    service.getPreSignedUrl(1);
    expect(postSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}files/s3-signed-url`, 1);
  });

  it('should call put', () => {
    service.uploadFiles(1, []);
    expect(putSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}files/1`, []);
  });
});
