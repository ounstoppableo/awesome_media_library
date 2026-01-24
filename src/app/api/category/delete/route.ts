import useAuth from "@/hooks/useAuth";
import { getPool } from "@/lib/db";
import log from "@/logs/setting";
import { CategoryDetail } from "@/types/media";
import { CommonResponse } from "@/types/response";
import { codeMap, codeMapMsg } from "@/utils/backendStatus";

import { NextRequest } from "next/server";

export async function POST(_req: NextRequest) {
  const token = _req.headers.get("Authorization");
  if (!token || !(await useAuth(token)))
    return Response.json({
      code: codeMap.limitsOfAuthority,
      msg: codeMapMsg[codeMap.limitsOfAuthority],
    } as CommonResponse);
  let body;
  try {
    body = await _req.json();
  } catch (e) {
    body = {} as any;
  }
  if (!body.ids || !(body.ids instanceof Array))
    return Response.json({
      code: codeMap.paramsIllegal,
      message: codeMapMsg[codeMap.paramsIllegal],
    });
  const conn = await getPool().getConnection();
  try {
    await conn.query("delete from category where id IN (?)", [body.ids]);
    return Response.json({
      code: codeMap.success,
      msg: codeMapMsg[codeMap.success],
    } as CommonResponse);
  } catch (err: any) {
    log(err);
    return Response.json({
      code: codeMap.serverError,
      msg: codeMapMsg[codeMap.serverError],
    } as CommonResponse);
  } finally {
    conn.release();
  }
}
