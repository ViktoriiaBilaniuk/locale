import { Admin } from './admin';

export interface AuthResponse {
  access_token: string;
  user: Admin;
  code: number;
}

export interface ChannelResponse {
  code: number;
  list: [any];
}
