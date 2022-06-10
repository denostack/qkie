import { assertEquals } from "https://deno.land/std@0.131.0/testing/asserts.ts";

import { parse } from "./cookie.ts";

Deno.test("cookie parse", () => {
  assertEquals(parse(""), {});
  assertEquals(parse("   "), {});
  assertEquals(parse("unknown"), {});
  assertEquals(parse("  unknown  "), {});

  assertEquals(parse("foo="), { foo: "" });
  assertEquals(parse("  foo  =  "), { foo: "" });
  assertEquals(parse("foo=;"), { foo: "" });
  assertEquals(parse("  foo  =  ;"), { foo: "" });

  assertEquals(parse("foo=foo value"), { foo: "foo value" });
  assertEquals(parse("foo=foo value;"), { foo: "foo value" });
  assertEquals(parse("  foo  =  foo value  "), { foo: "foo value" });
  assertEquals(parse("  foo  =  foo value  ;  "), { foo: "foo value" });

  assertEquals(parse("foo=foo value;bar=12345"), {
    foo: "foo value",
    bar: "12345",
  });
  assertEquals(parse("foo=foo value;bar=12345;"), {
    foo: "foo value",
    bar: "12345",
  });
  assertEquals(parse("  foo  =  foo value  ;  bar  =  12345  "), {
    foo: "foo value",
    bar: "12345",
  });
  assertEquals(parse("  foo  =  foo value  ;  bar  =  12345  ;  "), {
    foo: "foo value",
    bar: "12345",
  });
});
