import useAuth from "@/hooks/useAuth";
import log from "@/logs/setting";
import { CommonResponse } from "@/types/response";
import { codeMap, codeMapMsg } from "@/utils/backendStatus";
import errorStringify from "@/utils/errorStringify";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
  try {
    const token = _req.headers.get("Authorization");
    if (!token || !(await useAuth(token)))
      return Response.json({
        code: codeMap.limitsOfAuthority,
        msg: codeMapMsg[codeMap.limitsOfAuthority],
      } as CommonResponse);

    return Response.json({
      code: codeMap.success,
      msg: "认证成功",
    } as CommonResponse);
  } catch (err: any) {
    log(errorStringify(err));
    return Response.json({
      code: codeMap.serverError,
      msg: "服务器错误",
    } as CommonResponse);
  }
}
