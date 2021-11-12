/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Options, Method, Response, GotRequestFunction } from 'got';
import got from 'got';
import { CookieJar } from 'tough-cookie';

type ElementOf<T> = T extends (infer E)[] ? E : T;

export abstract class BaseHttpRequest {
  protected options: ElementOf<Parameters<GotRequestFunction>> = {
    http2: true,
  };

  public prefixUrl(url: string | URL): this {
    this.options.prefixUrl = url;
    return this;
  }

  public url(url: string | URL): this {
    this.options.url = url;
    return this;
  }

  public method(method: Method): this {
    this.options.method = method;
    return this;
  }

  public searchParams(searchParams: Options['searchParams']): this {
    this.options.searchParams = searchParams;
    return this;
  }

  public headers(headers: Record<string, string | undefined>): this {
    this.options.headers = this.options.headers ?? {};
    this.options.headers = {
      ...this.options.headers,
      ...headers,
    };
    return this;
  }

  public cookieJar(cookiesJar: CookieJar): this {
    this.options.cookieJar = cookiesJar;
    return this;
  }

  public bearerToken(bearerToken?: string): this {
    return this.headers({
      authorization: `Token ${bearerToken}`,
    });
  }

  public abstract body(body: any): this;

  public async send<T = any>(): Promise<Response<T>> {
    const { stack } = new Error();
    
    try {
      return await got<T>(this.options as any);
    } catch (err) {
      err.stack = stack;
      if (err instanceof got.HTTPError) {
        err.message = `
                        [${err?.options?.method}]: ${err?.options?.url} => ${err?.response?.statusCode} 
                        ${err.message} 
                        ${err?.response?.rawBody?.toString()}
                      `;
      }
      throw err;
    }
  }
}

export class JsonRequest extends BaseHttpRequest {
  constructor() {
    super();
    this.options = {
      ...this.options,
      responseType: 'json',
    };
  }

  public body(body: any): this {
    this.options.json = body;
    return this;
  }
}
