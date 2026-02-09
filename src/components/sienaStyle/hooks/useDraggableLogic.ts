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
    currentDirectionSync,
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
        currentDirectionSync.current === "y"
          ? scrollWrapper.current?.offsetHeight
          : scrollWrapper.current?.offsetWidth;
      const scrollSize =
        currentDirectionSync.current === "y"
          ? scrollContainer.current?.offsetHeight
          : scrollContainer.current?.offsetWidth;

      const trickerQueue = [
        () => {
          dualScrollRef.current[0] &&
            gsap.set(dualScrollRef.current[0], {
              [currentDirectionSync.current]: "+=1",
              modifiers: {
                [currentDirectionSync.current]: function (offset) {
                  return loop.current(offset) + "px";
                },
              },
            });
        },
        () => {
          dualScrollRef.current[1] &&
            gsap.set(dualScrollRef.current[1], {
              [currentDirectionSync.current]: "-=1",
              modifiers: {
                [currentDirectionSync.current]: function (offset) {
                  return loop.current(offset) + "px";
                },
              },
            });
        },
      ];

      if (currentReadPhotoId) {
        gsap.set(scrollContainer.current, {
          [currentDirectionSync.current]: 0,
        });
        gsap.fromTo(
          dualScrollRef.current[0],
          { [currentDirectionSync.current]: snap[snap.length - 1] },
          {
            [currentDirectionSync.current]:
              snap[Math.ceil(snap.length / 2) - 1],
          }
        );
        gsap.fromTo(
          dualScrollRef.current[1],
          { [currentDirectionSync.current]: 0 },
          {
            [currentDirectionSync.current]:
              snap[Math.ceil(snap.length / 2) - 1] + (snap[0] - snap[1]),
          }
        );
        trickerQueue.forEach((trickerCb) => gsap.ticker.add(trickerCb));
        dragInst.current = [
          ...Draggable.create(dualScrollRef.current[0], {
            type: currentDirectionSync.current,
            cursor: "grab",
            activeCursor: "grabbing",
            allowEventDefault: false,
            inertia: true,
            onDrag: function () {
              trickerQueue.forEach((trickerCb) =>
                gsap.ticker.remove(trickerCb)
              );
              gsap.set(dualScrollRef.current[1], {
                [currentDirectionSync.current]:
                  -this[currentDirectionSync.current],
                modifiers: {
                  [currentDirectionSync.current]: function (offset) {
                    return loop.current(offset) + "px";
                  },
                },
              });
              odometer.current &&
                gsap.to(odometer.current, {
                  x:
                    ((this[
                      "pointer" + currentDirectionSync.current.toUpperCase()
                    ] -
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
                [currentDirectionSync.current]:
                  -this[currentDirectionSync.current],
                modifiers: {
                  [currentDirectionSync.current]: function (offset) {
                    return loop.current(offset) + "px";
                  },
                },
              });
              gsap.set(this.target, {
                [currentDirectionSync.current]:
                  this[currentDirectionSync.current],
                modifiers: {
                  [currentDirectionSync.current]: function (offset) {
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
            type: currentDirectionSync.current,
            cursor: "grab",
            activeCursor: "grabbing",
            allowEventDefault: false,
            inertia: true,
            onDrag: function () {
              gsap.set(dualScrollRef.current[0], {
                [currentDirectionSync.current]:
                  -this[currentDirectionSync.current],
                modifiers: {
                  [currentDirectionSync.current]: function (offset) {
                    return loop.current(offset) + "px";
                  },
                },
              });
              odometer.current &&
                gsap.to(odometer.current, {
                  x:
                    ((this[
                      "pointer" + currentDirectionSync.current.toUpperCase()
                    ] -
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
                [currentDirectionSync.current]:
                  -this[currentDirectionSync.current],
                modifiers: {
                  [currentDirectionSync.current]: function (offset) {
                    return loop.current(offset) + "px";
                  },
                },
              });
              gsap.set(this.target, {
                [currentDirectionSync.current]:
                  this[currentDirectionSync.current],
                modifiers: {
                  [currentDirectionSync.current]: function (offset) {
                    return loop.current(offset) + "px";
                  },
                },
              });
            },
          }),
        ];
      } else {
        if (currentDirectionSync.current === "x") {
          gsap.fromTo(
            scrollContainer.current,
            { gap: Math.abs(snap[0] - snap[1]) * 2 },
            { gap, duration: 0.8 }
          );
        }
        dragInst.current = Draggable.create(scrollContainer.current, {
          type: currentDirectionSync.current,
          cursor: "grab",
          activeCursor: "grabbing",
          allowEventDefault: false,
          inertia: true,
          onDrag: function () {
            switchToItemWithEffect(
              null,
              null,
              this[currentDirectionSync.current]
            );

            odometer.current &&
              gsap.to(odometer.current, {
                x:
                  ((this[
                    "pointer" + currentDirectionSync.current.toUpperCase()
                  ] -
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
              [currentDirectionSync.current]:
                this[currentDirectionSync.current],
              modifiers: {
                [currentDirectionSync.current]: function (offset) {
                  return loop.current(offset) + "px";
                },
              },
            });
          },
          snap: { [currentDirectionSync.current]: snap },
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
      [currentDirectionSync.current]:
        snap[type === "down" ? currentIndex - 1 : currentIndex + 1],
      onUpdate: () => {
        const offset = gsap.getProperty(
          scrollContainer.current,
          currentDirectionSync.current
        );
        gsap.set(scrollContainer.current, {
          [currentDirectionSync.current]: loop.current(offset),
        });
        handleControlCursor(
          type === "down" ? currentIndex - 1 : currentIndex + 1
        );
      },
      onComplete: () => {
        const offset = gsap.getProperty(
          scrollContainer.current,
          currentDirectionSync.current
        );
        gsap.set(scrollContainer.current, {
          [currentDirectionSync.current]: loop.current(offset),
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
            currentDirectionSync.current
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
