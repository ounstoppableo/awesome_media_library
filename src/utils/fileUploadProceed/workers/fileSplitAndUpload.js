import { encode, decode } from "@msgpack/msgpack";
import { enqueue, dequeue } from "../currentLimitQueue";

function objectToBuffer(obj) {
  return encode(obj);
}

function bufferToObject(buf) {
  return decode(buf);
}

let clientFileIdMapServerFileId = {};
const CHUNK_SIZE = 1024 * 1024 * 5; // 5MB

const fileIdMapQueueItemId = {};

// 大文件上传实现
const handleFileUploadProceed = (file, processChunkIndex = 0) => {
  if (!file.file) return { totalChunks: 0 };
  const totalChunks = Math.ceil(file.file.size / CHUNK_SIZE);
  const ext = _processFile.file.name.split(".").pop();
  for (
    let i = processChunkIndex * CHUNK_SIZE;
    i < file.file.size;
    i += CHUNK_SIZE
  ) {
    if (_stopFlag.value) return;
    const chunk = file.file.slice(i, i + CHUNK_SIZE);
    const processChunkIndex = Math.floor(i / CHUNK_SIZE);

    if (file.processedChunks?.includes(processChunkIndex)) continue;
    enqueue({ clientFileId: file.id }).then((info) => {
      if (_stopFlag.value) return dequeue(info.id);
      // 暂停后，如果有其他文件上传再次重启线程，此时可能发生上一个文件chunk进入队列，但是还没被取出的情况，但是此时已经是下一个文件的处理了，所以要判断入队时文件是否是处理时的文件
      if (info.clientFileId !== _processFile.id) return;
      chunk.arrayBuffer().then((arrayBuffer) => {
        wsSend(ws, {
          type: "upload",
          data: {
            type: "uploading",
            fileId: clientFileIdMapServerFileId[file.id],
            chunk: new Uint8Array(arrayBuffer),
            processChunkIndex: processChunkIndex,
            ext: ext,
          },
        });
        fileIdMapQueueItemId[
          clientFileIdMapServerFileId[file.id] + processChunkIndex
        ] = info.id;
      });
    });
  }
  return { totalChunks };
};

const wsSend = (socket, msg) => {
  if (socket.readyState !== WebSocket.OPEN) {
    return;
  }
  socket.send(objectToBuffer({ ...msg, token: Authorization }));
};

let _processFile = null;
let _stopFlag = { value: false };
let _totalChunk = 0;
let Authorization = "";
let fileProcessInfo = null;

function clearEffect(stopFlag = false) {
  _processFile = null;
  _stopFlag = { value: stopFlag };
  _totalChunk = 0;
  fileProcessInfo = null;
  postMessage("lockRelease");
}

const ws = new WebSocket(`ws://localhost:10000`);
ws.addEventListener("message", async (e) => {
  try {
    const _res = bufferToObject(new Uint8Array(await e.data.arrayBuffer()));
    if (_res.type === "upload") {
      if (_res.data.type === "uploadStart") {
        const data = _res.data;
        if (_processFile && data.clientFileId === _processFile.id) {
          clientFileIdMapServerFileId[data.clientFileId] = data.fileId;
          postMessage({
            type: "updateClientFileIdMapServerFileId",
            clientFileIdMapServerFileId,
          });
          const _processInfo = handleFileUploadProceed(_processFile);
          _totalChunk = _processInfo.totalChunks;

          postMessage({
            type: "uploadStart",
            totalChunk: _totalChunk,
            clientFileId: _processFile.id,
            fileId: _res.data.fileId,
          });
          fileProcessInfo = {
            totalChunk: _totalChunk,
            processedChunks: _processFile.processedChunks || [],
          };
        }
      }
      if (_res.data.type === "uploading" && _processFile && fileProcessInfo) {
        fileProcessInfo.processedChunks.push(_res.data.processedChunkIndex);
        fileProcessInfo.processedChunks = Array.from(
          new Set(fileProcessInfo.processedChunks)
        );
        if (
          fileProcessInfo.processedChunks.length === fileProcessInfo.totalChunk
        ) {
          wsSend(ws, {
            type: "upload",
            data: {
              type: "uploadEnd",
              fileId: clientFileIdMapServerFileId[_processFile.id],
              ext: _processFile.file.name.split(".").pop(),
            },
          });
        }
        postMessage({
          clientFileId: _processFile.id,
          fileId: _res.data.fileId,
          ..._res.data,
          ...fileProcessInfo,
          type: "uploading",
        });
        dequeue(
          fileIdMapQueueItemId[_res.data.fileId + _res.data.processedChunkIndex]
        );
        delete fileIdMapQueueItemId[
          _res.data.fileId + _res.data.processedChunkIndex
        ];
      }
      if (_res.data.type === "uploadEnd" && _processFile) {
        if (_res.data.size === _processFile.size) {
          postMessage({
            ..._res.data,
            clientFileId: _processFile.id,
            type: "uploadEnd",
          });
        } else {
          postMessage({
            clientFileId: _processFile.id,
            fileId: _res.data.fileId,
            ..._res.data,
            msg: "文件内容缺失",
            type: "error",
          });
        }

        clearEffect();
      }
    }
    if (_res.type === "error" && _processFile) {
      postMessage({
        clientFileId: _processFile.id,
        fileId: _res.data.fileId,
        ..._res.data,
        type: "error",
      });
      clearEffect();
    }
  } catch (err) {
    console.log(err);
  }
});

onmessage = (e) => {
  if (e.data.type === "init") {
    Authorization = e.data.token;
  }
  if (e.data.type === "updateClientFileIdMapServerFileId") {
    clientFileIdMapServerFileId = e.data.clientFileIdMapServerFileId;
  }
  if (!_processFile && e.data === "fileProcessRequest")
    postMessage("fileProcessAgree");
  if (!_processFile && e.data?.file instanceof File) {
    clearEffect();
    _processFile = e.data;
    wsSend(ws, {
      type: "upload",
      data: {
        type: "uploadStart",
        fileId: clientFileIdMapServerFileId[_processFile.id],
        fileInfo: {
          clientFileId: _processFile.id,
          title: _processFile.title,
          tags: _processFile.tags,
          size: _processFile.size,
          type: _processFile.type,
          createTime: _processFile.createTime,
          updateTime: _processFile.updateTime,
          ext: _processFile.file.name.split(".").pop(),
          status: _processFile.status,
        },
      },
    });
  }
  if (e.data.type === "stop" && e.data.clientFileId === _processFile?.id) {
    clearEffect(true);
    postMessage("stopSuccess");
    postMessage("lockRelease");
  }
  if (e.data.type === "delete" && e.data.clientFileId === _processFile?.id) {
    clearEffect();
    postMessage("deleteSuccess");
    postMessage("lockRelease");
  }
};
