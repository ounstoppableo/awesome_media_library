"use client";
import {
  ArrowBigUp,
  BookImage,
  Clapperboard,
  FileAudio,
  Folder,
  Image,
  Music,
  Play,
  Plus,
  RotateCcw,
  Search,
  Upload,
} from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dayjs from "dayjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import useVitualScrollLogic from "./hooks/useVitualScrollLogic";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ProgressRadial } from "../progress-1";
import MediaItem from "./components/mediaItem";

export default function MediaLibrary() {
  const listContainerRef = useRef<any>(null);
  const headerRef = useRef<any>(null);
  const filterCardRef = useRef<any>(null);
  const fileUploadRef = useRef<any>(null);
  const mediaItemHeight = 320;
  const rowBaseCount = () => {
    return innerWidth > 1024
      ? 4
      : innerWidth > 768
      ? 3
      : innerWidth > 640
      ? 2
      : 1;
  };
  const headerHeight = () => {
    return (
      headerRef.current.offsetHeight + filterCardRef.current.offsetHeight + 64
    );
  };

  const mediaUrl = [
    "http://static.photos/nature/640x360/1",
    "http://static.photos/technology/640x360/2",
    "http://static.photos/people/640x360/3",
    "http://static.photos/abstract/640x360/4",
    "http://static.photos/nature/640x360/5",
    "http://static.photos/office/640x360/6",
    "http://static.photos/people/640x360/7",
    "http://static.photos/abstract/640x360/8",
    "http://static.photos/nature/640x360/9",
    "http://static.photos/technology/640x360/10",
    "http://static.photos/people/640x360/11",
    "http://static.photos/abstract/640x360/12",
  ];
  const thumbnailUrl = [
    "http://static.photos/nature/320x240/1",
    "http://static.photos/technology/320x240/2",
    "http://static.photos/people/320x240/3",
    "http://static.photos/abstract/320x240/4",
    "http://static.photos/nature/320x240/5",
    "http://static.photos/office/320x240/6",
    "http://static.photos/people/320x240/7",
    "http://static.photos/abstract/320x240/8",
    "http://static.photos/nature/320x240/9",
    "http://static.photos/technology/320x240/10",
    "http://static.photos/people/320x240/11",
    "http://static.photos/abstract/320x240/12",
  ];
  const mediaGap = 24;
  const [mediaData, setMediaData] = useState(
    Array.from({ length: 20 })
      .map((_, index) => [
        ...[
          {
            id: 1 * index,
            title: "Mountain Landscape",
            type: ["image", "video", "audio"][Math.floor(Math.random() * 3)],
            category: "nature",
            date: "2023-05-15",
            url: mediaUrl[Math.floor(Math.random() * mediaUrl.length)],
            thumbnail:
              thumbnailUrl[Math.floor(Math.random() * thumbnailUrl.length)],
          },
        ],
      ])
      .flat()
  );

  const { ghostDomHeight, showData } = useVitualScrollLogic({
    itemHeight: mediaItemHeight,
    itemGap: mediaGap,
    rowBaseCount: rowBaseCount,
    headerHeight: headerHeight,
    data: mediaData,
    scrollContainerRef: listContainerRef,
    setData: setMediaData,
  });

  const [dataLoading, setDataLoding] = useState(false);
  useEffect(() => {
    const _cb = () => {
      if (dataLoading) return;
      setDataLoding(true);
      if (
        listContainerRef.current.scrollTop +
          listContainerRef.current.offsetHeight >=
        listContainerRef.current.scrollHeight - mediaItemHeight / 2
      ) {
        const length = mediaData.length;
        setTimeout(() => {
          setMediaData([
            ...mediaData,
            ...Array.from({ length: 20 })
              .map((_, index) => [
                ...[
                  {
                    id: 1 * index + length,
                    title: "Mountain Landscape",
                    type: "image",
                    category: "nature",
                    date: "2023-05-15",
                    url: mediaUrl[Math.floor(Math.random() * mediaUrl.length)],
                    thumbnail:
                      thumbnailUrl[
                        Math.floor(Math.random() * thumbnailUrl.length)
                      ],
                  },
                ],
              ])
              .flat(),
          ]);
          setDataLoding(false);
        }, 3000);
      } else {
        setDataLoding(false);
      }
    };
    listContainerRef.current.addEventListener("scroll", _cb);
    return () => listContainerRef.current?.removeEventListener("scroll", _cb);
  }, [mediaData, dataLoading]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      console.log(e.dataTransfer.files);
    }
  };

  return (
    <div className="w-full h-full relative translate-0">
      <div
        className="w-full h-full flex flex-col overflow-auto"
        ref={listContainerRef}
      >
        <header
          className="bg-gradient-to-r from-purple-900 via-indigo-900 to-cyan-900
            bg-size-[var(--bg-size-glow)] animate-glow-flow text-white shadow-lg"
          ref={headerRef}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <h1 className="text-3xl font-bold mb-4 md:mb-0">媒体库</h1>
              <div className="relative w-full md:w-1/3">
                <input
                  type="text"
                  id="searchInput"
                  placeholder="请输入媒体名称"
                  className="search-input w-full px-4 py-3 rounded-full text-gray-800 bg-white bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <Search className="absolute right-6 top-[50%] translate-y-[-50%] text-gray-500"></Search>
              </div>
            </div>
          </div>
        </header>

        <main className="w-full flex flex-col gap-8 flex-1 container mx-auto px-4 py-8">
          <Card ref={filterCardRef}>
            <CardContent>
              <div className="flex flex-wrap items-end gap-4 container mx-auto">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    媒体类型
                  </label>
                  <Select>
                    <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                      <SelectValue placeholder="媒体类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    标签
                  </label>
                  <Select>
                    <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                      <SelectValue placeholder="媒体类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    时间范围
                  </label>
                  <Select>
                    <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                      <SelectValue placeholder="媒体类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" className="cursor-pointer">
                  <RotateCcw />
                  重置
                </Button>
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
                        0 / 100
                      </div>
                      <div className="flex-1 flex overflow-hidden flex-col relative">
                        <input
                          ref={fileUploadRef}
                          name="file-upload"
                          type="file"
                          multiple
                          className="sr-only"
                          accept=".png,.jpg,.jpeg,.webp,.svg,.gif,.mp4,.mp3"
                        />
                        {/* <div
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
                      </div> */}
                        <div
                          onDrop={handleDrop}
                          onDragOver={(e) => e.preventDefault()}
                          className="border border-dashed border-gray-400 rounded-xl flex-1 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-auto p-4"
                        >
                          {showData.map((media) => (
                            <div
                              key={media.id}
                              className="relative rounded-xl h-80"
                            >
                              {/* <div className="rounded-[inherit] overflow-hidden absolute flex items-center justify-center inset-0 z-10 after:absolute after:z-10 after:inset-0 after:bg-gray-800 after:opacity-50">
                                <ProgressRadial
                                  value={40}
                                  size={80}
                                  startAngle={-90}
                                  endAngle={269}
                                  strokeWidth={5}
                                  indicatorClassName="text-green-400"
                                  className="text-green-400 z-20"
                                >
                                  <div className="text-center">
                                    <div className="text-base font-bold">
                                      {Math.round(40)}%
                                    </div>
                                    <div className="text-xs text-gray-200">
                                      Upload
                                    </div>
                                  </div>
                                </ProgressRadial>
                              </div> */}

                              <MediaItem media={media} />
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
              </div>
            </CardContent>
          </Card>
          {mediaData.length > 0 && (
            <>
              <div
                id="mediaContainer"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                style={{
                  marginTop: ghostDomHeight.up + "px",
                  marginBottom: ghostDomHeight.down + "px",
                }}
              >
                {showData.map((media) => (
                  <MediaItem media={media} key={media.id}></MediaItem>
                ))}
              </div>
              {dataLoading && (
                <div className="flex items-center justify-center w-full p-1">
                  <div className="border-primary ml-3 h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 ease-linear"></div>
                </div>
              )}
            </>
          )}

          {mediaData.length === 0 && (
            <div
              id="emptyState"
              className="flex-1 text-center py-12 w-full flex flex-col justify-center items-center"
            >
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Folder className="w-full h-full text-gray-400 absolute inset-0" />
                <Search className="w-8 h-8 text-indigo-500 absolute -bottom-2 -right-2 animate-bounce" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No media found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </main>
      </div>
      <Button
        className="fixed bottom-8 left-8 cursor-pointer rounded-full w-8 h-8"
        onClick={() => {
          listContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <ArrowBigUp></ArrowBigUp>
      </Button>
    </div>
  );
}
