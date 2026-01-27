"use client";
import { ImageSwiper } from "@/components/image-swiper";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { CategoryItem } from "@/types/media";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useEffect, useRef, useState } from "react";

export default function RandomContent(props: any) {
  const { data, clickCb, handleCurrentIndexChange } = props;
  const imageSwiperContainer = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const titleRef = useRef<any>(null);
  const introduceRef = useRef<any>(null);
  const charsSplit = useRef<any>(null);
  useEffect(() => {}, []);
  useEffect(() => {
    handleCurrentIndexChange?.(currentIndex);
    charsSplit.current?.revert();
    charsSplit.current = SplitText.create(titleRef.current, {
      type: "lines,chars",
    });

    const tw = gsap.timeline();
    const tw2 = gsap.timeline();

    charsSplit.current.chars.forEach((char: any) => {
      tw.fromTo(
        char,
        {
          opacity: 0,
          y: "-100%",
        },
        { opacity: 1, y: 0, duration: 0.2 },
        ">"
      );
    });
    tw2.fromTo(
      introduceRef.current,
      {
        opacity: 0,
      },
      { opacity: 1, ease: "linear", duration: 0.8 }
    );

    return () => {
      charsSplit.current?.revert();
      tw.kill();
      tw2.kill();
    };
  }, [currentIndex]);
  return (
    <div className="w-full h-full flex justify-between gap-[12%]">
      <div className="h-full flex-1 flex flex-col justify-center pl-[8%] gap-[4%]">
        <div
          className="w-full text-[8vmin] leading-[8vmin] font-extrabold"
          style={{
            textShadow: ` 
2px 0 0 var(--themeColor),
-2px 0 0 var(--themeColor),
0 2px 0 var(--themeColor),
0 -2px 0 var(--themeColor)`,
          }}
          ref={titleRef}
          title={
            data[currentIndex].chineseTitle || data[currentIndex].englishTitle
          }
        >
          {data[currentIndex].chineseTitle || data[currentIndex].englishTitle}
        </div>
        <div className="text-[2.5vmin] text-white" ref={introduceRef}>
          {data[currentIndex].introduce}
        </div>
        <InteractiveHoverButton
          className="text-xl w-[24vmin] h-[6vmin] z-20"
          text="Explore"
          onClick={() => {
            clickCb(data[currentIndex]);
          }}
        />
      </div>
      <div
        className="h-full w-2/5 flex justify-center items-center translate-x-[-20%]"
        ref={imageSwiperContainer}
      >
        <ImageSwiper
          className="flex-1"
          images={data.map((item: CategoryItem) =>
            item.type === "video" ? item.thumbnail : item.sourcePath
          )}
          container={imageSwiperContainer}
          getCurrentIndex={(currentIndex: number) => {
            charsSplit.current?.revert();
            setCurrentIndex(currentIndex);
          }}
        />
      </div>
    </div>
  );
}
