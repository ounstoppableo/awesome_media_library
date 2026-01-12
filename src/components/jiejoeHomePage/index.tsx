import { FiMousePointer } from "react-icons/fi";
import MouseImageTrail from "../mouseImageTrail";
import { RainbowCursor } from "../rainbow-cursor";
import { VoicePoweredOrb } from "../voice-powered-orb";
import useAvatarLogic from "./hooks/useAvatarLogic";
import useBrightBallLogic from "./hooks/useBrightBallLogic";
import useFireWorksLogic from "./hooks/useFireWorksLogic";
import useFunBoardLogic from "./hooks/useFunBoardLogic";
import useResizeLogic from "./hooks/useResizeLogic";
import { ImageSwiper } from "../image-swiper";
import { use, useRef, useState } from "react";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";
import useListLogic from "./hooks/useListLogic";

export default function JiejoeHomePage() {
  const { resizeObserver, resizeObserverCb } = useResizeLogic();
  const { funBoardJsx } = useFunBoardLogic();
  const { brightBallJsx } = useBrightBallLogic();
  const { avatarJsx } = useAvatarLogic({ resizeObserverCb });
  const { fireworksJsx } = useFireWorksLogic();
  const [data, setData] = useState([
    {
      id: 1,
      img: "/img21.jpg",
      englishTitle: "Blench Bankai Mashup",
      chineseTitle: "死神千年血战宣传片",
      date: "2026.1.9",
    },
    {
      id: 2,
      img: "/img33.jpg",
      englishTitle: "Blench Bankai Mashup",
      chineseTitle: "死神千年血战宣传片",
      date: "2026.1.9",
    },
    {
      id: 3,
      img: "/Magic.jpg",
      englishTitle: "Blench Bankai Mashup",
      chineseTitle: "死神千年血战宣传片",
      date: "2026.1.9",
    },
    {
      id: 4,
      img: "/img33.jpg",
      englishTitle: "Blench Bankai Mashup",
      chineseTitle: "死神千年血战宣传片",
      date: "2026.1.9",
    },
    {
      id: 5,
      img: "/Magic.jpg",
      englishTitle: "Blench Bankai Mashup",
      chineseTitle: "死神千年血战宣传片",
      date: "2026.1.9",
    },
    {
      id: 6,
      img: "/Magic.jpg",
      englishTitle: "Blench Bankai Mashup",
      chineseTitle: "死神千年血战宣传片",
      date: "2026.1.9",
    },
    {
      id: 7,
      img: "/img33.jpg",
      englishTitle: "Blench Bankai Mashup",
      chineseTitle: "死神千年血战宣传片",
      date: "2026.1.9",
    },
    {
      id: 8,
      img: "/Magic.jpg",
      englishTitle: "Blench Bankai Mashup",
      chineseTitle: "死神千年血战宣传片",
      date: "2026.1.9",
    },
    {
      id: 9,
      img: "/Magic.jpg",
      englishTitle: "Blench Bankai Mashup",
      chineseTitle: "死神千年血战宣传片",
      date: "2026.1.9",
    },
    {
      id: 10,
      img: "/img33.jpg",
      englishTitle: "Blench Bankai Mashup",
      chineseTitle: "死神千年血战宣传片",
      date: "2026.1.9",
    },
    {
      id: 11,
      img: "/Magic.jpg",
      englishTitle: "Blench Bankai Mashup",
      chineseTitle: "死神千年血战宣传片",
      date: "2026.1.9",
    },
  ]);
  const { listJsx } = useListLogic({ data });
  const imageSwiperContainer = useRef<any>(null);
  return (
    <div className="w-[100dvw] h-[100dvh] noScrollbar overflow-auto">
      <div className="flex flex-col w-[100dvw] h-fit bg-black select-none noScrollbar overflow-x-hidden">
        <div className="w-full h-[100dvh] flex justify-center items-center relative">
          <div className="absolute inset-0 z-9">{fireworksJsx}</div>
          <div
            className="flex flex-col font-extrabold brightness-120 gap-2 absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3"
            style={{
              textShadow: ` 
            2px 0 0 #fff,
           -2px 0 0 #fff,
            0 2px 0 #fff,
            0 -2px 0 #fff`,
            }}
          >
            <div className="flex justify-center relative">
              <div className="w-[min(5dvw,14dvh)] aspect-square absolute left-0 bottom-0 translate-x-1/5">
                {avatarJsx}
              </div>
              <div className="text-[min(6dvw,16dvh)] leading-[min(6dvw,16dvh)] scale-y-125 text-white">
                AWESOME!
              </div>
            </div>
            <div
              className="pr-[min(12dvw,32dvh)] text-[var(--themeColor)] relative"
              style={{
                textShadow: ` 
                2px 0 0 var(--themeColor),
               -2px 0 0 var(--themeColor),
                0 2px 0 var(--themeColor),
                0 -2px 0 var(--themeColor)`,
              }}
            >
              <div className="text-[min(6dvw,16dvh)] leading-[min(6dvw,16dvh)] scale-y-125">
                CREATIVE!
              </div>
              <div className="w-1/3 absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/8">
                {funBoardJsx}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="text-[min(6dvw,16dvh)] leading-[min(6dvw,16dvh)] scale-y-125 flex gap-8">
                <span
                  style={{
                    textShadow: ` 
                2px 0 0 var(--themeColor),
               -2px 0 0 var(--themeColor),
                0 2px 0 var(--themeColor),
                0 -2px 0 var(--themeColor)`,
                  }}
                >
                  AND
                </span>
                <span className="text-white">COOL!</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-1">{brightBallJsx}</div>
          <div className="absolute bottom-16 text-[var(--themeColor)] flex flex-col items-center brightness-120 text-sm z-8">
            <VoicePoweredOrb
              enableScrollControl={true}
              enableVoiceControl={false}
              className="rounded-xl overflow-hidden shadow-2xl w-[16vmin] h-[8vmin]"
            />

            <div>- SCROLL TO EXPLORE -</div>
            <div>滚 · 动 · 探 · 索</div>
          </div>
        </div>
        <div className="w-full h-[200dvh] flex flex-col">{listJsx}</div>

        <div className="w-full h-[100dvh] flex items-center ">
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
            >
              Let's party
            </div>
            <div className="text-[2.5vmin] text-white">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor
              iusto quaerat qui, illo incidunt suscipit fugiat distinctio
              officia earum eius quae officiis quis harum animi. Lorem, ipsum
              dolor sit amet consectetur adipisicing elit. Dolor iusto quaerat
              qui, illo incidunt suscipit fugiat distinctio officia earum eius
              quae officiis quis harum animi.
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
              images={data.map((item) => item.img)}
              container={imageSwiperContainer}
            />
          </div>
        </div>
        <div className="w-full h-[100dvh] p-4">
          <MouseImageTrail
            renderImageBuffer={50}
            rotationRange={25}
            images={data.map((item) => item.img)}
          >
            <section className="grid h-full w-full place-content-center bg-black">
              <p className="flex items-center gap-2 text-3xl font-bold uppercase text-white">
                <FiMousePointer />
                <span>Hover me</span>
              </p>
            </section>
          </MouseImageTrail>
        </div>
        <div className="absolute z-0">{/* <RainbowCursor /> */}</div>
      </div>
    </div>
  );
}
