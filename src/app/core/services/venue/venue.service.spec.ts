import { CONSTANTS } from './../../constants';
import { HttpClient } from '@angular/common/http';
import { Store } from './../../store/store';
import { VenueService } from './venue.service';
import { PermissionsService } from '../permissions/permissions.service';
import { of } from 'rxjs/index';
import { delay } from 'rxjs/internal/operators';

describe('VenueService', () => {

  let venueService: VenueService;

  const http = new HttpClient(null);
  const store = new Store();
  const permissionsService = new PermissionsService(http, store);
  const chatService = {
    refreshChats: () => {}
  } as any;
  const detailsMock = {
    name: 'name'
  };
  const newFileMock = {
    tags: [{name: '1'}]
  };

  beforeEach(() => {
    venueService = new VenueService(http, store, chatService, permissionsService);
  });

  it('should call methods to fetch venue details', () => {
    const httpSpy = spyOn(http, 'get').and.returnValue(of({ venue: {} }));
    const storeSpy = spyOn(store, 'set');

    venueService.fetchDetails(1).subscribe();

    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}venues/1/details`);
    expect(storeSpy).toHaveBeenCalledWith('venue-details', {});
  });

  it('should call methods to update venue details', () => {
    const httpSpy = spyOn(http, 'patch').and.returnValue(of({ venue: {} }));
    const storeSpy = spyOn(store, 'set');

    venueService.updateDetails(1, { title: '123' }).subscribe();

    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}venues/1`, { title: '123' });
    expect(storeSpy).toHaveBeenCalledWith('venue-details', {});
  });

  it('should call methods to fetch posts', () => {
    const httpSpy = spyOn(http, 'get').and.returnValue(of({ list: [{}, {}, {}]}));

    venueService.fetchPosts(1, '123123', '234234', [{id: 1}, {id: 2}]);

    expect(httpSpy).toHaveBeenCalledWith(
      `${CONSTANTS.API_ENDPOINT}posts/1/list?from=123123&to=234234&channels[]=1&channels[]=2`);
  });

  it('should call methods to fetch social performance data', () => {
    const httpSpy = spyOn(http, 'get').and.returnValue(of({}));
    venueService.fetchPerformance(1, '123123', '234234', false).subscribe();
    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}venues/1/performance?from=123123&to=234234&groupByDate=false`);
  });

  it('should call methods to fetch social performance posts list', () => {
    const httpSpy = spyOn(http, 'get').and.returnValue(of({}));
    venueService.fetchPerformancePosts(1, '123123', '234234', 'date', 2);
    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}venues/1/performance/2?from=123123&to=234234&sort_by=date`);
  });

  it ('should clear venue', () => {
    const storeSpy = spyOn(store, 'set');
    venueService.clearVenue();
    expect(storeSpy).toHaveBeenCalledWith('venue-details', null);
  });

  it ('should patch new details', () => {
    const httpSpy = spyOn(http, 'patch');
    venueService.updateDetailsWithoutStoreUpdate(1, detailsMock);
    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}venues/1`, detailsMock);
  });

  it ('should fetch analitycs', () => {
    const httpSpy = spyOn(http, 'get');
    const query = `from=2&to=3`;
    venueService.fetchSlAnalytics(1, 2, 3, 4);
    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}venues/1/analytics/4?${query}`);
  });

  it ('should fetch files', () => {
    const httpSpy = spyOn(http, 'get').and.returnValue(of({}).pipe(delay(500)));
    venueService.fetchFiles(1, 2, 3, undefined, 500);
    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}files/1?skip=2&take=3&search=undefined`);
  });

  it ('should update file', () => {
    const fileMock = {tags: ['1']};
    const httpSpy = spyOn(http, 'patch');
    venueService.updateFile(1, newFileMock);
    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}files/1`, fileMock);
  });


  it ('should fetch files by tag', () => {
    const httpSpy = spyOn(http, 'get');
    venueService.fetchFilesByTag(1, 2);
    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}files/1/tags/2`);
  });

  it ('should delete', () => {
    const httpSpy = spyOn(http, 'delete');
    venueService.deleteFile(1);
    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}files/1`);
  });
});
