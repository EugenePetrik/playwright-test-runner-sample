import type { ArticleResponse, IArticle } from '../../utils/types';
import { BaseController } from './base.controller';

export class ArticleController extends BaseController {
  async createArticle(article: IArticle): Promise<ArticleResponse> {
    return (await this.request().url('articles').method('POST').body({ article }).send()).body;
  }

  async updateArticle(article: IArticle, articleSlug: string): Promise<ArticleResponse> {
    return (
      await this.request().url(`articles/${articleSlug}`).method('PUT').body({ article }).send()
    ).body;
  }

  async addArticleToFavorite(articleSlug: string): Promise<ArticleResponse> {
    return (await this.request().url(`articles/${articleSlug}/favorite`).method('POST').send())
      .body;
  }

  async deleteArticle(articleSlug: string): Promise<void> {
    return (await this.request().url(`articles/${articleSlug}`).method('DELETE').send()).body;
  }
}
