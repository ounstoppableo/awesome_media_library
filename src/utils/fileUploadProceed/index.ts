const _worker = new Worker(
  new URL("./workers/filesSplitAndUpload.js", import.meta.url),
  {
    type: "module",
  }
);
_worker.postMessage({
  type: "init",
  clientFileIdMapServerFileId: JSON.parse(
    localStorage.getItem("clientFileIdMapServerFileId") || "{}"
  ),
  hostname: location.hostname,
  token: localStorage.getItem("token"),
});
_worker.addEventListener("message", (e) => {
  if (e.data.type === "updateClientFileIdMapServerFileId") {
    localStorage.setItem(
      "clientFileIdMapServerFileId",
      JSON.stringify(e.data.clientFileIdMapServerFileId)
    );
  }
});

export default _worker;
