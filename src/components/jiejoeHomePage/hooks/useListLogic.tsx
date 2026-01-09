import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function useListLogic(props: any) {
  const { data } = props;
  const container = useRef<any>(null);
  const [currentMouseHoverIndex, setCurrentMOuseHoverIndex] = useState(-1);
  const mouseInfoRef = useRef({ x: 0, y: 0 });
  const containerRect = useRef<any>({});
  const imageRef = useRef<any>(null);
  const [showPhotoContainer, setShowPhotoContainer] = useState<boolean>(false);
  const setMouseInfo = (info: any) => {
    mouseInfoRef.current = { x: info.x, y: info.y };
    if (imageRef.current) {
      const xTo = gsap.quickTo(imageRef.current, "x", {
        duration: 0.2,
        ease: "power3.out",
      });
      const yTo = gsap.quickTo(imageRef.current, "y", {
        duration: 0.2,
        ease: "power3.out",
      });
      xTo(mouseInfoRef.current.x - 40);
      yTo(mouseInfoRef.current.y - 40);
    }
  };
  const setContainerRect = (e?: any) => {
    if (!container.current) return;
    requestAnimationFrame(() => {
      containerRect.current = container.current.getBoundingClientRect();
      e &&
        setMouseInfo({
          x: mouseInfoRef.current.x,
          y: mouseInfoRef.current.y + e.deltaY,
        });
      if (
        mouseInfoRef.current.y > containerRect.current.height ||
        mouseInfoRef.current.y < 0
      ) {
        setShowPhotoContainer(false);
      }
    });
  };

  useEffect(() => {
    setContainerRect();
    const cb = (e: any) => {
      if (!containerRect.current.y) return;
      setMouseInfo({ x: e.x, y: e.y - containerRect.current.y });
    };
    window.addEventListener("mousemove", cb);
    window.addEventListener("wheel", setContainerRect);
    return () => {
      window.removeEventListener("mousemove", cb);
      window.removeEventListener("wheel", setContainerRect);
    };
  }, []);
  const listJsx = (
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
            className={`border-1 ${
              index === 0 ? "border-t-2" : index === 5 ? "border-b-2" : ""
            } border-white flex-1 border-x-0 flex px-[12vmin] items-center gap-[8vmin] cursor-pointer`}
            key={item.id}
            onMouseMove={() => {
              if (index !== currentMouseHoverIndex) {
                setCurrentMOuseHoverIndex(-1);
                requestAnimationFrame(() => {
                  setCurrentMOuseHoverIndex(index);
                });
              }
              setShowPhotoContainer(true);
            }}
          >
            <div
              className="text-[16vmin] leading-[14vmin] font-extrabold"
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
            <div className="text-white flex flex-col justify-between h-[12vmin]">
              <div className="text-[6vmin] leading-[6vmin] font-extrabold">
                {item.englishTitle}
              </div>
              <div className="text-[2vmin] leading-[2vmin]">
                + {item.chineseTitle} +
              </div>
            </div>
            <div className="flex-1"></div>
            <div className="text-white text-[3vmin] leading-[3vmin]">
              {item.date}
            </div>
          </div>
        ))}
        {showPhotoContainer && (
          <div
            ref={imageRef}
            className="absolute rounded-2xl w-[80vmin] h-[50vmin] -rotate-10 overflow-hidden bg-white border-4 border-white"
          >
            {currentMouseHoverIndex !== -1 ? (
              <img
                className="object-cover w-full h-full animate-rotate-show"
                src={data[currentMouseHoverIndex].img}
              ></img>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </div>
  );
  return { listJsx };
}
