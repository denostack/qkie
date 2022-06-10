export interface SetCookieOptions {
  expires?: number | Date; // Expires second
  maxAge?: number; // Maxage first
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
  priority?: "low" | "medium" | "high";
}

export function stringify(
  name: string,
  value: string,
  options: SetCookieOptions = {},
) {
  let result = name + "=" + value;

  if (typeof options.maxAge === "number") {
    const maxAge = options.maxAge;
    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    result += "; Max-Age=" + Math.floor(maxAge);
  }

  if (typeof options.expires === "number" || options.expires instanceof Date) {
    const expires = typeof options.expires === "number"
      ? new Date(options.expires)
      : options.expires;
    result += "; Expires=" + expires.toUTCString();
  }

  if (options.domain) {
    result += "; Domain=" + options.domain;
  }

  if (options.path) {
    result += "; Path=" + options.path;
  }

  if (options.httpOnly) {
    result += "; HttpOnly";
  }

  if (options.secure) {
    result += "; Secure";
  }

  if (options.priority) {
    switch (options.priority) {
      case "low":
        result += "; Priority=Low";
        break;
      case "medium":
        result += "; Priority=Medium";
        break;
      case "high":
        result += "; Priority=High";
        break;
      default:
        throw new TypeError("option priority is invalid");
    }
  }

  if (options.sameSite) {
    switch (options.sameSite) {
      case "lax":
        result += "; SameSite=Lax";
        break;
      case "strict":
        result += "; SameSite=Strict";
        break;
      case "none":
        result += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }

  return result;
}
