import { Button } from "@/components/button-1";
import dayjs from "dayjs";
import {
  Check,
  CircleCheck,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input, Select } from "antd";

export default function MediaItem(props: { media: any; showSelect?: boolean }) {
  const { media: defaultMediaData, showSelect = false } = props;
  const [selected, setSelected] = useState(false);
  const [media, setMedia] = useState(defaultMediaData);
  const [mediaItemTitleEdit, setMediaItemTitleEdit] = useState(false);
  const mediaItemTitleRef = useRef<any>(null);
  const [mediaTagEdit, setMediaTagEdit] = useState(false);
  const mediaTagRef = useRef<any>(null);
  const [tagName, setTagName] = useState("");
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 ">
              <Button className="rounded-full p-3 cursor-pointer">
                <Play className="text-white w-6 h-6"></Play>
              </Button>
            </div>
          </div>
        </>
      );
    } else if (media.type === "audio") {
      return (
        <div className="flex-1 relative  overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center ">
          <Music className="w-16 h-16 text-indigo-500 animate-pulse"></Music>
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

      <div className="w-full h-80 flex flex-col bg-white rounded-xl shadow-lg overflow-hidden transition-all group-hover/mediaHover:shadow-indigo-200">
        {mediaContent()}
        <div className="p-4 flex flex-col">
          <h3
            className="font-semibold text-lg truncate h-8 flex items-center"
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
          <div className="flex-1 flex justify-between text-sm text-gray-600 py-2 relative">
            <span className="capitalize">{media.type}</span>
            <span>{dayjs(media.date).format("YYYY-MM-DD")}</span>
            <div className="opacity-0 absolute inset-0 bg-white border-t border-gray-100 transition-all translate-y-[100%] group-hover/mediaHover:translate-y-0 group-hover/mediaHover:opacity-100">
              <div className="flex justify-between items-end h-full">
                <div className="flex-1 overflow-hidden flex gap-1">
                  <div className="px-2 py-1 bg-gray-100 rounded-full text-xs capitalize flex gap-2 items-center h-6">
                    {media.category}
                    <X className="h-4 w-4 cursor-pointer" />
                  </div>
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
                        onSearch={() => {}}
                        ref={mediaTagRef}
                        onBlur={() => setMediaTagEdit(false)}
                        onChange={(value: string) => setTagName(value)}
                        suffixIcon={<div></div>}
                        options={[
                          {
                            value: "jack",
                            label: "Jack",
                          },
                          {
                            value: "lucy",
                            label: "Lucy",
                          },
                          {
                            value: "tom",
                            label: "Tom",
                          },
                        ]}
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
                  <Button variant={"ghost"} className="h-6 w-6">
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
