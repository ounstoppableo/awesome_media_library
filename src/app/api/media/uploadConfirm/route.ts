import useAuth from "@/hooks/useAuth";
import pool from "@/lib/db";
import redisPool from "@/lib/redis";
import log from "@/logs/setting";
import { CommonResponse } from "@/types/response";
import { codeMap, codeMapMsg } from "@/utils/backendStatus";
import { NextRequest } from "next/server";

const redisNameSpace = {
  fileInfo: (username: string) => "fileInfo" + "_" + username,
  fileInvariantInfo: (username: string) => "fileInvariantInfo" + "_" + username,
};

const confirmLock: any = {};

export async function POST(
  _req: NextRequest,
  ctx: RouteContext<"/api/media/uploadConfirm">
) {
  const token = _req.headers.get("Authorization");
  if (!token || !(await useAuth(token)))
    return Response.json({
      code: codeMap.limitsOfAuthority,
      msg: codeMapMsg[codeMap.limitsOfAuthority],
    } as CommonResponse);
  //   const body = await _req.json();
  const username = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString("utf-8") || "{}"
  ).data;
  if (!username)
    return Response.json({
      code: codeMap.limitsOfAuthority,
      msg: codeMapMsg[codeMap.limitsOfAuthority],
    } as CommonResponse);
  if (confirmLock[username])
    return Response.json({
      code: codeMap.errorOperate,
      msg: codeMapMsg[codeMap.errorOperate],
    } as CommonResponse);
  confirmLock[username] = true;
  try {
    const redisInst = await redisPool.acquire();
    try {
      const fileInfo = await redisInst.HGETALL(
        redisNameSpace.fileInfo(username)
      );
      const fileInvariantInfo = await redisInst.HGETALL(
        redisNameSpace.fileInvariantInfo(username)
      );

      const _fileInfos = [];
      for (let key in fileInvariantInfo) {
        if (fileInfo[key]) {
          _fileInfos.push({
            ...JSON.parse(fileInfo[key]),
            ...JSON.parse(fileInvariantInfo[key]),
          });
        }
      }
      const promises = _fileInfos.map((file) => {
        return pool.query(
          "INSERT INTO media (title, size, tags,type,sourcePath,createTime,updateTime,status) VALUES (?, ?, ?,?,?,?,?,?)",
          [
            file.title,
            file.size,
            JSON.stringify(file.tags),
            file.type,
            file.sourcePath,
            file.createTime,
            file.updateTime,
            JSON.stringify(file.status),
          ]
        );
      });
      await Promise.all(promises);
      await redisInst.DEL(redisNameSpace.fileInfo(username));
      await redisInst.DEL(redisNameSpace.fileInvariantInfo(username));
      return Response.json({
        code: codeMap.success,
        msg: "添加成功",
      } as CommonResponse);
    } catch (err) {
      return Response.json({
        code: codeMap.serverError,
        msg: codeMapMsg[codeMap.serverError],
      } as CommonResponse);
    } finally {
      redisPool.release(redisInst);
    }
  } catch (err) {
    return Response.json({
      code: codeMap.serverError,
      msg: codeMapMsg[codeMap.serverError],
    } as CommonResponse);
  } finally {
    confirmLock[username] = false;
  }
}
