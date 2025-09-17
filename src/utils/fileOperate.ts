import { existsSync } from "fs";
import { stat } from "fs/promises";
import { unlink } from "fs/promises";

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
  if (isFileExist(path)) await unlink(path);
}
