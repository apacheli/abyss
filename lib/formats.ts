// https://github.com/msgpack/msgpack/blob/master/spec.md#formats

// deno-fmt-ignore-next-line
export const
  positive_fixint_min = 0x00,
  positive_fixint_max = 0x7f,

  fixmap_min = 0x80,
  fixmap_max = 0x8f,

  fixarray_min = 0x90,
  fixarray_max = 0x9f,

  fixstr_min = 0xa0,
  fixstr_max = 0xbf,

  negative_fixint_min = 0xe0,
  negative_fixint_max = 0xff;

// deno-fmt-ignore-next-line
export const
  nil = 0xc0,
  // never_used = 0xc1,
  falsey = 0xc2,
  truthy = 0xc3,
  bin_8 = 0xc4,
  bin_16 = 0xc5,
  bin_32 = 0xc6,
  ext_8 = 0xc7,
  ext_16 = 0xc8,
  ext_32 = 0xc9,
  float_32 = 0xca,
  float_64 = 0xcb,
  uint_8 = 0xcc,
  uint_16 = 0xcd,
  uint_32 = 0xce,
  uint_64 = 0xcf,
  int_8 = 0xd0,
  int_16 = 0xd1,
  int_32 = 0xd2,
  int_64 = 0xd3,
  fixext_1 = 0xd4,
  fixext_2 = 0xd5,
  fixext_4 = 0xd6,
  fixext_8 = 0xd7,
  fixext_16 = 0xd8,
  str_8 = 0xd9,
  str_16 = 0xda,
  str_32 = 0xdb,
  array_16 = 0xdc,
  array_32 = 0xdd,
  map_16 = 0xde,
  map_32 = 0xdf;
