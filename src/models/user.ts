import faker from 'faker';
import type { IUser } from '../utils/types';

export const user: IUser = {
  email: `test${new Date().getTime() / 1000}@example.com`,
  password: faker.internet.password(),
  username: faker.internet.userName().replace(/[_'.]/g, '').toLowerCase().slice(0, 10),
};
