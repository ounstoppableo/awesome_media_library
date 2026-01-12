import { checkIsNone } from "@/utils/convention";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import gsap from "gsap";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function useMoveCursor(props: { currentDirection: "x" | "y" }) {
  const { currentDirection } = props;
  const cursorRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<"default" | "mousedown" | "up" | "down">(
    "default"
  );

  const [cursorVisible, setCursorVisible] = useState(false);
  const xTo = useRef<any>(null);
  const yTo = useRef<any>(null);
  const cursorRefRect = useRef<any>({});
  useEffect(() => {
    xTo.current = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.2,
      ease: "power3.out",
    });
    yTo.current = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.2,
      ease: "power3.out",
    });
    cursorRefRect.current = cursorRef.current!.getBoundingClientRect();
  }, []);
  useEffect(() => {
    if (cursorVisible) {
      gsap.to(cursorRef.current, { opacity: 0.6, duration: 0.3 });
    } else {
      gsap.to(cursorRef.current, { opacity: 0, duration: 0.3 });
    }
  }, [cursorVisible]);
  const mouseInfoRef = useRef({ x: 0, y: 0 });
  const setPoint = (info: any) => {
    mouseInfoRef.current = { x: info.x, y: info.y };
    if (xTo.current && yTo.current) {
      xTo.current(mouseInfoRef.current.x - cursorRefRect.current.width / 2);
      yTo.current(mouseInfoRef.current.y - cursorRefRect.current.width / 2);
    }
  };
  useEffect(() => {
    const mousemoveCb = (e: any) => {
      setPoint({ x: e.clientX, y: e.clientY });
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
        "absolute w-24 h-24 z-[9999] flex justify-center items-center text-white select-none pointer-events-none opacity-0 origin-[0%_0%]"
      )}
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
