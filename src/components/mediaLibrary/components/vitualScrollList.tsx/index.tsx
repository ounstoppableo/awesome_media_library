import { CommonResponse } from "@/types/response";
import useVitualScrollLogic from "../../hooks/useVitualScrollLogic";
import MediaItem, { MediaStruct } from "../mediaItem";
import request from "@/utils/fetch";
import { App } from "antd";
import { codeMap } from "@/utils/backendStatus";
import { wsSend } from "@/utils/clientWsMethod";
import { WsOperateRequestDataType } from "@/wsConstructor/router/operateRouter";
import { useEffect, useRef } from "react";

export default function VitualScrollList(props: any) {
  const {
    mediaItemHeight,
    mediaGap,
    rowBaseCount,
    headerHeight,
    mediaData,
    listContainerRef,
    showSelect,
    setMediaData,
    setSelectedMedias,
    selectedMediaIds,
    isAuth,
    tags,
    socketRef,
  } = props;
  const { message } = App.useApp();
  const { ghostDomHeight, showData } = useVitualScrollLogic({
    itemHeight: mediaItemHeight,
    itemGap: mediaGap,
    rowBaseCount: rowBaseCount,
    headerHeight: headerHeight,
    data: mediaData,
    scrollContainerRef: listContainerRef,
    setData: setMediaData,
    tolerateRowCount: 6,
  });

  const errorMediaIds = useRef(new Set<any>([]));
  return (
    showData.length > 0 && (
      <div
        id="mediaContainer"
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        style={{
          marginTop: ghostDomHeight.up + "px",
          marginBottom: ghostDomHeight.down + "px",
        }}
      >
        {showData
          .map((media) => ({
            ...media,
            loadError: errorMediaIds.current.has(media.id),
          }))
          .map((media: MediaStruct) => (
            <MediaItem
              showSelect={showSelect}
              handleSelect={(media: MediaStruct) => {
                setSelectedMedias?.([
                  ...mediaData.filter((media: MediaStruct) =>
                    selectedMediaIds?.includes(media.id),
                  ),
                  media,
                ]);
              }}
              handleCancelSelected={(media) => {
                const selectedIds = selectedMediaIds?.filter(
                  (id: any) => id !== media.id,
                );
                setSelectedMedias?.(
                  mediaData.filter((media: MediaStruct) =>
                    selectedIds?.includes(media.id),
                  ),
                );
              }}
              selected={
                selectedMediaIds?.findIndex((id: any) => id === media.id) !== -1
              }
              tags={tags}
              media={media}
              key={media.id}
              deleteConfirm={true}
              isAuth={isAuth}
              deleteCb={() => {
                request("/api/media", {
                  method: "delete",
                  body: {
                    ids: [media.id],
                  },
                }).then((res: CommonResponse) => {
                  if (res.code === codeMap.success) {
                    message.success(res.msg);
                    const index = mediaData.findIndex(
                      (item: any) => media.id === item.id,
                    );
                    setMediaData([
                      ...mediaData.slice(0, index),
                      ...mediaData.slice(index + 1),
                    ]);
                  }
                });
              }}
              infoChangeCb={(value) => {
                socketRef.current &&
                  wsSend(socketRef.current, {
                    type: "operate",
                    data: {
                      type: "mediaInfoEdit",
                      mediaId: value.id,
                      fileInfo: {
                        title: value.title,
                        tags: value.tags,
                        status: value.status,
                      },
                    } as WsOperateRequestDataType<"mediaInfoEdit">,
                  });
                requestAnimationFrame(() => {
                  const mediaIndex = mediaData.findIndex(
                    (media: any) => media.id === value.id,
                  );
                  mediaIndex !== -1 &&
                    setMediaData([
                      ...mediaData.slice(0, mediaIndex),
                      value,
                      ...mediaData.slice(mediaIndex + 1),
                    ]);
                });
              }}
              onLoadError={() => {
                errorMediaIds.current.add(media.id);
              }}
            ></MediaItem>
          ))}
      </div>
    )
  );
  {
  }
}
