import { pluck, distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { CONSTANTS } from './../constants';
import { Admin } from './../../models/admin';
import { State } from './../../models/state';
import { EXPAND_STATUS } from '../../dashboard/header/expand-chat/expand-constants';
import { DEFAULT_TUTORIALS_STATUS_LIST } from '../../shared/components/tutorial/tutorial.constants';

export class Store {
  private defaultState: State = this.getDefaultState();
  private subject = new BehaviorSubject<State>(this.defaultState);
  private store = this.subject.asObservable();

  /**
   * @description
   * Get default state
   *
   * @returns
   * @memberof Store
   */
  getDefaultState() {
    const storedAdmin = localStorage.getItem(CONSTANTS.ADMIN_PATH);
    let adminToStore;
    if (storedAdmin && typeof storedAdmin === 'string') {
      try {
        adminToStore = JSON.parse(storedAdmin);
      } catch (error) {
        adminToStore = undefined;
      }
    } else {
      adminToStore = undefined;
    }
    return {
      admin: adminToStore as Admin,
      firebaseToken: null,
      tutorial: null,
      tutorialsStatusList: this.setTutorialsStatusList(),
      permissions: [],
    };
  }

  setTutorialsStatusList() {

    const statusList = localStorage.getItem('tutorialsStatusList');
    if (!statusList) {
      localStorage.setItem('tutorialsStatusList',  JSON.stringify(DEFAULT_TUTORIALS_STATUS_LIST));
      return DEFAULT_TUTORIALS_STATUS_LIST;
    }
    return JSON.parse(statusList);
  }

  /**
	 * @description
	 * Get whole state value
	 *
	 * @readonly
	 * @type {State}
	 * @memberof Store
	 */
  get value(): State {
    return this.subject.value;
  }

  /**
	 * @description
	 * Get value of state property
	 *
	 * @template T
	 * @param {string} name
	 * @returns {Observable<T>}
	 * @memberof Store
	 */
  select<T>(name: string): Observable<T> {
    return (this.store.pipe(pluck(name)) as Observable<T>).pipe(
      distinctUntilChanged<T>());
  }

  /**
	 * @description
	 * Set new value of state
	 *
	 * @param {string} name
	 * @param {State} state
	 * @memberof Store
	 */
  set(name: string, state: any) {
    this.subject.next({...this.value, [name]: state} as any);

  }

  clear() {
    this.subject = new BehaviorSubject<State>(this.getDefaultState());
    this.store = this.subject.asObservable();
  }
}
