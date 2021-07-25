import type { CommentResponse, IComment } from '../../utils/types';
import { BaseController } from './base.controller';

export class CommentController extends BaseController {
  async createComment(articleSlug: string, comment: IComment): Promise<CommentResponse> {
    const { body } = comment;

    return (
      await this.request()
        .url(`articles/${articleSlug}/comments`)
        .method('POST')
        .headers({ authorization: `Token ${this.options.token}` })
        .body({
          comment: {
            body,
          },
        })
        .send()
    ).body;
  }

  async deleteComment(articleSlug: string, commentId: string): Promise<void> {
    return (
      await this.request()
        .url(`articles/${articleSlug}/comments/${commentId}`)
        .method('DELETE')
        .send()
    ).body;
  }
}
