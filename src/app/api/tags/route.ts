import pool from "@/lib/db";
import log from "@/logs/setting";
import { CommonResponse } from "@/types/response";
import { codeMap, codeMapMsg } from "@/utils/backendStatus";
import { paramsCheck } from "@/utils/paramsCheck";
import { NextRequest } from "next/server";

export async function POST(_req: NextRequest, ctx: RouteContext<"/api/tags">) {
  const body = await _req.json();
  const paramsStatus = paramsCheck(body, {
    tagName: {
      type: "string",
      length: 10,
      rule: /^[\p{L}\p{Script=Han}\d]+$/u,
    },
  });

  if (!paramsStatus.flag) {
    const code = paramsStatus.codes.pop() || codeMap.serverError;
    return Response.json({
      code: code || codeMap.serverError,
      msg: codeMapMsg[code],
    } as CommonResponse);
  }

  try {
    await pool.query(`INSERT IGNORE INTO tag (name) VALUES (?)`, body.tagName);
    return Response.json({
      code: codeMap.success,
      msg: "添加tag成功",
    } as CommonResponse);
  } catch (err: any) {
    log(err.message);
    return Response.json({
      code: codeMap.serverError,
      msg: "服务器错误",
    } as CommonResponse);
  }
}

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/tags">) {
  try {
    const tags = (await pool.query(`select * from tag`))[0];
    return Response.json({
      code: codeMap.success,
      msg: "获取成功",
      data: tags,
    });
  } catch (err: any) {
    log(err.message);
    return Response.json({
      code: codeMap.serverError,
      msg: "服务器错误",
    } as CommonResponse);
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/tags">
) {
  try {
    const body = await _req.json();
    const paramsStatus = paramsCheck(body, {
      tagName: {
        type: "string",
        length: 10,
        rule: /^[\p{L}\p{Script=Han}\d]+$/u,
      },
    });
    if (!paramsStatus.flag) {
      const code = paramsStatus.codes.pop() || codeMap.serverError;
      return Response.json({
        code: code || codeMap.serverError,
        msg: codeMapMsg[code],
      } as CommonResponse);
    }
    await pool.query(`DELETE FROM tag WHERE name= ?;`, [body.tagName]);
    return Response.json({
      code: codeMap.success,
      msg: "删除成功",
    });
  } catch (err: any) {
    log(err.message);
    return Response.json({
      code: codeMap.serverError,
      msg: "服务器错误",
    } as CommonResponse);
  }
}
