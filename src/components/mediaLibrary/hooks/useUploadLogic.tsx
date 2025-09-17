import { Ref, useEffect, useRef, useState } from "react";
import MediaItem, { MediaStruct } from "../components/mediaItem";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { message } from "antd";
import "@ant-design/v5-patch-for-react-19";
import {
  Clapperboard,
  FileAudio,
  Image,
  Pause,
  Play,
  Plus,
  StopCircle,
  Upload,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/button-1";
import {
  clearWorkerListen,
  workerListen,
} from "@/utils/fileUploadProceed/listenerRegister";
import { ProgressRadial } from "@/components/progress-1";

export const allowTypes = [
  "image/png",
  "image/jpeg", // JPG/JPEG
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "video/mp4",
  "audio/mpeg", // MP3
];

export const singleUploadFilesLimit = 100;

export default function useUploadLogic(props: { worker: any }) {
  const { worker } = props;
  const [waitingUploadFiles, setWaitingUploadFiles] = useState<
    (MediaStruct & { file: File; progress?: number; pause?: boolean })[]
  >([]);
  const fileUploadRef = useRef<any>(null);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFilesChange(e.dataTransfer.files);
    }
  };

  const handleFilesChange = (files: any) => {
    if (!files || files.length === 0) return;
    let _files = Array.from(files);
    if (_files.length + waitingUploadFiles.length > singleUploadFilesLimit) {
      if (singleUploadFilesLimit - waitingUploadFiles.length > 0) {
        _files = _files.slice(
          0,
          singleUploadFilesLimit - waitingUploadFiles.length
        );
      } else {
        _files = [];
      }
      message.warning({
        content: `一次最多上传${singleUploadFilesLimit}个文件`,
      });
    }
    const newFiles = _files
      .filter((file: any) => allowTypes.includes(file.type))
      .map((file: any, index) => ({
        id: uuidv4(),
        title: file.name.split(".").slice(0, -1).join("."),
        type: file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
          ? "video"
          : ("audio" as any),
        sourcePath: URL.createObjectURL(file),
        file: file,
        size: file.size,
        updateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        tags: ["1"],
      }));
    setWaitingUploadFiles([...waitingUploadFiles, ...newFiles]);
  };
  const [filesProgress, setFilesProgress] = useState<any>({});
  const _filesProgress = useRef<any>(
    new Proxy(
      { proxy: {} },
      {
        set(target, props, newValue, receiver) {
          Reflect.set(target, props, newValue, receiver);
          setFilesProgress(newValue);
          return true;
        },
      }
    )
  );
  useEffect(() => {
    const cbParams = {
      uploading: (params: any) => {
        _filesProgress.current.proxy = {
          ..._filesProgress.current.proxy,
          ...{
            [params.clientFileId]: (
              (params.processChunks.length / params.totalChunk) *
              100
            ).toFixed(1),
          },
        };
      },
      error: (params: any) => {
        console.log(params);
      },
    };
    worker && workerListen(worker, cbParams);
    return () => {
      clearWorkerListen(worker, cbParams);
    };
  }, [worker]);

  useEffect(() => {
    worker?.postMessage(waitingUploadFiles);
  }, [waitingUploadFiles]);

  const uploadDialogJsx = (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Upload />
          上传
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[80vw] max-w-[80vw] min-h-[80vh] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>媒体上传</DialogTitle>
          <DialogDescription>
            请将你的媒体文件拖拽到此处，或点击下方按钮选择文件进行上传。
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden flex flex-col gap-2">
          <div className="text-xs h-fit w-full flex justify-end text-gray-600">
            {waitingUploadFiles.length} / {singleUploadFilesLimit}
          </div>
          <div className="flex-1 flex overflow-hidden flex-col relative">
            <input
              ref={fileUploadRef}
              onChange={(e) => handleFilesChange(e.target.files)}
              name="file-upload"
              type="file"
              multiple
              className="sr-only"
              accept=".png,.jpg,.jpeg,.webp,.svg,.gif,.mp4,.mp3"
            />
            {waitingUploadFiles.length === 0 ? (
              <div
                onClick={() => {
                  fileUploadRef.current?.click();
                }}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="relative w-full flex-1 border border-dashed border-gray-400 rounded-xl cursor-pointer flex flex-col items-center justify-center"
              >
                <div className="flex gap-4 w-full justify-center items-center">
                  <Image className="w-1/12 h-1/12 text-gray-400" />
                  <Clapperboard className="w-1/12 h-1/12 text-gray-400" />
                  <FileAudio className="w-1/12 h-1/12 text-gray-400" />
                </div>
                <div className="flex text-sm text-gray-600 mt-4">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                    <span>Upload a file</span>
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WEBP, SVG, GIF, MP4, MP3 up to 500MB
                </p>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border border-dashed border-gray-400 rounded-xl flex-1 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-auto p-4"
              >
                {waitingUploadFiles.map((media, index) => (
                  <div key={media.id} className="relative rounded-xl h-80">
                    {
                      <div className="rounded-[inherit] overflow-hidden absolute flex items-center justify-center inset-0 z-10 after:absolute after:z-10 after:inset-0 after:bg-gray-800 after:opacity-50">
                        <ProgressRadial
                          value={filesProgress[media.id] || 0}
                          size={80}
                          startAngle={-90}
                          endAngle={269}
                          strokeWidth={5}
                          indicatorClassName="text-green-400"
                          className="text-green-400 z-20 group/operate relative"
                        >
                          <div className="text-center group-hover/operate:hidden block">
                            <div className="text-base font-bold">
                              {Math.round(filesProgress[media.id] || 0)}%
                            </div>
                            <div className="text-xs text-gray-200">Upload</div>
                          </div>
                          <div
                            className="absolute text-gray-200 top-1/2 left-1/2 -translate-1/2 cursor-pointer group-hover/operate:block hidden"
                            onClick={() => {
                              setWaitingUploadFiles((prev) => {
                                return prev.map((item) => {
                                  return item.id === media.id
                                    ? { ...item, pause: !item.pause }
                                    : item;
                                });
                              });
                            }}
                          >
                            {!media.pause ? <Pause></Pause> : <Play />}
                          </div>
                        </ProgressRadial>
                      </div>
                    }

                    <MediaItem
                      media={media}
                      deleteCb={() => {
                        setWaitingUploadFiles([
                          ...waitingUploadFiles.slice(0, index),
                          ...waitingUploadFiles.slice(index + 1),
                        ]);
                      }}
                    />
                  </div>
                ))}
                <div
                  onClick={() => {
                    fileUploadRef.current?.click();
                  }}
                  className="h-80 border border-dashed border-gray-400 rounded-xl flex items-center justify-center"
                >
                  <Plus className="w-1/4 h-1/4 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="h-fit">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              关闭
            </Button>
          </DialogClose>
          <Button>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  return {
    uploadDialogJsx,
    waitingUploadFiles,
    setWaitingUploadFiles,
    handleDrop,
    handleFilesChange,
  };
}
