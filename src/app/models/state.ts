import { Admin } from './admin';

export interface State {
  admin: Admin;
  firebaseToken: string;
  permissions: Array<string>;
}
