import { getPool } from "@/lib/db";
import log from "@/logs/setting";
import { CommonResponse } from "@/types/response";
import { codeMap, codeMapMsg } from "@/utils/backendStatus";
import errorStringify from "@/utils/errorStringify";
import { NextRequest } from "next/server";

export async function POST(_req: NextRequest) {
  try {
    const body = await _req.json();
    if (
      !body.tags ||
      !Array.isArray(body.tags) ||
      (body.status && !Array.isArray(body.status))
    )
      return Response.json({
        code: codeMap.paramsIllegal,
        msg: codeMapMsg[codeMap.paramsIllegal],
      } as CommonResponse);
    if (!body.count) body.count = 1;
    if (!body.status) body.status = ["storage"];

    let sql = `SELECT * FROM media where `;
    const params: any[] = [];
    if (body.tags && body.tags.length > 0) {
      sql += `tags REGEXP ?`;
      params.push(body.tags.join("|"));
    }
    if (body.status && body.status.length > 0) {
      sql += `AND status REGEXP ?`;
      params.push(body.status.join("|"));
    }
    sql += `ORDER BY RAND() LIMIT ?`;
    params.push(body.count);

    const data: any[] = ((await getPool().query(sql, params))[0] as any) || [];
    const result = data.map((item: any) => ({
      ...item,
      tags: JSON.parse(item.tags),
      status: JSON.parse(item.status),
    }));

    return Response.json({
      code: codeMap.success,
      msg: "获取成功",
      data: result,
    });
  } catch (err: any) {
    log(errorStringify(err), "error");
    return Response.json({
      code: codeMap.serverError,
      msg: "服务器错误",
    } as CommonResponse);
  }
}
