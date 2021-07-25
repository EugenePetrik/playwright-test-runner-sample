import { CookieJar } from 'tough-cookie';
import { env } from '../configs';
import { IUser } from '../utils/types';
import { ArticleController } from './controller/article.controller';
import { ControllerOptions } from './controller/base.controller';
import { UserController } from './controller/user.controller';
import { CommentController } from './controller/comment.controller';
import { JsonRequest } from './request';

export class ApiClient {
  public readonly user: UserController;
  public readonly article: ArticleController;
  public readonly comment: CommentController;

  constructor(options?: Partial<ControllerOptions>) {
    const defaultOptions = {
      cookieJar: new CookieJar(),
      prefixUrl: env.API_URL,
      prefixPath: env.API_PREFIX_PATH,
      RequestBuilder: JsonRequest,
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
    };

    this.user = new UserController(mergedOptions);
    this.article = new ArticleController(mergedOptions);
    this.comment = new CommentController(mergedOptions);
  }

  static unauthorized(): ApiClient {
    return new ApiClient();
  }

  static async loginAs(credentials: IUser): Promise<ApiClient> {
    return new ApiClient({
      token: await new ApiClient().user.login(credentials),
    });
  }
}
