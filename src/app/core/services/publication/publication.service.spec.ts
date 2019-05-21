import { PublicationService } from './publication.service';
import { HTTP } from '../../../test/stubs/service-stubs';
import { of } from 'rxjs';
import { CONSTANTS } from '../../constants';

describe('PublicationService', () => {
  let service;
  const venueId = 1;
  const postId = 1;
  const sourceType = 'image';
  const network = 'facebook';
  const post = {message: '1'};
  const data = {type: 'image', name: 'name'};

  beforeEach(() => {
    service = new PublicationService(HTTP);
  });

  it('should get presigned url', () => {
    const getSpy = spyOn(HTTP, 'get').and.returnValue(of(1));
    service.getPreSignedUrl(venueId, sourceType, data);
    expect(getSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}posts/${venueId}/${sourceType}/storage-sign-url?` +
      `file_name=${encodeURIComponent(data.name)}&file_type=${encodeURIComponent(data.type)}`);
  });

  it('should create post', () => {
    const postSpy = spyOn(HTTP, 'post').and.returnValue(of(1));
    service.createPost(venueId, network, post);
    expect(postSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}posts/${venueId}/${network}/create`, post);
  });

  it('should edit post', () => {
    const patchSpy = spyOn(HTTP, 'patch').and.returnValue(of(1));
    service.editPost(venueId, network, post, postId);
    expect(patchSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}posts/${venueId}/${network}/update/${postId}`, post);
  });
});
