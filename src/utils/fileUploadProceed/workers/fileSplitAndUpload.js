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

// 大文件上传实现
const handleFileUploadProceed = (file, processChunkIndex = 0) => {
  const stopFlag = { value: false };
  if (!file.file) return { totalChunks: 0, stopFlag };
  const totalChunks = Math.ceil(file.file.size / CHUNK_SIZE);
  const ext = _processFile.file.name.split(".").pop();
  for (
    let i = processChunkIndex * CHUNK_SIZE;
    i < file.file.size;
    i += CHUNK_SIZE
  ) {
    const chunk = file.file.slice(i, i + CHUNK_SIZE);
    const processChunkIndex = Math.floor(i / CHUNK_SIZE);
    if (stopFlag.value) return;
    enqueue("1").then((info) => {
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
        dequeue(info.id);
      });
    });
  }
  return { totalChunks, stopFlag };
};

const wsSend = (socket, msg) => {
  if (socket.readyState !== WebSocket.OPEN) {
    return;
  }
  socket.send(objectToBuffer(msg));
};

let _processFile = null;
let _stopFlag = { value: false };
let _totalChunk = 0;
let fileProcessInfo = null;

function clearEffect() {
  _processFile = null;
  _stopFlag = { value: false };
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
        if (data.clientFileId === _processFile.id) {
          clientFileIdMapServerFileId[data.clientFileId] = data.fileId;
          postMessage({
            type: "updateClientFileIdMapServerFileId",
            clientFileIdMapServerFileId,
          });
          const _processInfo = handleFileUploadProceed(_processFile);
          _stopFlag = _processInfo.stopFlag;
          _totalChunk = _processInfo.totalChunks;

          postMessage({
            type: "uploadStart",
            totalChunk: _totalChunk,
            clientFileId: _processFile.id,
            fileId: _res.data.fileId,
          });
          fileProcessInfo = {
            totalChunk: _totalChunk,
            processChunks: [],
          };
        }
      }
      if (_res.data.type === "uploading") {
        fileProcessInfo.processChunks.push(_res.data.processedChunkIndex);
        fileProcessInfo.processChunks = Array.from(
          new Set(fileProcessInfo.processChunks)
        );
        if (
          fileProcessInfo.processChunks.length === fileProcessInfo.totalChunk
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
      }
      if (_res.data.type === "uploadEnd") {
        clearEffect();
        postMessage({ type: "uploadEnd", ..._res.data });
      }
      if (_res.data.type === "error") {
        postMessage({
          clientFileId: _processFile.id,
          fileId: _res.data.fileId,
          ..._res.data,
          type: "error",
        });
        clearEffect();
      }
    }
  } catch (err) {
    console.log(err);
  }
});

onmessage = (e) => {
  if (e.data.type === "updateClientFileIdMapServerFileId") {
    clientFileIdMapServerFileId = e.data.clientFileIdMapServerFileId;
  }
  if (!_processFile && e.data === "fileProcessRequest")
    postMessage("fileProcessAgree");
  if (!_processFile && e.data?.file instanceof File) {
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
        },
      },
    });
  }
};
