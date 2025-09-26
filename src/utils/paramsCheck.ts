import { codeMap } from "./backendStatus";
import { checkIsNone } from "./convention";

export function paramsCheck(
  target: any,
  standard: any,
  status?: any
): { flag: boolean; message: string; codes: number[] } {
  const _status = status || { flag: true, message: "", codes: [] };
  if (!(standard instanceof Object)) return _status;
  if (!(target instanceof Object)) {
    _status.flag = false;
    _status.message += "缺少" + JSON.stringify(standard) + "\n";
  }
  for (let key in standard) {
    if (standard[key].type !== typeof target[key]) {
      _status.flag = false;
      _status.message = "key:" + key + "类型错误" + "\n";
      _status.codes.push(codeMap.paramsTypeError);
    } else {
      if (target[key].length > standard[key].length) {
        _status.flag = false;
        _status.message = "key:" + key + "长度超出限制" + "\n";
        _status.codes.push(codeMap.paramsLengthLimit);
      }
      if (standard[key].rule) {
        if (!standard[key].rule.test(target[key])) {
          _status.flag = false;
          _status.message = "key:" + key + "不符合规范" + "\n";
          _status.codes.push(codeMap.paramsIllegal);
        }
      }
    }

    if (standard[key].required && checkIsNone(target[key])) {
      _status.flag = false;
      _status.message = "key:" + key + "缺失" + "\n";
      _status.codes.push(codeMap.paramsIncompelete);
    }
    if (typeof standard[key].children === "object") {
      paramsCheck(target[key], standard[key].children, _status);
    }
  }
  return _status;
}
