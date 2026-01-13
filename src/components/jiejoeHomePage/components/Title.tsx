import {
  BrandScroller,
  BrandScrollerReverse,
} from "@/components/ui/brand-scoller";
import { useEffect } from "react";

export default function Title(props: { title: any; textStyle: any }) {
  const { title, textStyle } = props;

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
          <BrandScroller />
        </div>
        <div className="absolute -top-[12vmin] w-full -rotate-5">
          <BrandScrollerReverse />
        </div>
      </div>
    </div>
  );
}
