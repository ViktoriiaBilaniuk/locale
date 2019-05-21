import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Store } from './../../store/store';
import { CONSTANTS } from '../../constants';
import { of } from 'rxjs/index';


describe ('UserService', () => {
  let userService: UserService;

  const http = new HttpClient(null);
  const store = new Store();
  const auth = {logout: () => {}} as any;

  const mockUser = {
    id: '59ee0925b2b82f1dd374bc94',
    display_name: 'Some name',
    email: 'test@test.com',
    image: 'http://url.com',
    chat_status: 'online',
    venues: ['']
  };

  let httpSpy;

  beforeEach(() => {
    userService = new UserService(http, store, auth);
    httpSpy = spyOn(http, 'get').and.returnValue(of({ user: mockUser }));
  });

  it('should call methods to fetch user and save him to store', () => {

    const storeSpy = spyOn(store, 'set');

    userService.fetchCurrentUser().subscribe();

    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}profile/current-user`);
    expect(storeSpy).toHaveBeenCalledWith('current-user', mockUser);
  });

  it('should call logout', () => {
    mockUser.venues = [];
    const logoutSpy = spyOn(auth, 'logout');

    userService.fetchCurrentUser().subscribe();

    expect(logoutSpy).toHaveBeenCalled();
  });

  it('should call method to change user password', () => {
    httpSpy = spyOn(http, 'patch').and.returnValue(of({}));

    const mockRequestData = {
      current_password: '1111',
      new_password: '1234',
      new_password_confirmation: '1234'
    };

    userService.changePassword(mockRequestData).subscribe();
    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}profile/change-password`, mockRequestData);
  });

  it('should call method to update user info', () => {
    httpSpy = spyOn(http, 'patch').and.returnValue(of({ user: mockUser }));
    const storeSpy = spyOn(store, 'set');

    userService.updateUser(mockUser).subscribe();

    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}profile/current-user`, mockUser);
    expect(storeSpy).toHaveBeenCalledWith('current-user', mockUser);
  });

  it('should call method to update chat status', () => {
    httpSpy = spyOn(http, 'patch').and.returnValue(of({user: mockUser}));
    const storeSpy = spyOn(store, 'set');

    userService.updateChatStatus('active');

    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}profile/chat-status/active`, {});
    expect(storeSpy).toHaveBeenCalledWith('current-user', mockUser);
  });

  it('should call method to get presigned url for file', () => {
    const requestFileData = { file_name: 'test_name', file_type: 'image' };
    httpSpy = spyOn(http, 'post').and.returnValue(of({}));
    userService.getPreSignedUrl(requestFileData).subscribe();
    expect(httpSpy).toHaveBeenCalledWith(`${CONSTANTS.API_ENDPOINT}profile/images/avatar/s3-signed-url`, requestFileData);
  });

  it('should call method to upload profile photo', () => {
    const requestFileData = {
      file_name: 'test_name',
      file_type: 'image'
    };
    httpSpy = spyOn(http, 'put').and.returnValue(of({}));

    userService.uploadProfilePhoto('http://path.com/endpoint', {} as any).subscribe();

    expect(httpSpy).toHaveBeenCalledWith('http://path.com/endpoint', {});
  });
});
