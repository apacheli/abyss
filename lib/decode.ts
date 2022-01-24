import {
  array_16,
  array_32,
  bin_16,
  bin_32,
  bin_8,
  falsey,
  fixarray_min,
  fixmap_min,
  fixstr_min,
  float_32,
  float_64,
  int_16,
  int_32,
  int_64,
  int_8,
  map_16,
  map_32,
  negative_fixint_max,
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
const text_decode = (globalThis as any).Deno?.core.decode ??
  ((c) => (input?: BufferSource) => c.decode(input))(new TextDecoder());

// deno-fmt-ignore-next-line
const
  u8 = (e: E) => e.view.getUint8(e.offset++),
  u16 = (e: E) => e.view.getUint16(add(e)),
  u32 = (e: E) => e.view.getUint32(add(e, 4)),
  u64 = (e: E) => e.view.getBigUint64(add(e, 8)), // JavaScript is so bad at keeping precision

  i8 = (e: E) => e.view.getInt8(e.offset++),
  i16 = (e: E) => e.view.getInt16(add(e)),
  i32 = (e: E) => e.view.getInt32(add(e, 4)),
  i64 = (e: E) => e.view.getBigInt64(add(e, 8)),

  f32 = (e: E) => e.view.getFloat32(add(e, 4)),
  f64 = (e: E) => e.view.getFloat64(add(e, 8));

const decode_bin = (e: E, len: number) =>
  e.uint8.subarray(e.offset, e.offset + len);

const decode_fixarray = (e: E, len: number) => {
  const fixarray = new Array(len);
  for (let i = 0; i < len; i++) {
    fixarray[i] = decode_format(e);
  }
  return fixarray;
};

const decode_fixmap = (e: E, len: number) => {
  // deno-lint-ignore no-explicit-any
  const fixmap: any = {};
  for (let i = 0; i < len; i++) {
    fixmap[decode_format(e)] = decode_format(e);
  }
  return fixmap;
};

const decode_fixstr = (e: E, len: number) =>
  text_decode(e.uint8.subarray(add(e, len), e.offset));

export const decode_format = (e: E) => {
  const format = u8(e);

  // deno-fmt-ignore-next-line
  switch (format) {
    case nil: return null;
    case falsey: return false;
    case truthy: return true;
    case bin_8: return decode_bin(e, u8(e));
    case bin_16: return decode_bin(e, u16(e));
    case bin_32: return decode_bin(e, u32(e));
    // case ext_8:
    // case ext_16:
    // case ext_32:
    case float_32: return f32(e);
    case float_64: return f64(e);
    case uint_8: return u8(e);
    case uint_16: return u16(e);
    case uint_32: return u32(e);
    case uint_64: return u64(e);
    case int_8: return i8(e);
    case int_16: return i16(e);
    case int_32: return i32(e);
    case int_64: return i64(e);
    // case fixext_1:
    // case fixext_2:
    // case fixext_4:
    // case fixext_8:
    // case fixext_16:
    case str_8: return decode_fixstr(e, u8(e));
    case str_16: return decode_fixstr(e, u16(e));
    case str_32: return decode_fixstr(e, u32(e));
    case array_16: return decode_fixarray(e, u16(e));
    case array_32: return decode_fixarray(e, u32(e));
    case map_16: return decode_fixmap(e, u16(e));
    case map_32: return decode_fixmap(e, u32(e));
    default: {
      if (format < 128) {
        return format;
      }
      if (format < 144) {
        return decode_fixmap(e, format - fixmap_min);
      }
      if (format < 160) {
        return decode_fixarray(e, format - fixarray_min);
      }
      if (format < 224) {
        return decode_fixstr(e, format - fixstr_min);
      }
      if (format < negative_fixint_max) {
        return format - 256;
      }
      throw new Error(`Unsupported format "${format}"`);
    }
  }
};

export const decode = (uint8: Uint8Array) =>
  decode_format({ offset: 0, uint8, view: new DataView(uint8.buffer) });
