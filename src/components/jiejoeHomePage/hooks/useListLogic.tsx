import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function useListLogic(props: any) {
  const { data } = props;
  const container = useRef<any>(null);
  const [currentMouseHoverIndex, setCurrentMOuseHoverIndex] = useState(-1);
  const [mouseInfo, _setMouseInfo] = useState({ x: 0, y: 0 });
  const mouseInfoRef = useRef({ x: 0, y: 0 });
  const containerRect = useRef<any>({});
  const setMouseInfo = (info: any) => {
    _setMouseInfo({ x: info.x, y: info.y });
    mouseInfoRef.current = { x: info.x, y: info.y };
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
      if (mouseInfoRef.current.y > containerRect.current.height)
        setCurrentMOuseHoverIndex(-1);
    });
  };
  useEffect(() => {
    setContainerRect();
    const cb = (e: any) => {
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
    <div
      className="w-full flex-1 flex flex-col p-[12vmin] pt-0 relative"
      ref={container}
    >
      {data.slice(0, 6).map((item: any, index: number) => (
        <div
          className={`border-1 ${
            index === 0 ? "border-t-2" : index === 5 ? "border-b-2" : ""
          } border-white flex-1 border-x-0 flex px-[12vmin] items-center gap-[8vmin] `}
          key={item.id}
          onMouseMove={() => {
            setCurrentMOuseHoverIndex(index);
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
      {currentMouseHoverIndex !== -1 ? (
        <img
          className="absolute w-[60vmin] h-[40vmin] object-cover rounded-2xl -rotate-10"
          style={{ top: mouseInfo.y + "px", left: mouseInfo.x + "px" }}
          src={data[currentMouseHoverIndex].img}
        ></img>
      ) : (
        <></>
      )}
    </div>
  );
  return { listJsx };
}
