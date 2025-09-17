import { encode, decode } from "@msgpack/msgpack";

export function objectToBuffer(obj: Object) {
  return encode(obj);
}

export function bufferToObject(buf: ArrayBuffer | Buffer) {
  return decode(buf);
}
