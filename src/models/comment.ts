import faker from 'faker';
import type { IComment } from '../utils/types';

export const comment: IComment = {
  body: faker.lorem.sentence(),
};
