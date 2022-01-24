import {
  array_16,
  array_32,
  falsey,
  float_64,
  int_16,
  int_32,
  int_64,
  int_8,
  map_16,
  map_32,
  nil,
  str_16,
  str_32,
  str_8,
  truthy,
  uint_16,
  uint_32,
  uint_64,
  uint_8,
} from "./formats.ts";
import { add, type E } from "./util.ts";

// deno-lint-ignore no-explicit-any
const text_encode = (globalThis as any).Deno?.core.encode ??
  ((c) => (input?: string) => c.encode(input))(new TextEncoder());

// deno-fmt-ignore-next-line
const
  set = (e: E, b: number[]) => e.uint8.set(b, add(e, b.length)),

  u8 = (e: E, v: number) => e.view.setUint8(e.offset++, v),
  u16 = (e: E, v: number) => e.view.setUint16(add(e), v),
  u32 = (e: E, v: number) => e.view.setUint32(add(e, 4), v),
  u64 = (e: E, v: bigint) => e.view.setBigUint64(add(e, 8), v),

  i8 = (e: E, v: number) => e.view.setInt8(e.offset++, v),
  i16 = (e: E, v: number) => e.view.setInt16(add(e), v),
  i32 = (e: E, v: number) => e.view.setInt32(add(e, 4), v),
  i64 = (e: E, v: bigint) => e.view.setBigInt64(add(e, 8), v),

  // f32 = (e: E, v: number) => e.view.setFloat32(add(e, 4), v),
  f64 = (e: E, v: number) => e.view.setFloat64(add(e, 8), v);

const boolean = (e: E, bool: boolean) => u8(e, bool ? truthy : falsey);

const integer = (e: E, int: number) => {
  if (Number.isInteger(int)) {
    if (int < -2147483648) {
      u8(e, int_64);
      i64(e, BigInt(int));
    } else if (int < -32768) {
      u8(e, int_32);
      i32(e, int);
    } else if (int < -128) {
      u8(e, int_16);
      i16(e, int);
    } else if (int < -32) {
      u8(e, int_8);
      i8(e, int);
    } /* else if (int < 0) {
      u8(e, int);
    } */ else if (int < 128) {
      u8(e, int);
    } else if (int < 256) {
      u8(e, uint_8);
      u8(e, int);
    } else if (int < 65536) {
      u8(e, uint_16);
      u8(e, int);
    } else if (int < 4294967296) {
      u8(e, uint_32);
      u32(e, int);
    } else if (int < 18446744073709551616n) {
      u8(e, uint_64);
      u64(e, BigInt(int));
    }
  } else {
    u8(e, float_64);
    f64(e, int);
  }
};

export const array = (e: E, arr: unknown[]) => {
  const len = arr.length;
  if (len < 16) {
    u8(e, 144 + len);
  } else if (len < 65536) {
    u8(e, array_16);
    u16(e, len);
  } else if (len < 4294967296) {
    u8(e, array_32);
    u32(e, len);
  }
  for (let i = 0; i < len; i++) {
    encode_format(e, arr[i]);
  }
};

// deno-lint-ignore no-explicit-any
export const map = (e: E, map: any) => {
  const keys = Object.keys(map);
  const len = keys.length;
  if (len < 16) {
    u8(e, 128 + len);
  } else if (len < 65536) {
    u8(e, map_16);
    u16(e, len);
  } else if (len < 4294967296) {
    u8(e, map_32);
    u32(e, len);
  }
  for (let i = 0, k = keys[i]; i < keys.length; k = keys[++i]) {
    encode_format(e, k);
    encode_format(e, map[k]);
  }
};

const string = (e: E, str: string) => {
  const len = str.length;
  if (len < 32) {
    u8(e, 160 + len);
  } else if (len < 256) {
    u8(e, str_8);
    u8(e, len);
  } else if (len < 65536) {
    u8(e, str_16);
    u16(e, len);
  } else if (len < 4294967296) {
    u8(e, str_32);
    u32(e, len);
  }
  set(e, text_encode(str));
};

const encode_format = (e: E, value: unknown) => {
  // deno-fmt-ignore-next-line
  switch (typeof value) {
    case "boolean": return boolean(e, value);
    case "number": return integer(e, value);
    case "object": return value
      ? value.constructor === Array ? array(e, value) : map(e, value)
      : u8(e, nil);
    case "string": return string(e, value);
    default: throw new Error(`Unsupported type '${typeof value}'`);
  }
};

export const encode = (value: unknown) => {
  const uint8 = new Uint8Array(2048);
  const e = {
    offset: 0,
    uint8,
    view: new DataView(uint8.buffer),
  };
  encode_format(e, value);
  return uint8.subarray(0, e.offset);
};
