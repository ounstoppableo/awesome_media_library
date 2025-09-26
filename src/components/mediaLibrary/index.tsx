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
import request from "@/utils/fetch";
import { CommonResponse } from "@/types/response";
import { codeMap } from "@/utils/backendStatus";
import MultipleSelector from "../ui/multiselect";

export default function MediaLibrary() {
  const listContainerRef = useRef<any>(null);
  const headerRef = useRef<any>(null);
  const filterCardRef = useRef<any>(null);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [tags, setTags] = useState<any>(null);

  useEffect(() => {
    request("/api/tags").then((res: CommonResponse) => {
      if (res.code === codeMap.success) {
        res.data && setTags(res.data.map((item: any) => item.name));
      }
    });
  }, []);
  useEffect(() => {
    import("@/utils/fileUploadProceed/index").then(
      (fileSplitAndUploadWorker) => {
        setWorker(fileSplitAndUploadWorker.default);
      }
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

  const mediaGap = 24;
  const [mediaData, setMediaData] = useState<MediaStruct[]>([]);

  const { ghostDomHeight, showData } = useVitualScrollLogic({
    itemHeight: mediaItemHeight,
    itemGap: mediaGap,
    rowBaseCount: rowBaseCount,
    headerHeight: headerHeight,
    data: mediaData,
    scrollContainerRef: listContainerRef,
    setData: setMediaData,
  });

  const defaultSearchParams = {
    type: "all",
    status: [{ value: "exhibition", label: "展示" }],
    timeType: "all",
  } as any;
  const [searchParams, setSearchParams] = useState<{
    id?: any;
    type: "audio" | "video" | "image" | "all";
    timeType: "all" | "today" | "week" | "month" | "year";
    tags?: { value: string; label: string }[];
    status?: { value: string; label: string }[];
  }>(defaultSearchParams);

  const [isOver, setIsOver] = useState(false);

  const getDateTime = (type: string) => {
    const todayZero = new Date();
    todayZero.setHours(0, 0, 0, 0);
    switch (type) {
      case "today":
        return {
          startTime: dayjs(todayZero).valueOf(),
          endTime: dayjs(todayZero).add(1, "day").valueOf(),
        };

      case "week":
        return {
          startTime: dayjs(todayZero).subtract(1, "week").valueOf(),
          endTime: dayjs(todayZero).add(1, "day").valueOf(),
        };

      case "month":
        return {
          startTime: dayjs(todayZero).subtract(1, "month").valueOf(),
          endTime: dayjs(todayZero).add(1, "day").valueOf(),
        };

      case "year":
        return {
          startTime: dayjs(todayZero).subtract(1, "year").valueOf(),
          endTime: dayjs(todayZero).add(1, "day").valueOf(),
        };
      default:
        return {
          startTime: "",
          endTime: "",
        };
    }
  };

  const getMeidaData = (initial: boolean = true) => {
    return request("/api/media", {
      method: "post",
      body: {
        ...searchParams,
        type: searchParams.type === "all" ? "" : searchParams.type,
        ...getDateTime(searchParams.timeType),
        tags: (searchParams.tags || []).map((item) => item.value),
        status: (searchParams.status || []).map((item) => item.value),
      },
    }).then((res: CommonResponse) => {
      if (res.code === codeMap.success) {
        if (initial) {
          setMediaData([...res.data].sort((a, b) => b.id - a.id));
        } else {
          const map: any = {};
          [...res.data, ...mediaData].forEach((item) => {
            map[item.id] = item;
          });
          setMediaData(
            Array.from(
              new Set([...res.data, ...mediaData].map((item) => item.id))
            )
              .sort((a, b) => b - a)
              .map((item) => map[item])
          );
        }
        if (res.data.length === 0) {
          setIsOver(true);
        }
      }
      setDataLoding(false);
    });
  };
  useEffect(() => {
    setIsOver(false);
    if (!searchParams.id) {
      getMeidaData(true);
    } else {
      getMeidaData(false);
    }
  }, [searchParams]);

  const [dataLoading, setDataLoding] = useState(false);
  useEffect(() => {
    const _cb = () => {
      if (dataLoading) return;
      if (isOver) return;
      if (
        listContainerRef.current.scrollTop +
          listContainerRef.current.offsetHeight >=
        listContainerRef.current.scrollHeight - mediaItemHeight / 2
      ) {
        setDataLoding(true);
        setSearchParams({
          ...searchParams,
          id: mediaData[mediaData.length - 1].id,
        });
      }
    };
    listContainerRef.current.addEventListener("scroll", _cb);
    return () => listContainerRef.current?.removeEventListener("scroll", _cb);
  }, [mediaData, dataLoading]);

  const [multiTagSelectorJsx, setMultiTagSelectorJsx] = useState(
    <MultipleSelector
      defaultOptions={(tags || []).map((item: string) => ({
        value: item,
        label: item,
      }))}
      emptyIndicator={<p className="text-center text-sm">No results found</p>}
    />
  );

  const [multiStatusSelectorJsx, setMultiStatusSelectorJsx] = useState(
    <MultipleSelector
      value={searchParams.status}
      defaultOptions={[
        { value: "exhibition", label: "展示" },
        { value: "storage", label: "存储" },
      ]}
      onChange={(value) => {
        setSearchParams({
          ...searchParams,
          status: value,
          id: "",
        });
      }}
      emptyIndicator={<p className="text-center text-sm">No results found</p>}
    />
  );

  useEffect(() => {
    setMultiTagSelectorJsx(
      <Select>
        <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
          <SelectValue placeholder="挑选标签" />
        </SelectTrigger>
        <SelectContent></SelectContent>
      </Select>
    );
    requestAnimationFrame(() => {
      setMultiTagSelectorJsx(
        <MultipleSelector
          value={searchParams.tags}
          defaultOptions={(tags || []).map((item: string) => ({
            value: item,
            label: item,
          }))}
          onChange={(value) => {
            setSearchParams({
              ...searchParams,
              tags: value,
              id: "",
            });
          }}
          emptyIndicator={
            <p className="text-center text-sm">No results found</p>
          }
        />
      );
    });
  }, [tags]);

  const { socketRef } = useWebsocketLogic();

  const { uploadDialogJsx } = useUploadLogic({ worker, socketRef, tags });

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
                  <Select
                    value={searchParams.type}
                    onValueChange={(value: any) => {
                      setSearchParams({
                        ...searchParams,
                        id: "",
                        type: value,
                      });
                    }}
                  >
                    <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                      <SelectValue placeholder="媒体类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="video">视频</SelectItem>
                      <SelectItem value="image">图片</SelectItem>
                      <SelectItem value="audio">音频</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    标签
                  </label>
                  {multiTagSelectorJsx}
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    状态
                  </label>
                  {multiStatusSelectorJsx}
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    时间范围
                  </label>
                  <Select
                    value={searchParams.timeType}
                    onValueChange={(value: any) => {
                      setSearchParams({ ...searchParams, timeType: value });
                    }}
                  >
                    <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                      <SelectValue placeholder="时间范围" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="today">今天</SelectItem>
                      <SelectItem value="week">过去一周</SelectItem>
                      <SelectItem value="month">过去一月</SelectItem>
                      <SelectItem value="year">过去一年</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    setSearchParams(defaultSearchParams);
                  }}
                >
                  <RotateCcw />
                  重置
                </Button>
                {uploadDialogJsx}
              </div>
            </CardContent>
          </Card>
          {mediaData.length > 0 && showData.length > 0 && (
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
                  <MediaItem
                    tags={tags}
                    media={media}
                    key={media.id}
                  ></MediaItem>
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

          {mediaData.length !== 0 && isOver && (
            <div className="w-full flex justify-center items-center text-gray-400 text-sm">
              🥳 到底了~
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
