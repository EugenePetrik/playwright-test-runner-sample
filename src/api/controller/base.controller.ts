/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-unused-vars */

import type { CookieJar } from 'tough-cookie';
import { BaseHttpRequest } from '../request';

export type ControllerOptions = {
  token?: string;
  cookieJar: CookieJar;
  prefixUrl: string;
  prefixPath: string;
  RequestBuilder: new () => BaseHttpRequest;
};

export class BaseController {
  constructor(protected readonly options: ControllerOptions) {}

  protected request() {
    const preparedUrl = new URL(this.options.prefixPath, this.options.prefixUrl);
    return new this.options.RequestBuilder()
      .prefixUrl(preparedUrl)
      .headers({ authorization: `Token ${this.options.token}` })
      .cookieJar(this.options.cookieJar);
  }
}
