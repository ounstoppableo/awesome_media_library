const workerCount = navigator.hardwareConcurrency;
const workers = [];

for (let i = 0; i < workerCount; i++) {
  workers[i] = new Worker(new URL("./fileSplitAndUpload.js", import.meta.url), {
    type: "module",
  });
}

const broadcast = (data) => {
  workers.forEach((worker) => worker.postMessage(data));
};

const workersProcessAgreeLock = {};
workers.forEach((worker, index) => {
  worker.addEventListener("message", (e) => {
    if (e.data?.type === "updateClientFileIdMapServerFileId") {
      clientFileIdMapServerFileId = {
        ...clientFileIdMapServerFileId,
        ...e.data.clientFileIdMapServerFileId,
      };
      postMessage({
        type: "updateClientFileIdMapServerFileId",
        clientFileIdMapServerFileId,
      });
      broadcast({
        type: "updateClientFileIdMapServerFileId",
        clientFileIdMapServerFileId,
      });
    }
    if (e.data === "fileProcessAgree") {
      if (workersProcessAgreeLock[index]) return;
      const fileId = Object.keys(processFileMap)[0];
      if (!fileId) return;
      const _file = processFileMap[fileId];
      if (_file) {
        workersProcessAgreeLock[index] = true;
        delete processFileMap[fileId];
        fileStatusMap[fileId] = "processed";
        worker.postMessage(_file);
      }
    }
    if (e.data?.type === "uploadStart") {
      if (!fileProcessInfo[e.data.fileId]) {
        fileProcessInfo[e.data.fileId] = {
          totalChunk: e.data.totalChunk,
          processedChunks: [],
        };
        postMessage({ ...e.data });
      }
    }
    if (e.data?.type === "uploading" && fileProcessInfo[e.data.fileId]) {
      fileProcessInfo[e.data.fileId].processedChunks = e.data.processedChunks;
      postMessage({ ...e.data });
    }
    if (e.data?.type === "uploadEnd") {
      postMessage({ ...e.data });
      broadcast("fileProcessRequest");
    }
    if (e.data === "stopSuccess") {
      broadcast("fileProcessRequest");
    }
    if (e.data === "deleteSuccess") {
      broadcast("fileProcessRequest");
    }
    if (e.data?.type === "error") {
      fileStatusMap[e.data.clientFileId] = "";
      postMessage({ ...e.data });
      broadcast("fileProcessRequest");
    }
    if (e.data === "lockRelease") {
      workersProcessAgreeLock[index] = false;
    }
  });
});

let clientFileIdMapServerFileId = {};
const processFileMap = {};
const fileStatusMap = {};
const fileProcessInfo = {};

onmessage = (e) => {
  if (e.data.type === "init") {
    clientFileIdMapServerFileId = e.data.clientFileIdMapServerFileId || {};
    broadcast({
      type: "updateClientFileIdMapServerFileId",
      clientFileIdMapServerFileId,
    });
    broadcast({
      type: "init",
      token: e.data.token,
      hostname: e.data.hostname,
      protocol: e.data.protocol,
    });
  }
  if (e.data instanceof Array) {
    e.data
      .filter((file) => !file.pause && !file.compelete && !file.error)
      .forEach((file) => {
        if (file.file instanceof File) {
          if (!fileStatusMap[file.id]) {
            processFileMap[file.id] = file;
            broadcast("fileProcessRequest");
          }
        }
      });
  }
  if (e.data.type === "stop") {
    fileStatusMap[e.data.clientFileId] = "";
    broadcast(e.data);
    postMessage({
      ...e.data,
      type: "stopSuccess",
      ...fileProcessInfo[clientFileIdMapServerFileId[e.data.clientFileId]],
    });
  }
  if (e.data.type === "delete") {
    broadcast(e.data);
  }
};
