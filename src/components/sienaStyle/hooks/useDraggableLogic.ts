import useMoveCursor from "@/hooks/useMoveCursor";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable, InertiaPlugin } from "gsap/all";
import { createTimeline, stagger, splitText } from "animejs";
import { useGSAP } from "@gsap/react";

export default function useDraggableLogic(props: any) {
  const {
    init,
    odometer,
    currentDirection,
    scrollContainer,
    dualScrollRef,
    loop,
    scrollWrapper,
    currentReadPhotoId,
    snap,
    switchToItemWithEffect,
    currentIndex,
    currentIndexWatcher,
    setCurrentIndex,
    scrollContainerItems,
    gap,
  } = props;
  const dragInst = useRef<any>(null);
  const [form, setForm] = useState<"default" | "mousedown" | "up" | "down">(
    "default"
  );
  const [cursorVisible, setCursorVisible] = useState(false);

  const { contextSafe } = useGSAP({ scope: scrollWrapper });
  useGSAP(
    () => {
      if (!init) return;
      const odometerDistance = odometer.current?.parentElement?.offsetWidth;
      const wrapperSize =
        currentDirection === "y"
          ? scrollWrapper.current?.offsetHeight
          : scrollWrapper.current?.offsetWidth;
      const scrollSize =
        currentDirection === "y"
          ? scrollContainer.current?.offsetHeight
          : scrollContainer.current?.offsetWidth;

      const trickerQueue = [
        () => {
          dualScrollRef.current[0] &&
            gsap.set(dualScrollRef.current[0], {
              [currentDirection]: "+=1",
              modifiers: {
                [currentDirection]: function (offset) {
                  return loop.current(offset) + "px";
                },
              },
            });
        },
        () => {
          dualScrollRef.current[1] &&
            gsap.set(dualScrollRef.current[1], {
              [currentDirection]: "-=1",
              modifiers: {
                [currentDirection]: function (offset) {
                  return loop.current(offset) + "px";
                },
              },
            });
        },
      ];

      if (currentReadPhotoId) {
        gsap.set(scrollContainer.current, {
          [currentDirection]: 0,
        });
        gsap.fromTo(
          dualScrollRef.current[0],
          { [currentDirection]: snap[snap.length - 1] },
          {
            [currentDirection]: snap[Math.ceil(snap.length / 2) - 1],
          }
        );
        gsap.fromTo(
          dualScrollRef.current[1],
          { [currentDirection]: 0 },
          {
            [currentDirection]:
              snap[Math.ceil(snap.length / 2) - 1] + (snap[0] - snap[1]),
          }
        );
        trickerQueue.forEach((trickerCb) => gsap.ticker.add(trickerCb));
        dragInst.current = [
          ...Draggable.create(dualScrollRef.current[0], {
            type: currentDirection,
            cursor: "grab",
            activeCursor: "grabbing",
            allowEventDefault: false,
            inertia: true,
            onDrag: function () {
              trickerQueue.forEach((trickerCb) =>
                gsap.ticker.remove(trickerCb)
              );
              gsap.set(dualScrollRef.current[1], {
                [currentDirection]: -this[currentDirection],
                modifiers: {
                  [currentDirection]: function (offset) {
                    return loop.current(offset) + "px";
                  },
                },
              });
              odometer.current &&
                gsap.to(odometer.current, {
                  x:
                    ((this["pointer" + currentDirection.toUpperCase()] -
                      wrapperSize! / 2) /
                      wrapperSize!) *
                    odometerDistance!,
                });
            },
            onDragEnd: function () {
              odometer.current &&
                gsap.to(odometer.current, {
                  x: 0,
                });
            },
            onThrowUpdate() {
              gsap.set(dualScrollRef.current[1], {
                [currentDirection]: -this[currentDirection],
                modifiers: {
                  [currentDirection]: function (offset) {
                    return loop.current(offset) + "px";
                  },
                },
              });
              gsap.set(this.target, {
                [currentDirection]: this[currentDirection],
                modifiers: {
                  [currentDirection]: function (offset) {
                    return loop.current(offset) + "px";
                  },
                },
              });
            },
            onThrowComplete() {
              trickerQueue.forEach((trickerCb) => gsap.ticker.add(trickerCb));
            },
          }),
          ...Draggable.create(dualScrollRef.current[1], {
            type: currentDirection,
            cursor: "grab",
            activeCursor: "grabbing",
            allowEventDefault: false,
            inertia: true,
            onDrag: function () {
              gsap.set(dualScrollRef.current[0], {
                [currentDirection]: -this[currentDirection],
                modifiers: {
                  [currentDirection]: function (offset) {
                    return loop.current(offset) + "px";
                  },
                },
              });
              odometer.current &&
                gsap.to(odometer.current, {
                  x:
                    ((this["pointer" + currentDirection.toUpperCase()] -
                      wrapperSize! / 2) /
                      wrapperSize!) *
                    odometerDistance!,
                });
            },
            onDragEnd: function () {
              odometer.current &&
                gsap.to(odometer.current, {
                  x: 0,
                });
            },
            onThrowUpdate() {
              gsap.set(dualScrollRef.current[0], {
                [currentDirection]: -this[currentDirection],
                modifiers: {
                  [currentDirection]: function (offset) {
                    return loop.current(offset) + "px";
                  },
                },
              });
              gsap.set(this.target, {
                [currentDirection]: this[currentDirection],
                modifiers: {
                  [currentDirection]: function (offset) {
                    return loop.current(offset) + "px";
                  },
                },
              });
            },
          }),
        ];
      } else {
        if (currentDirection === "x") {
          gsap.fromTo(
            scrollContainer.current,
            { gap: Math.abs(snap[0] - snap[1]) * 2 },
            { gap, duration: 0.8 }
          );
        }
        dragInst.current = Draggable.create(scrollContainer.current, {
          type: currentDirection,
          cursor: "grab",
          activeCursor: "grabbing",
          allowEventDefault: false,
          inertia: true,
          onDrag: function () {
            switchToItemWithEffect(null, null, this[currentDirection]);

            odometer.current &&
              gsap.to(odometer.current, {
                x:
                  ((this["pointer" + currentDirection.toUpperCase()] -
                    wrapperSize! / 2) /
                    wrapperSize!) *
                  odometerDistance!,
              });
          },
          onDragEnd: function () {
            odometer.current &&
              gsap.to(odometer.current, {
                x: 0,
              });
          },
          onThrowUpdate() {
            gsap.set(this.target, {
              [currentDirection]: this[currentDirection],
              modifiers: {
                [currentDirection]: function (offset) {
                  return loop.current(offset) + "px";
                },
              },
            });
          },
          snap: { [currentDirection]: snap },
        });
      }

      return () => {
        dragInst.current.forEach((item: any) => {
          item.kill();
        });
        trickerQueue.forEach((trickerCb) => gsap.ticker.remove(trickerCb));
      };
    },
    {
      dependencies: [snap, currentDirection, init, currentReadPhotoId],
      scope: scrollWrapper,
      revertOnUpdate: true,
    }
  );
  const twine = useRef<any>(null);
  // 控制cursor状态
  const handleControlCursor = (index: number) => {
    if (index < currentIndex) {
      setForm("up");
    }
    if (index > currentIndex) {
      setForm("down");
    }
    if (index === currentIndex) {
      setForm(form === "mousedown" ? "mousedown" : "default");
    }
  };
  const handleChangeCurrent = contextSafe((type: "up" | "down" | "") => {
    if (!type) return;
    if (twine.current) return;
    dragInst.current[0].disable();
    twine.current = gsap.to(scrollContainer.current, {
      overwrite: false,
      [currentDirection]:
        snap[type === "down" ? currentIndex - 1 : currentIndex + 1],
      onUpdate: () => {
        const offset = gsap.getProperty(
          scrollContainer.current,
          currentDirection
        );
        gsap.set(scrollContainer.current, {
          [currentDirection]: loop.current(offset),
        });
        handleControlCursor(
          type === "down" ? currentIndex - 1 : currentIndex + 1
        );
      },
      onComplete: () => {
        const offset = gsap.getProperty(
          scrollContainer.current,
          currentDirection
        );
        gsap.set(scrollContainer.current, {
          [currentDirection]: loop.current(offset),
        });
        handleControlCursor(
          type === "down" ? currentIndex - 1 : currentIndex + 1
        );
        dragInst.current[0].enable();
        twine.current = null;
      },
    });
  });
  useEffect(() => {
    handleControlCursor(currentIndex);
  }, [currentIndex]);
  useGSAP(
    () => {
      if (!currentReadPhotoId) {
        currentIndexWatcher.current = setInterval(() => {
          if (scrollContainer.current === null) return;
          const offset = +gsap.getProperty(
            scrollContainer.current,
            currentDirection
          );
          setCurrentIndex(
            snap.findIndex(
              (item: any) => item === gsap.utils.snap(snap, offset)
            )
          );
        }, 16);
      }
      return () => {
        clearInterval(currentIndexWatcher.current);
      };
    },
    {
      dependencies: [snap, currentReadPhotoId],
      scope: scrollWrapper,
      revertOnUpdate: true,
    }
  );

  const splits = useRef<any>(null);
  const textSplitAntiShake = useRef<any>(null);
  const textSplitTimeLine = useRef<any>(createTimeline());
  useEffect(() => {
    if (textSplitAntiShake.current) clearTimeout(textSplitAntiShake.current);
    textSplitAntiShake.current = setTimeout(() => {
      textSplitTimeLine.current.reset();
      textSplitTimeLine.current.remove(splits.current?.chars);
      splits.current?.revert();
      const textContainer =
        scrollContainerItems.current[currentIndex]?.querySelector(
          ".photoTitle"
        );
      if (!textContainer) return;
      splits.current = splitText(textContainer, {
        chars: {
          wrap: "clip",
          clone: "bottom",
        },
      });
      textSplitTimeLine.current.add(
        splits.current.chars,
        {
          y: "-100%",
          loop: true,
          loopDelay: 500,
          duration: 1000,
          ease: "inOut(2)",
        },
        stagger(150, { from: "center" })
      );
    }, 2000);
    return () => {
      textSplitTimeLine.current.reset();
      textSplitTimeLine.current.remove(splits.current?.chars);
      splits.current?.revert();
    };
  }, [currentIndex]);
  return {
    cursorVisible,
    form,
    setForm,
    handleChangeCurrent,
    handleControlCursor,
    setCursorVisible,
  };
}
