import useAuth from "@/hooks/useAuth";
import { getPool } from "@/lib/db";
import log from "@/logs/setting";
import { CommonResponse } from "@/types/response";
import { codeMap, codeMapMsg } from "@/utils/backendStatus";
import errorStringify from "@/utils/errorStringify";
import {
  deleteFile,
  getStoragePath,
  getThumbnailPath,
} from "@/utils/fileOperate";
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
    const types = body.type ? [body.type] : [];
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

export async function DELETE(_req: NextRequest) {
  try {
    const body = await _req.json();
    const token = _req.headers.get("Authorization");
    if (!token || !(await useAuth(token)))
      return Response.json({
        code: codeMap.limitsOfAuthority,
        msg: codeMapMsg[codeMap.limitsOfAuthority],
      } as CommonResponse);
    const username = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString("utf-8") || "{}"
    ).data;
    if (!username)
      return Response.json({
        code: codeMap.limitsOfAuthority,
        msg: codeMapMsg[codeMap.limitsOfAuthority],
      } as CommonResponse);

    const paramsStatus = paramsCheck(body, {
      ids: {
        type: "object",
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

    if (body.ids.length > 0) {
      let select_sql = "select sourcePath from media where id in (";
      let delete_sql = "delete from media where id in (";
      for (let i = 0; i < body.ids.length; i++) {
        select_sql += "?,";
        delete_sql += "?,";
      }
      select_sql = select_sql.slice(0, select_sql.length - 1);
      delete_sql = delete_sql.slice(0, delete_sql.length - 1);
      select_sql += ");";
      delete_sql += ");";
      const sourcePaths = (
        await getPool().query(select_sql, body.ids)
      )[0] as any[];
      await getPool().query(delete_sql, body.ids);
      if (sourcePaths) {
        for (let i = 0; i < sourcePaths.length; i++) {
          const sourcePath = sourcePaths[i].sourcePath;
          const fileId = (sourcePath.split(".")[0] as string).replace(
            `/media/${username}/`,
            ""
          );
          const ext = sourcePath.split(".")[1] as string;
          const filePath = getStoragePath(fileId, ext, username);
          const thumbnailPath = getThumbnailPath(fileId, username);
          await deleteFile(filePath || "");
          await deleteFile(thumbnailPath || "");
        }
      }
    }

    return Response.json({
      code: codeMap.success,
      msg: "操作成功",
    } as CommonResponse);
  } catch (err: any) {
    log(errorStringify(err));
    return Response.json({
      code: codeMap.serverError,
      msg: "服务器错误",
    } as CommonResponse);
  }
}
