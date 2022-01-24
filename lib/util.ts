export interface E {
  offset: number;
  uint8: Uint8Array;
  view: DataView;
}

// mimics the behavior of increment++ but works with any number
export const add = (e: E, addend = 2) => {
  const before_offset = e.offset;
  e.offset += addend;
  return before_offset;
};
