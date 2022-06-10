export function parse(cookie: string): Record<string, string> {
  const result = {} as Record<string, string>;

  let pos = 0;
  let buf = "";
  let key = "";
  let state = 0;

  while (1) {
    const char = cookie[pos++];
    switch (char) {
      case "=": {
        if (state === 0) {
          key = buf.trim();
          buf = "";
        }
        state = 1;
        continue;
      }
      case ";": {
        if (state === 1) {
          result[key] = buf.trim();
          buf = "";
        }
        state = 0;
        continue;
      }
      case undefined: {
        break;
      }
      default: {
        buf += char;
        continue;
      }
    }
    break;
  }
  if (state === 1) {
    result[key] = buf.trim();
  }
  return result;
}
