import { getPool } from "@/lib/db";
import log from "@/logs/setting";
import { CommonResponse } from "@/types/response";
import { codeMap, codeMapMsg } from "@/utils/backendStatus";
import errorStringify from "@/utils/errorStringify";
import { paramsCheck } from "@/utils/paramsCheck";
import dayjs from "dayjs";
import { NextRequest } from "next/server";

export async function POST(_req: NextRequest) {
  try {
    const body = await _req.json();
    if (!body.id) body.id = 999999;
    if (!body.pageSize) body.pageSize = 20;

    const paramsStatus = paramsCheck(body, {
      id: {
        type: "number",
        require: true,
      },
      startTime: {
        type: "number",
      },
      endTime: {
        type: "number",
      },
      type: {
        type: "string",
        length: 10,
      },
      tags: {
        type: "object",
      },
      status: {
        type: "object",
      },
      title: {
        type: "string",
      },
      pageSize: {
        type: "number",
        require: true,
      },
    });

    if (!paramsStatus.flag) {
      const code = paramsStatus.codes.pop() || codeMap.serverError;
      return Response.json({
        code: code || codeMap.serverError,
        msg: codeMapMsg[code],
      } as CommonResponse);
    }

    let sql = `
  SELECT *
  FROM media
  WHERE id < ?
`;
    const params: any[] = [];
    params.push(body.id);

    // 时间范围
    if (body.startTime && body.endTime) {
      sql += ` AND createTime > ? AND createTime < ?`;
      params.push(
        dayjs(body.startTime).format("YYYY-MM-DD HH:mm:ss"),
        dayjs(body.endTime).format("YYYY-MM-DD HH:mm:ss")
      );
    }

    // 类型筛选
    const types = body.type ? ["video", "audio", "image"] : [];
    if (types.length) {
      const placeholders = types.map(() => "?").join(",");
      sql += ` AND type IN (${placeholders})`;
      params.push(...types);
    }

    if (body.tags && body.tags.length > 0) {
      sql += ` AND tags REGEXP ?`;
      params.push(body.tags.join("|"));
    }

    if (body.status && body.status.length > 0) {
      sql += ` AND status REGEXP ?`;
      params.push(body.status.join("|"));
    }

    if (body.title) {
      sql += ` AND title REGEXP ?`;
      params.push(body.title);
    }

    // 排序 + 分页
    sql += ` ORDER BY id DESC LIMIT ?`;
    params.push(body.pageSize);

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
