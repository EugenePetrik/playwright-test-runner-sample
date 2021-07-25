import faker from 'faker';
import type { IArticle } from '../utils/types';

export const article: IArticle = {
  title: faker.lorem.words(),
  description: faker.lorem.sentence(),
  body: faker.lorem.paragraph(),
  tagList: [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],
};
