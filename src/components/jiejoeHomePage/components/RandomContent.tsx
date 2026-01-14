import { ImageSwiper } from "@/components/image-swiper";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useEffect, useRef, useState } from "react";

export default function RandomContent(props: any) {
  const { data } = props;
  const imageSwiperContainer = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const titleRef = useRef<any>(null);
  const introduceRef = useRef<any>(null);
  useEffect(() => {}, []);
  useEffect(() => {
    const split = SplitText.create(titleRef.current);
    const tw = gsap.timeline();
    const tw2 = gsap.timeline();

    split.chars.forEach((char) => {
      tw.fromTo(
        char,
        {
          opacity: 0,
          y: "-100%",
        },
        { opacity: 1, y: 0, duration: 0.1 },
        ">"
      );
    });
    tw2.fromTo(
      introduceRef.current,
      {
        opacity: 0,
        x: "-100%",
      },
      { opacity: 1, x: 0 }
    );

    return () => {
      split.revert();
      tw.kill();
      tw2.kill();
    };
  }, [currentIndex]);
  return (
    <>
      <div className="h-full w-2/5 flex flex-col justify-center gap-[10%] py-[10%] pl-[10%] brightness-120">
        <div
          className="text-[8vmin] leading-[8vmin] font-extrabold"
          style={{
            textShadow: ` 
2px 0 0 var(--themeColor),
-2px 0 0 var(--themeColor),
0 2px 0 var(--themeColor),
0 -2px 0 var(--themeColor)`,
          }}
          ref={titleRef}
        >
          {data[currentIndex].chineseTitle || data[currentIndex].englishTitle}
        </div>
        <div className="text-[2.5vmin] text-white" ref={introduceRef}>
          {data[currentIndex].introduce}
        </div>
        <InteractiveHoverButton
          className="text-xl w-48 min-h-12 z-20"
          text="Explore"
          defaultColor="bg-transparent"
          hoverColor="white"
          dotPosition={"45%"}
        />
      </div>
      <div
        className="h-full w-3/5 flex justify-center items-center"
        ref={imageSwiperContainer}
      >
        <ImageSwiper
          className="flex-1"
          images={data.map((item: any) => item.img)}
          container={imageSwiperContainer}
          getCurrentIndex={setCurrentIndex}
        />
      </div>
    </>
  );
}
