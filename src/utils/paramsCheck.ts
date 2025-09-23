export function paramsCheck(
  target: any,
  standard: any,
  status?: any
): { flag: boolean; message: string } {
  const _status = status || { flag: true, message: "" };
  if (!(standard instanceof Object)) return _status;
  if (!(target instanceof Object)) {
    _status.flag = false;
    _status.message += "缺少" + JSON.stringify(standard) + "\n";
  }
  for (let key in standard) {
    if (standard[key].type !== typeof target[key]) {
      _status.flag = false;
      _status.flag = "key:" + key + "类型错误" + "\n";
    }
    if (standard[key].required && !target[key]) {
      _status.flag = false;
      _status.flag = "key:" + key + "缺失" + "\n";
    }
    if (typeof standard[key].children === "object") {
      paramsCheck(target[key], standard[key].children, _status);
    }
  }
  return _status;
}
