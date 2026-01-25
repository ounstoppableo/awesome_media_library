import pino from "pino";
import fs from "fs";
import dayjs from "dayjs";
import SonicBoom from "sonic-boom";
import { resolve } from "path";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findTargetLogFile() {
  let logFilePath = resolve(
    __dirname,
    "..",
    `${dayjs(new Date()).format("YYYY-MM-DD")}.log`,
  );

  return {
    logDate: dayjs(new Date()).format("YYYY-MM-DD"),
    logFilePath: logFilePath,
  };
}

let _logFileInfo: any = null;
let _pinoLogger: any = null;
let _filePinoLogger: any = null;
let _consoleLogger: any = console.log;
let _fileLogger: any = null;

export default function log(
  content: string,
  type: "info" | "error" | "debug" | "fatal" | "warn" | "trace" = "info",
) {
  if (
    _logFileInfo &&
    _logFileInfo.logDate === dayjs(new Date()).format("YYYY-MM-DD")
  ) {
    if (__dirname.startsWith("/ROOT/")) {
      _consoleLogger(content);
      _fileLogger.write(JSON.stringify({ msg: content }) + "\n\n");
    } else {
      _pinoLogger?.[type]?.(content);
      _filePinoLogger?.[type]?.(content);
    }

    return;
  } else {
    _fileLogger && _fileLogger.end();
    _logFileInfo = findTargetLogFile();
    if (__dirname.startsWith("/ROOT/")) {
      _fileLogger = fs.createWriteStream(_logFileInfo.logFilePath);
      _consoleLogger(content);
      _fileLogger.write(JSON.stringify({ msg: content }) + "\n\n");
    } else {
      _pinoLogger = pino({
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "yyyy-mm-dd HH:MM:ss" },
        },
      });

      _filePinoLogger = pino(
        new SonicBoom({
          dest: _logFileInfo.logFilePath,
          mkdir: true,
          append: true,
        }),
      );
      _pinoLogger[type](content);
      _filePinoLogger[type](content);
    }

    return;
  }
}
