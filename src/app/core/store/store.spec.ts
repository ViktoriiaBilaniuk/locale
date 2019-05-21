import { Admin } from './../../models/admin';
import { Store } from './store';
import { CONSTANTS } from '../constants';
import { BehaviorSubject } from 'rxjs';
import { State } from '../../models/state';

let store;
const adminMock = {
  admin: undefined,
  firebaseToken: null,
  permissions: []
};

describe ('App Store', () => {
  beforeEach(() => {
    store = new Store();
  });

  it('should have the default value', () => {
    expect(store.value).toBeTruthy();
  });

  it (`should have admin value as 'undefined' if no data in localStorage`, () => {
    expect(store.defaultState.admin).not.toBeDefined();
  });

  it ('should have admin value if there is data in localStorage', () => {
    const admin = {id: 22};
    localStorage.setItem(CONSTANTS.ADMIN_PATH, JSON.stringify(admin));
    store = new Store();

    expect(store.defaultState.admin).toEqual(admin);
    // clear after test
    localStorage.removeItem(CONSTANTS.ADMIN_PATH);
  });

  it ('should correctly set the value to store', () => {
    const newAdmin: Admin = { id: '23' };

    store.set('admin', newAdmin);

    expect(store.value.admin).toEqual(newAdmin);
  });

  it('should select correct value from store', () => {
    const admin$ = store.select('admin');
    let admin;
    const newAdmin: Admin = { id: '23' };
    store.set('admin', newAdmin);

    admin$.subscribe(value => admin = value);

    expect(admin).toBe(newAdmin);
  });

  it ('should clear store', () => {
    localStorage.setItem('sl-admin', 'admin');
    store.clear();
    expect(store.subject).toEqual(new BehaviorSubject<State>(adminMock as any));
  });
});
