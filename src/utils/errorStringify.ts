export default function errorStringify(err: Error) {
  return JSON.stringify(err, Object.getOwnPropertyNames(err), 2);
}
