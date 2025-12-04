import { checkIsNone } from "@/utils/convention";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function useMoveCursor(props: { currentDirection: "x" | "y" }) {
  const { currentDirection } = props;
  const [point, setPoint] = useState<any>({ x: null, y: null });
  const cursorRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<"default" | "mousedown" | "up" | "down">(
    "default"
  );

  const [cursorVisible, setCursorVisible] = useState(false);
  useEffect(() => {
    const mousemoveCb = (e: any) => {
      requestAnimationFrame(() => {
        setPoint({ x: e.clientX, y: e.clientY });
      });
    };
    const mousedownCb = (e: any) => {
      form === "default" && setForm("mousedown");
    };
    const mouseupCb = (e: any) => {
      setForm("default");
    };
    window.addEventListener("mousemove", mousemoveCb);
    window.addEventListener("mousedown", mousedownCb);
    window.addEventListener("mouseup", mouseupCb);
    return () => {
      window.removeEventListener("mousemove", mousemoveCb);
      window.removeEventListener("mousedown", mousedownCb);
      window.removeEventListener("mouseup", mouseupCb);
    };
  }, []);
  const cursor = (
    <div
      ref={cursorRef}
      className={clsx(
        "absolute w-24 h-24 z-[9999] flex justify-center items-center text-white select-none pointer-events-none opacity-60 origin-[0%_0%] transition-[opacity,transform] ",
        cursorVisible && !checkIsNone(point.x) && !checkIsNone(point.y)
          ? "transform-[scale(1,1)_translate(-50%,-50%)]"
          : " transform-[scale(0,0)_translate(-50%,-50%)]"
      )}
      style={{
        top: point.y,
        left: point.x,
      }}
    >
      <div
        className={`${
          form === "default" ? "w-full h-full" : "w-4/6 h-4/6"
        } rounded-full border-2 border-white flex justify-center items-center transition-all duration-200`}
      >
        <div className={`w-fit h-fit overflow-hidden`}>
          <div
            className={` ${
              form === "default" ? "translate-0" : "translate-y-full"
            } transition-all duration-200`}
          >
            SCROLL
          </div>
        </div>
      </div>
      <div
        className={`${
          form === "default"
            ? "w-4/6 h-4/6 opacity-0"
            : "w-[120%] h-[120%] opacity-100"
        } transition-all duration-200 flex ${
          currentDirection === "y" ? "flex-col" : ""
        } justify-center items-center absolute`}
      >
        {(form === "mousedown" || form === "up") &&
          (currentDirection === "y" ? <ChevronUp /> : <ChevronLeft />)}
        <div className="flex-1"></div>
        {(form === "mousedown" || form === "down") &&
          (currentDirection === "y" ? <ChevronDown /> : <ChevronRight />)}
      </div>
    </div>
  );

  return { form, cursor, setForm, setCursorVisible };
}
