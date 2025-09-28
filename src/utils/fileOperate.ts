import { existsSync } from "fs";
import { stat } from "fs/promises";
import { unlink } from "fs/promises";
import { resolve } from "path";
import { checkIsNone } from "./convention";

export async function getFileSize(path: string) {
  if (isFileExist(path)) {
    const info = await stat(path);
    return info.size; // 字节数
  }
  {
    return 0;
  }
}

export function isFileExist(path: string) {
  if (existsSync(path)) {
    return true;
  } else {
    return false;
  }
}

export async function deleteFile(path: string): Promise<void> {
  if (!checkIsNone(path) && isFileExist(path)) await unlink(path);
}

export const fileStorePath = resolve(__dirname, "../../public/media");
export const tempPath = resolve(__dirname, "../../temp");

export const getStoragePath = (
  fileId: string,
  ext: string,
  username: string,
  absolute = true
) => {
  !fileId && (fileId = "");
  !ext && (ext = "");
  if (!username) {
    return null;
  }
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

export const getTempPath = (fileId: string, username: string) => {
  if (!username) {
    return null;
  }
  return resolve(tempPath, username || "", fileId || "");
};
