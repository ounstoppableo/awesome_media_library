import redisPool from "@/lib/redis";
import { writeFile } from "fs/promises";
import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import { objectToBuffer } from "@/utils/objAndBufferTransform";
import { WsResponseMsgType, clientError, tokenMapUsername, wsSend } from "..";
import log from "@/logs/setting";
import { resolve } from "path";
import { deleteFile, getFileSize, isFileExist } from "@/utils/fileOperate";
import fs from "fs/promises";
import {
  closeSync,
  createWriteStream,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "fs";
import { get } from "http";
import { codeMap } from "@/utils/backendStatus";
import { paramsCheck } from "@/utils/paramsCheck";

export type uploadType = "uploadStart" | "uploadEnd" | "uploading";
export type WsUploadRequestDataType<T extends uploadType> = {
  type: T;
  fileId?: string;
  token: string;
} & (T extends "uploadStart"
  ? {
      fileInfo: {
        clientFileId: string;
        title: string;
        tags: string[];
        size: number;
        type: string;
        createTime: string;
        updateTime: string;
        ext: string;
      };
    }
  : T extends "uploading"
  ? {
      fileId: string;
      chunk: Uint8Array;
      processChunkIndex: number;
      ext: string;
    }
  : T extends "uploadEnd"
  ? { fileId: string; ext: string; size?: number }
  : never);
export type WsUploadResponseDataType<T extends uploadType> = {
  type: T;
  fileId: string;
} & (T extends "uploadStart"
  ? {
      clientFileId: string;
      hadExist?: boolean;
      processedChunkIndexs?: number[];
    }
  : T extends "uploadEnd"
  ? {
      sourcePath: string;
      size: number;
    }
  : T extends "uploading"
  ? {
      processedChunkIndex: number;
    }
  : never);

const redisNameSpace = {
  fileInfo: () => "fileInfo",
};

const tempPath = resolve(__dirname, "../../../temp");

const fileStorePath = resolve(__dirname, "../../../public/media");

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export default async function uploadRouter(
  ws: WebSocket,
  req: WsUploadRequestDataType<any>
) {
  const redisInst = await redisPool.acquire();
  await uploadStart(req, ws, redisInst);
  await uploading(req, ws, redisInst);
  await uploadEnd(req, ws, redisInst);
  redisPool.release(redisInst);
}

const getTempPath = (fileId: string, username: string) => {
  return resolve(tempPath, username, fileId);
};
const getStoragePath = (
  fileId: string,
  ext: string,
  username: string,
  absolute = true
) => {
  if (absolute) {
    return resolve(
      fileStorePath,
      username,
      fileId && ext ? fileId + "." + ext : ""
    );
  } else {
    return "/media" + "/" + username + "/" + fileId + "." + ext;
  }
};

const uploadStart = async (
  req: WsUploadRequestDataType<any>,
  ws: WebSocket,
  redisInst: any
) => {
  if (req.type === "uploadStart") {
    const paramsStatus = paramsCheck(req, {
      type: { type: "string", required: true },
      token: { type: "string", required: true },
      fileInfo: {
        type: "object",
        required: true,
        children: {
          clientFileId: { type: "string", required: true },
          title: { type: "string", required: true },
          tags: { type: "object", required: true },
          size: { type: "number", required: true },
          type: { type: "string", required: true },
          createTime: { type: "string", required: true },
          updateTime: { type: "string", required: true },
          ext: { type: "string", required: true },
        },
      },
    });

    if (!paramsStatus.flag) {
      log(paramsStatus.message);
      return clientError(ws, "入参不完整", codeMap.paramsIncompelete);
    }

    const _req: WsUploadRequestDataType<"uploadStart"> =
      req as WsUploadRequestDataType<"uploadStart">;
    let fileId;
    let fileInfo;
    // if (_req.fileInfo.size > MAX_FILE_SIZE)
    //   return clientError(
    //     ws,
    //     `文件大小限制为${MAX_FILE_SIZE / 1024 / 1024}MB以内`,
    //     codeMap.fileExceedLimit
    //   );

    if (_req.fileId) {
      fileInfo = JSON.parse(
        (await redisInst.HGET(redisNameSpace.fileInfo(), _req.fileId)) || "null"
      );
      fileInfo && (fileId = _req.fileId);
      if (
        fileId &&
        isFileExist(
          getStoragePath(
            fileId,
            _req.fileInfo.ext,
            tokenMapUsername[_req.token]
          )
        )
      ) {
        try {
          const res: WsResponseMsgType<"upload"> = {
            type: "upload",
            data: {
              type: "uploadEnd",
              fileId,
              clientFileId: _req.fileInfo.clientFileId,
              sourcePath: getStoragePath(
                fileId,
                _req.fileInfo.ext,
                tokenMapUsername[_req.token],
                false
              ),
              size: statSync(
                getStoragePath(
                  fileId,
                  _req.fileInfo.ext,
                  tokenMapUsername[_req.token]
                )
              ).size,
            } as WsUploadResponseDataType<"uploadEnd">,
          };
          return wsSend(ws, res);
        } catch (err: any) {
          log(err.message, "error");
          clientError(ws, "服务器错误");
        }
      }
      if (
        fileId &&
        isFileExist(getTempPath(fileId, tokenMapUsername[_req.token]))
      ) {
        try {
          const files = readdirSync(
            getTempPath(fileId, tokenMapUsername[_req.token])
          );
          const processedChunkIndexs = files
            .map((f) => parseInt(f, 10))
            .filter((n) => !isNaN(n));
          if (processedChunkIndexs.length !== 0) {
            const res: WsResponseMsgType<"upload"> = {
              type: "upload",
              data: {
                type: "uploadStart",
                fileId,
                clientFileId: _req.fileInfo.clientFileId,
                processedChunkIndexs: processedChunkIndexs,
              },
            };
            return wsSend(ws, res);
          }
        } catch (e: any) {
          log(e.message, "error");
        }
      }
    }
    if (!fileId) {
      fileId = uuidv4();
      await redisInst.HSET(
        redisNameSpace.fileInfo(),
        fileId,
        JSON.stringify(_req.fileInfo)
      );
    }

    await fs.mkdir(getTempPath(fileId, tokenMapUsername[_req.token]), {
      recursive: true,
    });

    const res: WsResponseMsgType<"upload"> = {
      type: "upload",
      data: {
        type: "uploadStart",
        fileId,
        clientFileId: _req.fileInfo.clientFileId,
      } as WsUploadResponseDataType<"uploadStart">,
    };
    wsSend(ws, res);
  }
};

const fileLock: any = {};

const uploading = async (
  req: WsUploadRequestDataType<any>,
  ws: WebSocket,
  redisInst: any
) => {
  if (req.type === "uploading") {
    const paramsStatus = paramsCheck(req, {
      type: { type: "string", required: true },
      token: { type: "string", required: true },
      fileId: { type: "string", required: true },
      chunk: { type: "object", required: true },
      processChunkIndex: { type: "number", required: true },
      ext: { type: "string", required: true },
    });

    if (!paramsStatus.flag) {
      log(paramsStatus.message);
      return clientError(ws, "入参不完整", codeMap.paramsIncompelete);
    }

    const _req: WsUploadRequestDataType<"uploading"> =
      req as WsUploadRequestDataType<"uploading">;
    try {
      const fileTempPath = resolve(
        getTempPath(_req.fileId, tokenMapUsername[_req.token]),
        _req.processChunkIndex + ""
      );
      // if (_req.chunk.byteLength * _req.processChunkIndex > MAX_FILE_SIZE)
      //   return clientError(
      //     ws,
      //     `文件大小限制为${MAX_FILE_SIZE / 1024 / 1024}MB以内`,
      //     codeMap.fileExceedLimit
      //   );
      if (_req.fileId && isFileExist(fileTempPath)) {
        const res: WsResponseMsgType<"upload"> = {
          type: "upload",
          data: {
            type: "uploading",
            fileId: _req.fileId,
            processedChunkIndex: _req.processChunkIndex,
          } as WsUploadResponseDataType<"uploading">,
        };
        return wsSend(ws, res);
      }

      if (isFileExist(getTempPath(_req.fileId, tokenMapUsername[_req.token]))) {
        if (fileLock[fileTempPath]) return;
        fileLock[fileTempPath] = true;
        await fs.writeFile(fileTempPath, _req.chunk, { flag: "w" });
        delete fileLock[fileTempPath];
        const res: WsResponseMsgType<"upload"> = {
          type: "upload",
          data: {
            type: "uploading",
            fileId: _req.fileId,
            processedChunkIndex: _req.processChunkIndex,
          } as WsUploadResponseDataType<"uploading">,
        };
        wsSend(ws, res);
      } else {
        clientError(ws, "请先触发uploadStart事件", codeMap.errorOperate);
      }
    } catch (e: any) {
      log(e.message, "error");
      clientError(ws, "服务器错误");
    }
  }
};

const uploadEnd = async (
  req: WsUploadRequestDataType<any>,
  ws: WebSocket,
  redisInst: any
) => {
  if (req.type === "uploadEnd") {
    const paramsStatus = paramsCheck(req, {
      type: { type: "string", required: true },
      token: { type: "string", required: true },
      fileId: { type: "string", required: true },
      ext: { type: "string", required: true },
    });

    if (!paramsStatus.flag) {
      log(paramsStatus.message);
      return clientError(ws, "入参不完整", codeMap.paramsIncompelete);
    }

    const _req: WsUploadRequestDataType<"uploadEnd"> =
      req as WsUploadRequestDataType<"uploadEnd">;

    const fileTempPath = getTempPath(_req.fileId, tokenMapUsername[_req.token]);
    const targetDir = getStoragePath("", "", tokenMapUsername[_req.token]);
    const targetPath = getStoragePath(
      _req.fileId,
      _req.ext,
      tokenMapUsername[_req.token]
    );
    if (_req.fileId && isFileExist(targetPath)) {
      try {
        const res: WsResponseMsgType<"upload"> = {
          type: "upload",
          data: {
            fileId: _req.fileId,
            type: "uploadEnd",
            sourcePath: getStoragePath(
              _req.fileId,
              _req.ext,
              tokenMapUsername[_req.token],
              false
            ),
            size: statSync(targetPath).size,
          },
        };
        wsSend(ws, res);

        isFileExist(fileTempPath) &&
          (await fs.rm(fileTempPath, { recursive: true, force: true }));
      } catch (e: any) {
        log(e.message, "error");
        clientError(ws, "服务器错误");
      } finally {
        return;
      }
    }
    try {
      if (!isFileExist(targetDir)) {
        mkdirSync(targetDir);
      }
      const fd = openSync(targetPath, "a");

      if (isFileExist(fileTempPath)) {
        let i = 0;
        foo: while (true) {
          try {
            const chunk = readFileSync(resolve(fileTempPath, i + ""));
            try {
              writeFileSync(fd, chunk);
            } catch (e: any) {
              closeSync(fd);
              log(e.message, "error");
              return clientError(ws, "服务器错误");
            }
            i++;
          } catch (e: any) {
            log(e.message, "error");
            break foo;
          }
        }
        closeSync(fd);

        try {
          const res: WsResponseMsgType<"upload"> = {
            type: "upload",
            data: {
              fileId: _req.fileId,
              type: "uploadEnd",
              sourcePath: getStoragePath(
                _req.fileId,
                _req.ext,
                tokenMapUsername[_req.token],
                false
              ),
              size: statSync(targetPath).size,
            } as WsUploadResponseDataType<"uploadEnd">,
          };
          wsSend(ws, res);
          isFileExist(fileTempPath) &&
            (await fs.rm(fileTempPath, { recursive: true, force: true }));
        } catch (e: any) {
          log(e.message, "error");
          clientError(ws, "服务器错误");
        }
      } else {
        clientError(ws, "请先触发uploadStart事件", codeMap.errorOperate);
      }
    } catch (e: any) {
      log(e.message, "error");
      clientError(ws, "服务器错误");
    }
  }
};
