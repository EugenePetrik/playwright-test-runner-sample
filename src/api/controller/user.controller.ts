import type { IUser, UserResponse } from '../../utils/types';
import { BaseController } from './base.controller';

export class UserController extends BaseController {
  async register(user: IUser): Promise<UserResponse> {
    const { email, password, username } = user;

    return (
      await this.request()
        .url('users')
        .method('POST')
        .body({
          user: {
            email,
            password,
            username,
          },
        })
        .send()
    ).body;
  }

  async login(user: IUser): Promise<string> {
    const { email, password } = user;

    return (
      await this.request()
        .url('users/login')
        .method('POST')
        .body({
          user: {
            email,
            password,
          },
        })
        .send()
    ).body['user']['token'] as string;
  }
}
