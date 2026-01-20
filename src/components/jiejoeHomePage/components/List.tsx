import ClientPortal from "@/components/clientPortal";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function List(props: any) {
  const { data, windowTrackRef, clickCb } = props;
  const container = useRef<any>(null);
  const [currentMouseHoverIndex, setCurrentMouseHoverIndex] = useState(-1);
  const imageRef = useRef<any>(null);
  const [showPhotoContainer, setShowPhotoContainer] = useState<boolean>(false);
  const xTo = useRef<any>(null);
  const yTo = useRef<any>(null);
  useEffect(() => {
    if (showPhotoContainer) {
      xTo.current = gsap.quickTo(imageRef.current, "x", {
        duration: 0.2,
        ease: "power3.out",
      });
      yTo.current = gsap.quickTo(imageRef.current, "y", {
        duration: 0.2,
        ease: "power3.out",
      });
    } else {
      xTo.current = null;
      yTo.current = null;
    }
  }, [showPhotoContainer]);

  const mouseInfoRef = useRef({ x: 0, y: 0 });
  const updateImageOffset = (info: { x: number; y: number }) => {
    if (xTo.current && yTo.current) {
      xTo.current(info.x);
      yTo.current(info.y);
    }
  };
  const setMouseInfo = (info: any) => {
    mouseInfoRef.current = { x: info.x, y: info.y };
    updateImageOffset(mouseInfoRef.current);
  };
  const items = useRef<any[]>([]);

  useEffect(() => {
    let _twines: any = [];
    if (showPhotoContainer) {
      gsap.set(imageRef.current, {
        x: mouseInfoRef.current.x,
        y: mouseInfoRef.current.y,
        opacity: 1,
      });

      if (currentMouseHoverIndex !== -1) {
        _twines.push(
          gsap.fromTo(
            imageRef.current.querySelector("img"),
            {
              scale: 1.3,
              rotate: -30,
            },
            {
              scale: 1,
              rotate: 0,
            }
          )
        );
      }
    }
    return () => {
      _twines.forEach(async (t: any) => {
        await t;
        t.kill();
      });
    };
  }, [currentMouseHoverIndex, showPhotoContainer]);

  useEffect(() => {
    const cb = (e: any) => {
      setMouseInfo({ x: e.x, y: e.y });
    };
    window.addEventListener("mousemove", cb);
    return () => {
      window.removeEventListener("mousemove", cb);
    };
  }, []);

  const tms = useRef<any[]>([]);
  useEffect(() => {
    const duration = 0.3;
    items.current.forEach((item, index) => {
      const tm = gsap.timeline();
      tms.current[index] = tm;
      tm.to(
        item.querySelector(".background"),
        {
          scaleY: 1,
          duration,
        },
        0
      );
      tm.to(
        item.querySelector(".sequenceNumber"),
        {
          textShadow: `  
2px 0 0 var(--themeColor),
-2px 0 0 var(--themeColor),
0 2px 0 var(--themeColor),
0 -2px 0 var(--themeColor)`,
          color: "var(--themeColor)",
          duration,
        },
        0
      );
      tm.to(
        item.querySelector(".otherText"),
        {
          color: "black",
          duration,
        },
        0
      );
      tm.to(
        item.querySelector(".date"),
        {
          color: "black",
          duration,
        },
        0
      );
    });
    return () => {
      tms.current.forEach((tm) => {
        tm.kill();
      });
    };
  }, []);
  const previousMouseHoverIndex = useRef(-1);
  useEffect(() => {
    if (!showPhotoContainer) {
      tms.current.forEach((tm) => {
        tm.reverse();
      });
    } else {
      currentMouseHoverIndex !== -1 &&
        tms.current[currentMouseHoverIndex].play();
      previousMouseHoverIndex.current !== -1 &&
        previousMouseHoverIndex.current !== currentMouseHoverIndex &&
        tms.current[previousMouseHoverIndex.current].reverse();
    }
    previousMouseHoverIndex.current = currentMouseHoverIndex;
  }, [currentMouseHoverIndex, showPhotoContainer]);

  return (
    <div className="w-full flex-1 p-[12vmin] pt-0">
      <div
        className="w-full h-full relative flex flex-col"
        ref={container}
        onMouseLeave={() => {
          setShowPhotoContainer(false);
        }}
      >
        {data.slice(0, 6).map((item: any, index: number) => (
          <div
            ref={(el) => {
              items.current[index] = el;
            }}
            onClick={() => clickCb(item)}
            className={`border-1 ${
              index === 0 ? "border-t-2" : index === 5 ? "border-b-2" : ""
            } border-white flex-1 border-x-0  cursor-pointer relative`}
            key={item.id}
            onMouseMove={() => {
              if (index !== currentMouseHoverIndex) {
                setCurrentMouseHoverIndex(index);
              }
              setShowPhotoContainer(true);
            }}
          >
            <div className="absolute inset-0 z-10 flex px-[12vmin] items-center gap-[8vmin]">
              <div
                className="text-[16vmin] leading-[14vmin] font-extrabold sequenceNumber dark:text-black"
                style={{
                  textShadow: ` 
      2px 0 0 white,
     -2px 0 0 white,
      0 2px 0 white,
      0 -2px 0 white`,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="text-white flex flex-col justify-between h-[12vmin] otherText overflow-hidden">
                <div className="text-[6vmin] leading-[6vmin] font-extrabold truncate">
                  {item.englishTitle}
                </div>
                <div className="text-[3vmin] leading-[3vmin] truncate">
                  + {item.chineseTitle} +
                </div>
              </div>
              <div className="flex-1"></div>
              <div className="text-white text-[3vmin] leading-[3vmin] date">
                {item.date}
              </div>
            </div>
            <div className="absolute inset-0 bg-white scale-y-0 origin-center z-0 background"></div>
          </div>
        ))}
        <ClientPortal target={windowTrackRef}>
          {showPhotoContainer && (
            <div
              ref={imageRef}
              className="absolute top-0 left-0 rounded-2xl w-[60vmin] h-[40vmin] -rotate-10 overflow-hidden bg-white z-20 opacity-0"
            >
              {
                <img
                  className="object-cover w-full h-full"
                  src={
                    data[currentMouseHoverIndex].type === "video"
                      ? data[currentMouseHoverIndex].thumbnail
                      : data[currentMouseHoverIndex].sourcePath
                  }
                ></img>
              }
            </div>
          )}
        </ClientPortal>
      </div>
    </div>
  );
}
