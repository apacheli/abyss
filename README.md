# Abyss

### About

Simple [MessagePack](https://msgpack.org/index.html) codec written in TypeScript
for Deno.

### Example

```ts
import {
  decode,
  encode,
} from "https://github.com/apacheli/abyss/raw/master/mod.ts";

const encoded = encode({
  hello: "world",
  array: [1, 2, 3],
  map: {
    yes: true,
    no: false,
    nil: null,
  },
});

const decoded = decode(encoded);
```

### Needs Fixing

- Decode `ext` and `fixext` formats, preferably without a structure.
- Encode `BigInt` types without losing precision when decoding back.
