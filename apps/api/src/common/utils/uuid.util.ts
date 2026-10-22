import { randomBytes } from 'node:crypto';

let lastTimestamp = 0;
let sequence = 0;

/**
 * Time-ordered UUID v7 (RFC 9562). Ids sort in creation order, even for ids
 * created in the same millisecond: the 12-bit `rand_a` field is used as a
 * monotonic counter, re-seeded randomly each millisecond (RFC 9562 §6.2, method 1).
 */
export function uuidv7(): string {
  let timestamp = Date.now();
  if (timestamp > lastTimestamp) {
    lastTimestamp = timestamp;
    sequence = randomBytes(2).readUInt16BE() & 0x7ff;
  } else {
    sequence++;
    if (sequence > 0xfff) {
      // Counter exhausted: borrow the next millisecond.
      lastTimestamp++;
      sequence = 0;
    }
    timestamp = lastTimestamp;
  }

  const bytes = randomBytes(16);
  bytes.writeUIntBE(timestamp, 0, 6);
  bytes[6] = 0x70 | (sequence >> 8);
  bytes[7] = sequence & 0xff;
  bytes[8] = 0x80 | (bytes[8] & 0x3f);

  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
