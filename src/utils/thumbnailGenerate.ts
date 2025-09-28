import ffmpeg from "fluent-ffmpeg";
import path, { resolve } from "path";
import { getThumbnailPath, isFileExist, thumbnailPath } from "./fileOperate";

export default function thumbnailGenerate(
  videoPath: string,
  videoName: string,
  username: string
) {
  return new Promise((resolve, reject) => {
    const targetPath = getThumbnailPath(videoName, username);
    if (!targetPath) return "";
    if (isFileExist(targetPath))
      return resolve(`/thumbnail/${username}/${videoName}.png`);
    ffmpeg(videoPath)
      .on("end", () => resolve(`/thumbnail/${username}/${videoName}.png`))
      .on("error", reject)
      .screenshots({
        count: 1,
        timemarks: ["0"],
        folder: path.resolve(thumbnailPath, username),
        filename: `${videoName}.png`,
        size: "426x240",
      });
  });
}
