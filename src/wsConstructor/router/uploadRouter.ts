import redisPool from "../lib/redis";
import { writeFile } from "fs/promises";
import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import { WsResponseMsgType, clientError, tokenMapUsername, wsSend } from "..";
import log from "../logs/setting";
import { resolve } from "path";
import {
  deleteFile,
  fileStorePath,
  getFileSize,
  getFileType,
  getStoragePath,
  getTempPath,
  getThumbnailPath,
  isFileExist,
  tempPath,
} from "@/utils/fileOperate";
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
import { codeMap, codeMapMsg } from "@/utils/backendStatus";
import { paramsCheck } from "@/utils/paramsCheck";
import errorStringify from "@/utils/errorStringify";
import thumbnailGenerate from "@/utils/thumbnailGenerate";

export type uploadType =
  | "uploadStart"
  | "uploadEnd"
  | "uploading"
  | "delete"
  | "edit";

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
  : T extends "delete"
  ? { fileId: string; ext: string }
  : T extends "edit"
  ? {
      fildId: string;
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
      thumbnail: string;
    }
  : T extends "uploading"
  ? {
      processedChunkIndex: number;
    }
  : T extends "edit"
  ? {}
  : never);

const redisNameSpace = {
  fileInfo: (username: string) => "fileInfo" + "_" + username,
  fileInvariantInfo: (username: string) => "fileInvariantInfo" + "_" + username,
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;

if (!isFileExist(fileStorePath)) {
  mkdirSync(fileStorePath);
}
log("test");

export default async function uploadRouter(
  ws: WebSocket,
  req: WsUploadRequestDataType<any>
) {
  const redisInst = await redisPool.acquire();
  await uploadStart(req, ws, redisInst);
  await uploading(req, ws, redisInst);
  await uploadEnd(req, ws, redisInst);
  await deleteFileCb(req, ws, redisInst);
  await editCb(req, ws, redisInst);
  redisPool.release(redisInst);
}

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
          clientFileId: { type: "string" },
          title: { type: "string", required: true },
          tags: { type: "object", required: true },
          size: { type: "number", required: true },
          type: { type: "string", required: true },
          createTime: { type: "string", required: true },
          updateTime: { type: "string", required: true },
          ext: { type: "string", required: true },
          status: { type: "object", required: true },
        },
      },
    });

    if (!paramsStatus.flag) {
      const code = paramsStatus.codes.pop() || codeMap.serverError;
      return clientError(ws, codeMapMsg[code], code);
    }

    const _req: WsUploadRequestDataType<"uploadStart"> =
      req as WsUploadRequestDataType<"uploadStart">;
    let fileId;
    let fileInfo;
    if (_req.fileInfo.size > MAX_FILE_SIZE)
      return clientError(
        ws,
        `文件大小限制为${MAX_FILE_SIZE / 1024 / 1024}MB以内`,
        codeMap.fileExceedLimit
      );

    if (_req.fileId) {
      fileInfo = JSON.parse(
        (await redisInst.HGET(
          redisNameSpace.fileInfo(tokenMapUsername[_req.token]),
          _req.fileId
        )) || "null"
      );
      fileInfo && (fileId = _req.fileId);

      if (fileId) {
        const tempPath = getTempPath(fileId, tokenMapUsername[_req.token]);
        const storagePath = getStoragePath(
          fileId,
          _req.fileInfo.ext,
          tokenMapUsername[_req.token]
        );
        const storagePathRelative = getStoragePath(
          fileId,
          _req.fileInfo.ext,
          tokenMapUsername[_req.token],
          false
        );
        if (!tempPath || !storagePath || !storagePathRelative)
          return clientError(ws, "权限不足", codeMap.limitsOfAuthority);
        if (isFileExist(storagePath)) {
          try {
            let thumbnail: any = "";
            if (getFileType(storagePath) === "image") {
              thumbnail = storagePathRelative;
            }
            if (getFileType(storagePath) === "video") {
              thumbnail = await thumbnailGenerate(
                storagePath,
                _req.fileId,
                tokenMapUsername[_req.token]
              );
            }
            const res: WsResponseMsgType<"upload"> = {
              type: "upload",
              data: {
                type: "uploadEnd",
                fileId,
                clientFileId: _req.fileInfo.clientFileId,
                sourcePath: storagePathRelative,
                size: statSync(storagePath).size,
                thumbnail: thumbnail,
              } as WsUploadResponseDataType<"uploadEnd">,
            };
            return wsSend(ws, res);
          } catch (err: any) {
            log(errorStringify(err), "error");
            return clientError(ws, "服务器错误");
          }
        }
        if (isFileExist(tempPath)) {
          try {
            const files = readdirSync(tempPath);
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
          } catch (err: any) {
            log(errorStringify(err), "error");
          }
        }
      }
    }
    if (!fileId) {
      fileId = uuidv4();
      await redisInst.HSET(
        redisNameSpace.fileInfo(tokenMapUsername[_req.token]),
        fileId,
        JSON.stringify(_req.fileInfo)
      );
    }
    const tempPath = getTempPath(fileId, tokenMapUsername[_req.token]);
    if (!tempPath)
      return clientError(ws, "权限不足", codeMap.limitsOfAuthority);
    tempPath &&
      (await fs.mkdir(tempPath, {
        recursive: true,
      }));

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
      const code = paramsStatus.codes.pop() || codeMap.serverError;
      return clientError(ws, codeMapMsg[code], code);
    }

    const _req: WsUploadRequestDataType<"uploading"> =
      req as WsUploadRequestDataType<"uploading">;

    const tempPath = getTempPath(_req.fileId, tokenMapUsername[_req.token]);
    if (!tempPath)
      return clientError(ws, "权限不足", codeMap.limitsOfAuthority);
    try {
      const fileTempPath = resolve(tempPath, _req.processChunkIndex + "");
      if (_req.chunk.byteLength * _req.processChunkIndex > MAX_FILE_SIZE)
        return clientError(
          ws,
          `文件大小限制为${MAX_FILE_SIZE / 1024 / 1024}MB以内`,
          codeMap.fileExceedLimit
        );
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

      if (isFileExist(tempPath)) {
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
    } catch (err: any) {
      log(errorStringify(err), "error");
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
      const code = paramsStatus.codes.pop() || codeMap.serverError;
      return clientError(ws, codeMapMsg[code], code);
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
    const targetPathRelative = getStoragePath(
      _req.fileId,
      _req.ext,
      tokenMapUsername[_req.token],
      false
    );
    if (!fileTempPath || !targetDir || !targetPath || !targetPathRelative)
      return clientError(ws, "权限不足", codeMap.limitsOfAuthority);
    if (_req.fileId && isFileExist(targetPath)) {
      try {
        let thumbnail: any = "";
        if (getFileType(targetPath) === "image") {
          thumbnail = targetPathRelative;
        }
        if (getFileType(targetPath) === "video") {
          thumbnail = await thumbnailGenerate(
            targetPath,
            _req.fileId,
            tokenMapUsername[_req.token]
          );
        }
        const res: WsResponseMsgType<"upload"> = {
          type: "upload",
          data: {
            fileId: _req.fileId,
            type: "uploadEnd",
            sourcePath: targetPathRelative,
            size: statSync(targetPath).size,
            thumbnail: thumbnail,
          } as WsUploadResponseDataType<"uploadEnd">,
        };

        wsSend(ws, res);

        isFileExist(fileTempPath) &&
          (await fs.rm(fileTempPath, { recursive: true, force: true }));
      } catch (err: any) {
        log(errorStringify(err), "error");
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
            } catch (err: any) {
              closeSync(fd);
              log(errorStringify(err), "error");
              return clientError(ws, "服务器错误");
            }
            i++;
          } catch (err: any) {
            log(errorStringify(err), "error");
            break foo;
          }
        }
        closeSync(fd);

        try {
          let thumbnail: any = "";
          if (getFileType(targetPath) === "image") {
            thumbnail = targetPathRelative;
          }
          if (getFileType(targetPath) === "video") {
            thumbnail = await thumbnailGenerate(
              targetPath,
              _req.fileId,
              tokenMapUsername[_req.token]
            );
          }
          const res: WsResponseMsgType<"upload"> = {
            type: "upload",
            data: {
              fileId: _req.fileId,
              type: "uploadEnd",
              sourcePath: targetPathRelative,
              size: statSync(targetPath).size,
              thumbnail: thumbnail,
            } as WsUploadResponseDataType<"uploadEnd">,
          };
          wsSend(ws, res);
          isFileExist(fileTempPath) &&
            (await fs.rm(fileTempPath, { recursive: true, force: true }));
          try {
            await redisInst.HSET(
              redisNameSpace.fileInvariantInfo(tokenMapUsername[_req.token]),
              _req.fileId,
              JSON.stringify({
                sourcePath: targetPathRelative,
                thumbnail: thumbnail,
              })
            );
          } catch (err: any) {
            log(errorStringify(err), "error");
          }
        } catch (err: any) {
          log(errorStringify(err), "error");
          clientError(ws, "服务器错误");
        }
      } else {
        clientError(ws, "请先触发uploadStart事件", codeMap.errorOperate);
      }
    } catch (err: any) {
      log(errorStringify(err), "error");
      clientError(ws, "服务器错误");
    }
  }
};

const deleteFileCb = async (
  req: WsUploadRequestDataType<any>,
  ws: WebSocket,
  redisInst: any
) => {
  if (req.type === "delete" && req.fileId) {
    const paramsStatus = paramsCheck(req, {
      type: { type: "string", required: true },
      token: { type: "string", required: true },
      fileId: { type: "string", required: true },
      ext: { type: "string", required: true },
    });
    if (!paramsStatus.flag) {
      const code = paramsStatus.codes.pop() || codeMap.serverError;
      return clientError(ws, codeMapMsg[code], code);
    }
    const _req: WsUploadRequestDataType<"delete"> =
      req as WsUploadRequestDataType<"delete">;
    const tempPath = getTempPath(_req.fileId, tokenMapUsername[_req.token]);
    const storagePath = getStoragePath(
      _req.fileId,
      _req.ext,
      tokenMapUsername[_req.token]
    );
    const thumbnailPath = getThumbnailPath(
      _req.fileId,
      tokenMapUsername[_req.token]
    );
    if (!tempPath || !storagePath)
      return clientError(ws, "权限不足", codeMap.limitsOfAuthority);
    redisInst.HDEL(
      redisNameSpace.fileInfo(tokenMapUsername[_req.token]),
      _req.fileId
    );
    redisInst.HDEL(
      redisNameSpace.fileInvariantInfo(tokenMapUsername[_req.token]),
      _req.fileId
    );
    try {
      isFileExist(tempPath) &&
        fs.rm(tempPath, { recursive: true, force: true });
      isFileExist(storagePath) &&
        fs.rm(storagePath, { recursive: true, force: true });
      isFileExist(thumbnailPath || "") &&
        fs.rm(thumbnailPath || "", { recursive: true, force: true });
      wsSend(ws, {
        type: "upload",
        data: {
          type: "delete",
          fileId: _req.fileId,
          msg: "删除成功",
        },
      });
    } catch (err: any) {
      log(errorStringify(err), "error");
    }
  }
};

const editCb = async (
  req: WsUploadRequestDataType<any>,
  ws: WebSocket,
  redisInst: any
) => {
  if (req.type === "edit") {
    const paramsStatus = paramsCheck(req, {
      type: { type: "string", required: true, length: 10 },
      token: { type: "string", required: true },
      fileInfo: {
        type: "object",
        required: true,
        children: {
          title: { type: "string", required: true },
          tags: { type: "object", required: true },
          size: { type: "number", required: true },
          type: { type: "string", required: true },
          createTime: { type: "string", required: true },
          updateTime: { type: "string", required: true },
          ext: { type: "string", required: true },
          status: { type: "object", required: true },
        },
      },
      fileId: { type: "string", required: true },
    });

    if (!paramsStatus.flag) {
      const code = paramsStatus.codes.pop() || codeMap.serverError;
      return clientError(ws, codeMapMsg[code], code);
    }
    const _req: WsUploadRequestDataType<"edit"> =
      req as WsUploadRequestDataType<"edit">;

    const fileInfo = JSON.parse(
      (await redisInst.HGET(
        redisNameSpace.fileInfo(tokenMapUsername[_req.token]),
        _req.fileId
      )) || "null"
    );

    if (fileInfo) {
      delete fileInfo.sourcePath;
      delete fileInfo.fileLoaded;
      redisInst.HSET(
        redisNameSpace.fileInfo(tokenMapUsername[_req.token]),
        _req.fileId,
        JSON.stringify({ ...fileInfo, ..._req.fileInfo })
      );
    }
  }
};
