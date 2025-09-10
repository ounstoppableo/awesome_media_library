"use client";
import { Folder, RotateCcw, Search, Upload } from "lucide-react";
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
import dynamic from "next/dynamic";

export default function MediaLibrary() {
  const listContainerRef = useRef<any>(null);
  const headerRef = useRef<any>(null);
  const filterCardRef = useRef<any>(null);
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
            type: "image",
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

  return (
    <>
      <div
        className="w-full h-full flex flex-col overflow-auto"
        ref={listContainerRef}
      >
        <header
          className="bg-gradient-to-r from-[#1D2671] to-[#C33764]  text-white shadow-lg"
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
                <Button className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  上传媒体
                </Button>
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
                {showData.map((media) => {
                  const mediaContent = () => {
                    if (media.type === "video") {
                      return (
                        <>
                          <div className="flex-1 relative overflow-hidden transition-all group-hover/mediaHover:scale-[1.02]">
                            <img
                              src={media.thumbnail}
                              alt={media.title}
                              className="w-full h-full object-cover transition-transform duration-500"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black bg-opacity-50 rounded-full p-3">
                                <i
                                  data-feather="play"
                                  className="text-white w-6 h-6"
                                ></i>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    } else if (media.type === "audio") {
                      return (
                        <div className="flex-1 relative  overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center ">
                          <i
                            data-feather="music"
                            className="w-16 h-16 text-indigo-500 animate-pulse"
                          ></i>
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex-1 relative  overflow-hidden transition-all group-hover/mediaHover:scale-[1.02]">
                          <img
                            src={media.thumbnail}
                            alt={media.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      );
                    }
                  };

                  return (
                    <div
                      key={media.id}
                      className="animate-ocure h-80 flex flex-col bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 perspective-dramatic hover:translate-y-[-5px] group/mediaHover hover:shadow-indigo-200"
                    >
                      {mediaContent()}
                      <div className="p-4 flex flex-col gap-2">
                        <h3 className="font-semibold text-lg truncate">
                          {media.title}
                        </h3>
                        <div className="flex-1 flex justify-between text-sm text-gray-600 pb-2 relative">
                          <span className="capitalize">{media.type}</span>
                          <span>{dayjs(media.date).format("YYYY-MM-DD")}</span>
                          <div className="opacity-0 absolute inset-0 -top-2 bg-white border-t border-gray-100 transition-all translate-y-[100%] group-hover/mediaHover:translate-y-0 group-hover/mediaHover:opacity-100">
                            <div className="flex justify-between items-end h-full">
                              <div className="flex-1 overflow-hidden">
                                <div className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs capitalize">
                                  {media.category}
                                </div>
                              </div>
                              <a
                                href={media.url}
                                target="_blank"
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center transition-all"
                              >
                                View{" "}
                                <i
                                  data-feather="external-link"
                                  className="w-3 h-3 ml-1"
                                ></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
    </>
  );
}
