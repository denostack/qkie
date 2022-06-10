/// <reference lib="dom" />

import { parse } from "./cookie.ts";
import { SetCookieOptions, stringify } from "./setcookie.ts";

export interface CookieJarOptions {
  defaultSetCookieOptions?: SetCookieOptions;
  disableDocumentCookie?: boolean;
}

// cross
const hasDocumentCookie = typeof document === "object" &&
  typeof document.cookie === "string";

export class CookieJar {
  static fromCookieString(
    cookie: string,
    options: CookieJarOptions = {},
  ): CookieJar {
    return new CookieJar(parse(cookie), options);
  }

  _cookies: Record<string, string>;
  _setCookies: Record<string, SetCookieOptions>;
  _options: CookieJarOptions;

  constructor(
    cookies: Record<string, string> = {},
    options: CookieJarOptions = {},
  ) {
    this._cookies = cookies;
    this._setCookies = {};
    this._options = options;
  }

  get _availDocumentCookie() {
    return hasDocumentCookie && !this._options.disableDocumentCookie;
  }

  has(name: string): boolean {
    if (this._availDocumentCookie) {
      this._cookies = parse(document.cookie);
    }
    return name in this._cookies;
  }

  set(name: string, value: string, options: SetCookieOptions = {}): void {
    this._cookies[name] = value ?? "";
    if (this._availDocumentCookie) {
      document.cookie = stringify(name, value, {
        ...this._options.defaultSetCookieOptions,
        ...options,
      });
    } else {
      this._setCookies[name] = {
        ...this._options.defaultSetCookieOptions,
        ...options,
      };
    }
  }

  remove(
    name: string,
    options: Omit<SetCookieOptions, "expires" | "maxAge"> = {},
  ): void {
    if (!(name in this._cookies)) {
      return;
    }

    delete this._cookies[name];
    if (this._availDocumentCookie) {
      document.cookie = stringify(name, "", {
        ...this._options.defaultSetCookieOptions,
        ...options,
        expires: 0,
        maxAge: 0,
      });
    } else {
      this._setCookies[name] = {
        ...this._options.defaultSetCookieOptions,
        ...options,
        expires: 0,
        maxAge: 0,
      };
    }
  }

  get(name: string): string | undefined {
    if (this._availDocumentCookie) {
      this._cookies = parse(document.cookie);
    }
    return this._cookies[name];
  }

  toSetCookieString(): string {
    const setCookieParts = [] as string[];
    for (const [name, option] of Object.entries(this._setCookies)) {
      setCookieParts.push(stringify(name, this._cookies[name] ?? "", option));
    }
    return setCookieParts.join("; ");
  }
}
