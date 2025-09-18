let _workerInfos: any[] = [];

export function workerListen(
  worker: Worker,
  params: {
    uploadStart?: (params: any) => any;
    uploading?: (params: any) => any;
    uploadEnd?: (params: any) => any;
    stopSuccess?: (params: any) => any;
    error?: (params: any) => any;
  }
) {
  let workerInfo: any = _workerInfos.find((item) => item.worker === worker);
  if (!workerInfo) {
    workerInfo = {
      worker,
      uploadStartCbs: [],
      uploadingCbs: [],
      uploadEndCbs: [],
      stopSuccessCbs: [],
      errorCbs: [],
    };
    _workerInfos.push(workerInfo);
  }
  workerInfo.uploadStartCbs = Array.from(
    new Set([...workerInfo.uploadStartCbs, params.uploadStart])
  );
  workerInfo.uploadingCbs = Array.from(
    new Set([...workerInfo.uploadingCbs, params.uploading])
  );
  workerInfo.uploadEndCbs = Array.from(
    new Set([...workerInfo.uploadEndCbs, params.uploadEnd])
  );
  workerInfo.stopSuccessCbs = Array.from(
    new Set([...workerInfo.stopSuccessCbs, params.stopSuccess])
  );
  workerInfo.errorCbs = Array.from(
    new Set([...workerInfo.errorCbs, params.error])
  );

  worker.addEventListener("message", (e) => {
    if (e.data.type === "uploadStart") {
      workerInfo.uploadStartCbs.forEach((cb: any) => cb && cb(e.data));
    }
    if (e.data.type === "uploading") {
      workerInfo.uploadingCbs.forEach((cb: any) => cb && cb(e.data));
    }
    if (e.data.type === "uploadEnd") {
      workerInfo.uploadEndCbs.forEach((cb: any) => cb && cb(e.data));
    }
    if (e.data.type === "stopSuccess") {
      workerInfo.stopSuccessCbs.forEach((cb: any) => cb && cb(e.data));
    }
    if (e.data.type === "error") {
      workerInfo.errorCbs.forEach((cb: any) => cb && cb(e.data));
    }
    if (e.data.type === "updateClientFileIdMapServerFileId") {
      localStorage.setItem(
        "clientFileIdMapServerFileId",
        JSON.stringify(e.data.clientFileIdMapServerFileId)
      );
    }
  });
}

export function clearWorkerListen(
  worker: Worker,
  params: {
    uploadStart?: (params: any) => any;
    uploading?: (params: any) => any;
    uploadEnd?: (params: any) => any;
    stopSuccess?: (params: any) => any;
    error?: (params: any) => any;
  }
) {
  let workerInfo: any = _workerInfos.find((item) => item.worker === worker);
  if (workerInfo) {
    workerInfo.uploadStartCbs = workerInfo.uploadStartCbs.filter(
      (cb: any) => cb !== params.uploadStart
    );
    workerInfo.uploadingCbs = workerInfo.uploadingCbs.filter(
      (cb: any) => cb !== params.uploading
    );
    workerInfo.uploadEndCbs = workerInfo.uploadEndCbs.filter(
      (cb: any) => cb !== params.uploadEnd
    );
    workerInfo.stopSuccessCbs = workerInfo.stopSuccessCbs.filter(
      (cb: any) => cb !== params.stopSuccess
    );
    workerInfo.errorCbs = workerInfo.errorCbs.filter(
      (cb: any) => cb !== params.error
    );
  }
}
