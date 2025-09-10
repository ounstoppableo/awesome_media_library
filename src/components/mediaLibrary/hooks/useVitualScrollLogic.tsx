import smoothDisposeArrayUnitFactory from "@/utils/smoothDisposeArrayUnitFactory";
import { useEffect, useRef, useState } from "react";

export default function useVitualScrollLogic(props: {
  data: any[];
  setData: Function;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  rowBaseCount: Function;
  itemHeight: number;
  itemGap: number;
  headerHeight: Function;

  tolerateRowCount?: number; // 容忍度用于防止列表闪烁
}) {
  const {
    data,
    setData,
    scrollContainerRef,
    rowBaseCount,
    itemHeight,
    itemGap,
    headerHeight,
    tolerateRowCount = 2,
  } = props;
  const [ghostDomHeight, setGhostDomHeight] = useState({ up: 0, down: 0 });
  const [showData, setShowData] = useState<any[]>([]);

  const rowBaseCountRef = useRef(0);

  useEffect(() => {
    const smoothGetMessagesInScreenFn = smoothDisposeArrayUnitFactory(
      () => data,
      (_, index) => {
        if (!scrollContainerRef.current) return true;
        const listContainerRect =
          scrollContainerRef.current.getBoundingClientRect();
        const listContainerScrollTop = scrollContainerRef.current.scrollTop;

        const listItemY =
          (itemHeight + itemGap) * Math.floor(index / rowBaseCount()) -
          listContainerScrollTop +
          headerHeight();

        if (listItemY >= 0 && listItemY <= listContainerRect.height) {
          return true;
        } else {
          return false;
        }
      },
      (mediaItem, index) => {
        if (!scrollContainerRef.current) return;

        let mediasInScreenIndexArray: any = [];
        const listContainerRect =
          scrollContainerRef.current.getBoundingClientRect();
        const listContainerScrollTop = scrollContainerRef.current.scrollTop;

        // 两头寻找在容器可视范围内的item
        const includeJudge = (i: number) => {
          const listItemY =
            (itemHeight + itemGap) * Math.floor(i / rowBaseCount()) -
            listContainerScrollTop +
            headerHeight();
          if (listItemY >= 0 && listItemY < listContainerRect.height) {
            mediasInScreenIndexArray.push(i);
            return true;
          } else {
            return false;
          }
        };
        for (let i = index; i >= 0; i--) {
          if (!includeJudge(i)) {
            break;
          }
        }
        for (let i = index + 1; i < data.length; i++) {
          if (!includeJudge(i)) {
            break;
          }
        }

        // 稳定高度后再进行替换
        requestAnimationFrame(() => {
          mediasInScreenIndexArray.sort((a: any, b: any) => a - b);

          // 容忍数组计算
          mediasInScreenIndexArray = Array.from(
            new Set([
              ...Array.from(
                { length: tolerateRowCount * rowBaseCount() },
                (_, i) =>
                  mediasInScreenIndexArray[0] - i - 1 >= 0
                    ? mediasInScreenIndexArray[0] - i - 1
                    : 0
              ).sort((a, b) => a - b),
              ...mediasInScreenIndexArray,
              ...Array.from(
                { length: tolerateRowCount * rowBaseCount() },
                (_, i) =>
                  mediasInScreenIndexArray[
                    mediasInScreenIndexArray.length - 1
                  ] +
                    i +
                    1 >=
                  data.length - 1
                    ? data.length - 1
                    : mediasInScreenIndexArray[
                        mediasInScreenIndexArray.length - 1
                      ] +
                      i +
                      1
              ),
            ])
          );

          setShowData(
            mediasInScreenIndexArray.map((i: number) => ({ ...data[i] }))
          );

          const upCount = mediasInScreenIndexArray[0];

          const downCount =
            data.length -
            mediasInScreenIndexArray[mediasInScreenIndexArray.length - 1] -
            1;
          setGhostDomHeight({
            up: (itemHeight + itemGap) * Math.ceil(upCount / rowBaseCount()),
            down:
              (itemHeight + itemGap) * Math.ceil(downCount / rowBaseCount()),
          });
        });
      }
    );
    smoothGetMessagesInScreenFn.execute();

    scrollContainerRef.current?.addEventListener(
      "scroll",
      smoothGetMessagesInScreenFn.execute
    );

    return () => {
      scrollContainerRef.current?.removeEventListener(
        "scroll",
        smoothGetMessagesInScreenFn.execute
      );
    };
  }, [data]);

  useEffect(() => {
    rowBaseCountRef.current = rowBaseCount();
    const _cb = () => {
      if (rowBaseCountRef.current === rowBaseCount()) return;
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      rowBaseCountRef.current = rowBaseCount();
    };
    window.addEventListener("resize", _cb);

    return () => {
      window.removeEventListener("resize", _cb);
    };
  }, []);

  return { ghostDomHeight, showData };
}
