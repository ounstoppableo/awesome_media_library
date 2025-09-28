import { existsSync, rmSync } from "fs";
import { stat } from "fs/promises";
import { unlink } from "fs/promises";
import path, { resolve } from "path";
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
  if (checkIsNone(path)) return false;
  if (existsSync(path)) {
    return true;
  } else {
    return false;
  }
}

export async function deleteFile(path: string): Promise<void> {
  console.log(path, isFileExist(path));
  if (isFileExist(path)) rmSync(path, { recursive: true, force: true });
}

export const fileStorePath = resolve(__dirname, "../../public/media");
export const tempPath = resolve(__dirname, "../../temp");
export const thumbnailPath = resolve(__dirname, "../../public/thumbnail");

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

export const getThumbnailPath = (fileId: string, username: string) => {
  if (!username) {
    return null;
  }
  return resolve(thumbnailPath, username, `${fileId}.png`);
};

export const getTempPath = (fileId: string, username: string) => {
  if (!username) {
    return null;
  }
  return resolve(tempPath, username || "", fileId || "");
};

export function getFileType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"];
  const videoExts = [".mp4", ".avi", ".mov", ".mkv", ".flv", ".wmv", ".webm"];

  if (imageExts.includes(ext)) return "image";
  if (videoExts.includes(ext)) return "video";
  return "unknown";
}
