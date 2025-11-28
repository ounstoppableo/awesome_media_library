import useMoveCursor from "@/hooks/useMoveCursor";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable, InertiaPlugin } from "gsap/all";

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
  } = props;
  const dragInst = useRef<any>(null);
  const { form, cursor, setForm } = useMoveCursor({ currentDirection });
  useEffect(() => {
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
      gsap.set(dualScrollRef.current[0], {
        [currentDirection]: snap[Math.ceil(snap.length / 2) - 1],
      });
      gsap.set(dualScrollRef.current[1], {
        [currentDirection]:
          snap[Math.ceil(snap.length / 2) - 1] + (snap[0] - snap[1]),
      });
      trickerQueue.forEach((trickerCb) => gsap.ticker.add(trickerCb));
      dragInst.current = [
        ...Draggable.create(dualScrollRef.current[0], {
          type: currentDirection,
          cursor: "grab",
          activeCursor: "grabbing",
          allowEventDefault: false,
          inertia: true,
          onDrag: function () {
            trickerQueue.forEach((trickerCb) => gsap.ticker.remove(trickerCb));
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
  }, [snap, currentDirection, init, currentReadPhotoId]);
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
  const handleChangeCurrent = (type: "up" | "down" | "") => {
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
  };
  useEffect(() => {
    handleControlCursor(currentIndex);
  }, [currentIndex]);
  useEffect(() => {
    if (!currentReadPhotoId) {
      currentIndexWatcher.current = setInterval(() => {
        if (scrollContainer.current === null) return;
        const offset = +gsap.getProperty(
          scrollContainer.current,
          currentDirection
        );
        setCurrentIndex(
          snap.findIndex((item: any) => item === gsap.utils.snap(snap, offset))
        );
      }, 16);
    }
    return () => {
      clearInterval(currentIndexWatcher.current);
    };
  }, [snap, currentReadPhotoId]);
  return { cursor, handleChangeCurrent, handleControlCursor };
}
