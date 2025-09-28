import pino from "pino";
import fs from "fs";
import dayjs from "dayjs";
import SonicBoom from "sonic-boom";
import { resolve } from "path";

function findTargetLogFile() {
  let logFilePath = resolve(
    process.cwd(),
    "src",
    "logs",
    `${dayjs(new Date()).format("YYYY-MM-DD")}.log`
  );

  return {
    logDate: dayjs(new Date()).format("YYYY-MM-DD"),
    logFilePath: logFilePath,
  };
}

let _logFileInfo: any = null;
let _consoleLogger: any = null;
let _fileLogger: any = null;
export default function log(
  content: string,
  type: "info" | "error" | "debug" | "fatal" | "warn" | "trace" = "info"
) {
  if (
    _fileLogger &&
    _consoleLogger &&
    _logFileInfo &&
    _logFileInfo.logDate === dayjs(new Date()).format("YYYY-MM-DD")
  ) {
    _consoleLogger[type]?.(content);
    _fileLogger[type]?.(content);
    return;
  } else {
    _logFileInfo = findTargetLogFile();
    _consoleLogger = pino({
      transport: {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "yyyy-mm-dd HH:MM:ss" },
      },
    });

    _fileLogger = pino(
      new SonicBoom({
        dest: _logFileInfo.logFilePath,
        mkdir: true,
        append: true,
      })
    );

    _consoleLogger[type](content);
    _fileLogger[type](content);
    return;
  }
}
