const _worker = new Worker(
  new URL("./workers/filesSplitAndUpload.js", import.meta.url),
  {
    type: "module",
  }
);
export default _worker;
