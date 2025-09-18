import { v4 as uuidv4 } from "uuid";
let _buffer = [];
let _currentLimitQueue = [];
const LIMIT = 10;

export function enqueue(info) {
  let _resolve;
  const promise = new Promise((resolve) => {
    _resolve = resolve;
  });
  const _info = { ...info, id: uuidv4() };
  if (_currentLimitQueue.length < LIMIT) {
    _currentLimitQueue.push(_info);
    _resolve(_info);
  } else {
    _buffer.push({ info: _info, resolve: _resolve });
  }
  return promise;
}

export function dequeue(id) {
  const _index = _currentLimitQueue.findIndex((item) => item.id === id);
  if (_index !== -1) {
    _currentLimitQueue.splice(_index, 1);
    const _temp = _buffer.pop();
    if (_temp) {
      _currentLimitQueue.push(_temp.info);
      _temp.resolve(_temp.info);
    }
    _currentLimitQueue = _currentLimitQueue.filter((item) => item);
  }
}
export function clearQueue() {
  _currentLimitQueue = [];
}
