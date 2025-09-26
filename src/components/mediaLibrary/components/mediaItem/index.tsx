import { Button } from "@/components/button-1";
import dayjs from "dayjs";
import {
  Check,
  CircleCheck,
  CircleX,
  Clapperboard,
  Database,
  Music,
  Play,
  Plus,
  SquareArrowOutUpRight,
  Tag,
  Trash,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

import { Input, Select } from "antd";
import { ToggleGroup, ToggleGroupItem } from "@/components/toggle-group-1";
import { Tooltip } from "antd";
import request from "@/utils/fetch";
import { CommonResponse } from "@/types/response";
import { codeMap } from "@/utils/backendStatus";

export type MediaStruct = {
  id: string;
  title: string;
  size: number;
  type: "image" | "video" | "audio";
  sourcePath: string;
  createTime: string;
  updateTime: string;
  tags: string[];
  status: string[];
};

export default function MediaItem(props: {
  media: MediaStruct;
  showSelect?: boolean;
  deleteCb?: () => any;
  imgUploadMask?: any;
  mediaItemHeight?: number;
  tags?: string[];
  infoChangeCb?: (params: any) => any;
}) {
  const {
    media: defaultMediaData,
    showSelect = false,
    deleteCb,
    imgUploadMask,
    infoChangeCb,
    mediaItemHeight = 320,
  } = props;

  const [defaultTags, setDefaultTags] = useState(props.tags);
  const [tags, setTags] = useState(props.tags || []);
  useEffect(() => {
    setDefaultTags(props.tags || []);
    setTags(props.tags || []);
  }, [props.tags]);
  const [selected, setSelected] = useState(false);
  const [media, setMedia] = useState(defaultMediaData);
  const [mediaItemTitleEdit, setMediaItemTitleEdit] = useState(false);
  const mediaItemTitleRef = useRef<any>(null);
  const [mediaTagEdit, setMediaTagEdit] = useState(false);
  const mediaTagRef = useRef<any>(null);
  useEffect(() => {
    if (mediaItemTitleEdit) {
      mediaItemTitleRef.current?.focus();
    }
  }, [mediaItemTitleEdit]);

  useEffect(() => {
    if (mediaTagEdit) {
      mediaTagRef.current?.focus();
    }
  }, [mediaTagEdit]);

  const updateLock = useRef<any>(null);
  useEffect(() => {
    if (updateLock.current) clearTimeout(updateLock.current);
    updateLock.current = setTimeout(() => {
      infoChangeCb && infoChangeCb(media);
    }, 1000);
  }, [media]);
  const mediaContent = () => {
    if (media.type === "video") {
      return (
        <div className="flex-1 relative overflow-hidden">
          <div className="h-full w-full transition-all group-hover/mediaHover:scale-[1.02]">
            <video
              src={media.sourcePath}
              className="w-full h-full object-cover transition-transform duration-500 "
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 ">
              <Button className="rounded-full p-3 cursor-pointer">
                <Play className="text-white w-6 h-6"></Play>
              </Button>
            </div>
          </div>
        </div>
      );
    } else if (media.type === "audio") {
      return (
        <div className="flex-1 relative overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center ">
            <Music className="w-16 h-16 text-indigo-500 animate-pulse"></Music>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex-1 relative overflow-hidden">
          <div className="w-full h-full transition-all group-hover/mediaHover:scale-[1.02]">
            <img
              src={media.sourcePath}
              alt={media.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div
      key={media.id}
      className="relative animate-ocure transition-all duration-500 perspective-dramatic hover:translate-y-[-5px] group/mediaHover "
    >
      {showSelect && (
        <div className="group/select absolute z-10 -right-4 top-8 w-fit h-fit">
          <svg
            className={`icon text-4xl rotate-90 stroke-40 ${
              selected ? "stroke-emerald-400" : "stroke-gray-400"
            } cursor-pointer group-hover/select:stroke-emerald-400 transition-all`}
            aria-hidden="true"
          >
            <use xlinkHref="#icon-icf_tag"></use>
          </svg>
          <CircleCheck
            className={`absolute top-1/2 left-1/2 -translate-x-[5px] -translate-y-1/2 w-[40%] h-[40%] ${
              selected ? "stroke-emerald-400" : "stroke-gray-400"
            } cursor-pointer group-hover/select:stroke-emerald-400 transition-all`}
          ></CircleCheck>
        </div>
      )}

      <div
        className={`w-full flex flex-col bg-white rounded-xl shadow-lg overflow-hidden transition-all group-hover/mediaHover:shadow-indigo-200`}
        style={{ height: mediaItemHeight + "px" }}
      >
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {mediaContent()}
          {imgUploadMask}
        </div>
        <div className="p-4 flex flex-col gap-2">
          <div className="h-8 flex w-full items-center gap-2">
            <h3
              className="font-semibold text-lg truncate items-center flex-1"
              onDoubleClick={() => {
                setMediaItemTitleEdit(true);
              }}
            >
              {mediaItemTitleEdit ? (
                <div className="w-full">
                  <Input
                    ref={mediaItemTitleRef}
                    value={media.title}
                    onBlur={() => {
                      setMediaItemTitleEdit(false);
                    }}
                    onChange={(e: any) => {
                      setMedia({ ...media, title: e.target.value });
                    }}
                  />
                </div>
              ) : (
                media.title
              )}
            </h3>
            <ToggleGroup
              type="multiple"
              variant="outline"
              size="sm"
              defaultValue={media.status}
            >
              <Tooltip title="展示">
                <ToggleGroupItem value="exhibition">
                  <Clapperboard />
                </ToggleGroupItem>
              </Tooltip>
              <Tooltip title="存储">
                <ToggleGroupItem value="storage">
                  <Database />
                </ToggleGroupItem>
              </Tooltip>
            </ToggleGroup>
          </div>
          <div className="flex-1 flex justify-between text-sm text-gray-600 py-2 relative">
            <span className="capitalize">{media.type}</span>
            <span>{dayjs(media.updateTime).format("YYYY-MM-DD")}</span>
            <div className="opacity-0 absolute inset-0 bg-white border-t border-gray-100 transition-all translate-y-[100%] group-hover/mediaHover:translate-y-0 group-hover/mediaHover:opacity-100">
              <div className="flex justify-between items-end h-full">
                <div className="flex-1 overflow-x-auto flex gap-1">
                  {media.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="px-2 py-1 bg-gray-100 rounded-full text-xs capitalize flex gap-2 items-center h-6"
                    >
                      {tag}
                      {media.tags.length > 1 && (
                        <X
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => {
                            setMedia({
                              ...media,
                              tags: media.tags.filter((item) => item !== tag),
                            });
                          }}
                        />
                      )}
                    </div>
                  ))}

                  <div className="px-2 py-1 bg-gray-100 rounded-full text-xs capitalize flex gap-2 items-center h-6">
                    {mediaTagEdit ? (
                      <Select
                        style={{
                          width: 100,
                          height: `calc(var(--spacing) * 6)`,
                        }}
                        allowClear
                        defaultOpen
                        showSearch
                        optionFilterProp="label"
                        className={`${styles.customSelect} h-6`}
                        onSearch={(value) => {
                          setTags(
                            Array.from(new Set([...(defaultTags || []), value]))
                          );
                        }}
                        ref={mediaTagRef}
                        onBlur={() => setMediaTagEdit(false)}
                        onChange={(value: string) => {
                          if (!value) return;
                          mediaTagRef.current.blur();
                          request("/api/tags", {
                            method: "post",
                            body: {
                              tagName: value,
                            },
                          }).then((res: CommonResponse) => {
                            if (res.code === codeMap.success) {
                              setMedia({
                                ...media,
                                tags: Array.from(
                                  new Set([...media.tags, value])
                                ).slice(0, 3),
                              });
                              setDefaultTags(
                                Array.from(
                                  new Set([...(defaultTags || []), value])
                                )
                              );
                            }
                          });
                        }}
                        suffixIcon={<div></div>}
                        options={tags
                          .filter((item) => item)
                          .map((item) => ({
                            value: item,
                            label: item,
                          }))}
                        optionRender={(option) => (
                          <div className="flex justify-between items-center">
                            <div>{option.value}</div>
                            <CircleX
                              className="w-3 h-3 stroke-red-400 hover:stroke-red-600"
                              onClick={(e) => {
                                e.stopPropagation();

                                request("/api/tags", {
                                  method: "delete",
                                  body: {
                                    tagName: option.value,
                                  },
                                }).then((res: CommonResponse) => {
                                  if (res.code === codeMap.success) {
                                    setDefaultTags(
                                      !defaultTags
                                        ? []
                                        : defaultTags.filter(
                                            (tag) => tag !== option.value
                                          )
                                    );
                                    setTags(
                                      tags.filter((tag) => tag !== option.value)
                                    );
                                  }
                                });
                              }}
                            ></CircleX>
                          </div>
                        )}
                        getPopupContainer={(triggerNode) => {
                          return triggerNode.parentNode.parentNode.parentNode
                            .parentNode as HTMLElement;
                        }}
                      />
                    ) : (
                      <Plus
                        className="h-4 w-4"
                        onClick={() => setMediaTagEdit(true)}
                      ></Plus>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant={"ghost"} className="h-6 w-6">
                    <SquareArrowOutUpRight className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center transition-all" />
                  </Button>
                  <Button
                    variant={"ghost"}
                    className="h-6 w-6"
                    onClick={() => {
                      deleteCb?.();
                    }}
                  >
                    <Trash className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center transition-all" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
