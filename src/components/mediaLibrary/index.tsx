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

import { ProgressRadial } from "../progress-1";
import MediaItem, { MediaStruct } from "./components/mediaItem";
import useWebsocketLogic from "./hooks/useWebsocketLogic";
import useUploadLogic, { singleUploadFilesLimit } from "./hooks/useUploadLogic";

export default function MediaLibrary() {
  const listContainerRef = useRef<any>(null);
  const headerRef = useRef<any>(null);
  const filterCardRef = useRef<any>(null);
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    import("@/utils/fileUploadProceed/index").then((fileSplitAndUploadWorker) =>
      setWorker(fileSplitAndUploadWorker.default)
    );
  }, []);

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
            tags: ["nature"],
            date: "2023-05-15",
            sourcePath: mediaUrl[Math.floor(Math.random() * mediaUrl.length)],
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
                    tags: ["nature"],
                    date: "2023-05-15",
                    sourcePath:
                      mediaUrl[Math.floor(Math.random() * mediaUrl.length)],
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

  const { socketRef } = useWebsocketLogic();

  const { uploadDialogJsx } = useUploadLogic({ worker });

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
                {uploadDialogJsx}
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
