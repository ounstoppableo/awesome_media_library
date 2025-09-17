const workerCount = navigator.hardwareConcurrency * 2;
const workers = [];
for (let i = 0; i < workerCount; i++) {
  workers[i] = new Worker(new URL("./fileSplitAndUpload.js", import.meta.url), {
    type: "module",
  });
}

workers.forEach((worker) => {
  worker.addEventListener("message", (e) => {
    if (e.data?.type === "updateClientFileIdMapServerFileId") {
      clientFileIdMapServerFileId = {
        ...clientFileIdMapServerFileId,
        ...e.data.clientFileIdMapServerFileId,
      };
      workers.forEach((worker) => {
        worker.postMessage({
          type: "updateClientFileIdMapServerFileId",
          clientFileIdMapServerFileId,
        });
      });
    }
    if (e.data === "fileProcessAgree") {
      const fileId = Object.keys(processFileMap)[0];
      if (!fileId) return;
      const _file = processFileMap[fileId];
      delete processFileMap[fileId];
      fileStatusMap[fileId] = "processed";
      if (_file) {
        worker.postMessage(_file);
      }
    }
    if (e.data?.type === "uploadStart") {
      if (!fileProcessInfo[e.data.fileId]) {
        fileProcessInfo[e.data.fileId] = {
          totalChunk: e.data.totalChunk,
          processChunks: [],
        };
        postMessage({ ...e.data });
      }
    }
    if (e.data?.type === "uploading") {
      fileProcessInfo[e.data.fileId].processChunks.push(
        e.data.processedChunkIndex
      );
      const processChunks = new Set(
        fileProcessInfo[e.data.fileId].processChunks
      );
      fileProcessInfo[e.data.fileId].processChunks = Array.from(processChunks);
      postMessage({ ...e.data });
    }
    if (e.data?.type === "uploadEnd") {
      postMessage({ ...e.data });
    }
    if (e.data?.type === "error") {
      fileStatusMap[file.id] = "";
      postMessage({ ...e.data });
    }
  });
});

let clientFileIdMapServerFileId = {};
const processFileMap = {};
const fileStatusMap = {};
const fileProcessInfo = {};

onmessage = (e) => {
  if (e.data instanceof Array) {
    e.data.forEach((file) => {
      if (file.file instanceof File) {
        if (!fileStatusMap[file.id]) {
          processFileMap[file.id] = file;
          workers.forEach((worker) => worker.postMessage("fileProcessRequest"));
        }
      }
    });
  }
};
