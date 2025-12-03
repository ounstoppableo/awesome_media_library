import { useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function useWheelLogic(props: any) {
  const {
    currentDirection,
    scrollContainerItems,
    currentReadPhotoId,
    dualScrollRef,
    snap,
    switchToItemWithEffect,
    scrollContainer,
    scrollWrapper,
    init,
  } = props;
  useGSAP(
    () => {
      // 控制滚轮事件
      let wheelTimer: any = null;
      let offset = 0;
      const itemSize =
        currentDirection === "y"
          ? scrollContainerItems.current[0].offsetHeight
          : scrollContainerItems.current[0]!.offsetWidth;
      const wheelCb = (e: any) => {
        // offset越靠近itemSize，速度越慢
        offset += (Math.abs(itemSize - offset) * e["deltaY"]) / 500;
        offset = offset % (itemSize / 2);

        if (currentReadPhotoId) {
          gsap.to(dualScrollRef.current[0], {
            [currentDirection]:
              gsap.utils.snap(
                snap,
                +gsap.getProperty(dualScrollRef.current[0], currentDirection)
              ) + offset,
          });
          gsap.to(dualScrollRef.current[1], {
            [currentDirection]:
              gsap.utils.snap(
                snap,
                +gsap.getProperty(dualScrollRef.current[1], currentDirection)
              ) - offset,
          });
          switchToItemWithEffect(null, null, offset, "to");
        } else {
          const currentOffset = +gsap.getProperty(
            scrollContainer.current,
            currentDirection
          );
          const targetOffset = gsap.utils.snap(snap, currentOffset) + offset;
          gsap.to(scrollContainer.current, {
            [currentDirection]: targetOffset,
          });
          switchToItemWithEffect(null, null, targetOffset, "to");
        }

        clearTimeout(wheelTimer);
        wheelTimer = setTimeout(() => {
          offset = 0;
          const targetOffset = gsap.utils.snap(
            snap,
            +gsap.getProperty(scrollContainer.current, currentDirection)
          );
          if (currentReadPhotoId) {
          } else {
            gsap.to(scrollContainer.current, {
              [currentDirection]: targetOffset,
            });
            switchToItemWithEffect(null, null, targetOffset, "to");
          }
        }, 100);
      };
      init && window.addEventListener("wheel", wheelCb);
      return () => {
        window.removeEventListener("wheel", wheelCb);
      };
    },
    {
      dependencies: [snap, currentDirection, currentReadPhotoId, init],
      scope: scrollWrapper,
      revertOnUpdate: true,
    }
  );
}
