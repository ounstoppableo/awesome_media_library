import WebSocket from "ws";

import redisPool from "../lib/redis";
import log from "../logs/setting";
import { clientError, wsSend } from "..";
import { codeMap, codeMapMsg } from "@/utils/backendStatus";
import errorStringify from "@/utils/errorStringify";
import dayjs from "dayjs";
import { getPool } from "../lib/db";
import { paramsCheck } from "@/utils/paramsCheck";

export type operateType = "mediaInfoEdit";

export type WsOperateRequestDataType<T extends operateType> = {
  type: T;
  mediaId: string;
  token: string;
} & (T extends "mediaInfoEdit"
  ? {
      fileInfo: {
        title: string;
        tags: string[];
        status: string[];
      };
    }
  : never);
export type WsOperateResponseDataType = {};
export default async function operateRouter(
  ws: WebSocket,
  req: WsOperateRequestDataType<any>
) {
  const redisInst = await redisPool.acquire();
  await mediaInfoEdit(req, ws, redisInst);

  redisPool.release(redisInst);
}

const mediaInfoEdit = async (
  req: WsOperateRequestDataType<any>,
  ws: WebSocket,
  redisInst: any
) => {
  if (req.type === "mediaInfoEdit") {
    const paramsStatus = paramsCheck(req, {
      mediaId: { type: "number", required: true },
    });

    if (!paramsStatus.flag) {
      const code = paramsStatus.codes.pop() || codeMap.serverError;
      return clientError(ws, codeMapMsg[code], code);
    }

    const params = [];
    let sql = "UPDATE media SET";
    if (req.fileInfo.status) {
      sql += " status = ?,";
      params.push(JSON.stringify(req.fileInfo.status));
    }
    if (req.fileInfo.tags) {
      sql += " tags = ?,";
      params.push(JSON.stringify(req.fileInfo.tags.slice(0, 3)));
    }
    if (req.fileInfo.title) {
      sql += " title = ?,";
      params.push(req.fileInfo.title);
    }
    sql += "updateTime = ? WHERE id = ?;";
    params.push(dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"));
    params.push(req.mediaId);

    try {
      await getPool().query(sql, params);
      wsSend(ws, {
        type: "operate",
        data: {
          code: codeMap.success,
          msg: "操作成功",
        },
      });
    } catch (err: any) {
      log(errorStringify(err), "error");
      clientError(ws, codeMapMsg[codeMap.serverError], codeMap.serverError);
    }
  }
};
