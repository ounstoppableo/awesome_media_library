"use client";
import {
  BrandScroller,
  BrandScrollerReverse,
} from "@/components/ui/brand-scoller";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function Title(props: {
  title: any;
  textStyle: any;
  useScrollAnimation: boolean;
}) {
  const { title, textStyle } = props;
  const brandScroller = useRef<any>(null);
  const brandScrollerReverse = useRef<any>(null);
  useEffect(() => {
    const tm = gsap.timeline({
      scrollTrigger: {
        trigger: brandScroller.current,
        start: "top 80%",
        end: "bottom center",
        scrub: true,
      },
    });
    if (props.useScrollAnimation) {
      tm.fromTo(
        brandScroller.current,
        { x: "-100%" },
        {
          x: 0,
        },
        0
      );
      tm.fromTo(brandScrollerReverse.current, { x: "100%" }, { x: 0 }, 0);
    }
    return () => {
      tm.kill();
    };
  }, []);
  return (
    <div className="w-full h-fit relative mt-[min(8dvw,16dvh)] flex justify-center items-center flex-col">
      <div
        className="text-[16vmin] leading-[16vmin] font-extrabold"
        style={textStyle}
      >
        {title.toUpperCase()}
      </div>
      <div className="relative m-[12vmin] w-full">
        <div className="absolute -top-[12vmin] w-full rotate-5">
          <BrandScroller ref={brandScroller} />
        </div>
        <div className="absolute -top-[12vmin] w-full -rotate-5">
          <BrandScrollerReverse ref={brandScrollerReverse} />
        </div>
      </div>
    </div>
  );
}
