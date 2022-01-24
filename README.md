# Abyss

MessagePack codec.

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
