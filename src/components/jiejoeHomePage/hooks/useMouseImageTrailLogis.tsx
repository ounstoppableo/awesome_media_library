import ContentInsufficient from "@/components/contentInsufficient";
import MouseImageTrail from "@/components/mouseImageTrail";
import { cn } from "@/lib/utils";
import { CategoryItem } from "@/types/media";
import gsap from "gsap";
import { use, useEffect, useRef, useState } from "react";
import { FiMousePointer } from "react-icons/fi";

export default function useMouseImageTrailLogis(props: any) {
  const { data, resizeObserverCb } = props;
  const runRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  useEffect(() => {
    let _tm: any = null;
    const cb = () => {
      _tm?.kill();
      if (!runRef.current) return;
      if (!pathRef.current) return;
      _tm = gsap.timeline({ repeat: -1 });
      const runRect = runRef.current.getBoundingClientRect();
      const pathRect = pathRef.current.getBoundingClientRect();
      const baseDuration = 5;
      const runAspect = runRect.width / runRect.height;
      _tm.set(runRef.current, {
        rotate: 0,
        x: 0,
        y: -runRect.height,
        transformOrigin: "top left",
      });
      _tm.to(runRef.current, {
        x: pathRect.width,
        duration: baseDuration,
        ease: "linear",
      });
      _tm.to(runRef.current, {
        rotate: 90,
        x: pathRect.width + runRect.height,
        ease: "power1.out",
        duration: 0.3,
      });
      _tm.to(
        runRef.current,
        {
          y: pathRect.height,
          duration: baseDuration / runAspect,
          ease: "linear",
        },
        "<"
      );
      _tm.to(runRef.current, {
        rotate: 180,
        y: pathRect.height + runRect.height,
        ease: "power1.out",
        duration: 0.3,
      });
      _tm.to(
        runRef.current,
        {
          x: 0,
          duration: baseDuration,
          ease: "linear",
        },
        "<"
      );
      _tm.to(runRef.current, {
        rotate: 270,
        x: -runRect.height,
        ease: "power1.out",
        duration: 0.3,
      });
      _tm.to(
        runRef.current,
        {
          y: 0,
          duration: baseDuration / runAspect,
          ease: "linear",
        },
        "<"
      );
      _tm.to(runRef.current, {
        x: 0,
        y: -runRect.height,
        rotate: 360,
        ease: "power1.out",
        duration: 0.3,
      });
    };
    cb();
    resizeObserverCb.current.push(cb);
    return () => {
      _tm?.kill();
      resizeObserverCb.current = resizeObserverCb.current.filter(
        (c: any) => c !== cb
      );
    };
  }, []);
  const borderRef = useRef<HTMLDivElement>(null);
  const mouseImageTrailJsx =
    !data[currentIndex] ||
    !data[currentIndex].children ||
    data[currentIndex].children.length < 3 ? (
      <div className="w-full h-full flex justify-center items-center">
        <ContentInsufficient count={3}></ContentInsufficient>
      </div>
    ) : (
      <div
        className="w-full h-full relative"
        style={
          {
            "--electric-border-color": "var(--themeColor)",
            "--electric-light-color":
              "oklch(from var(--electric-border-color) l c h)",
            "--gradient-color": `oklch(
          from var(--electric-border-color) 0.3 calc(c / 2) h / 0.4
        )`,
            "--color-neutral-900": "oklch(0.185 0 0)",
          } as any
        }
      >
        {/* <svg className="absolute">
          <defs>
            <filter
              id="turbulent-displace"
              colorInterpolationFilters="sRGB"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feTurbulence
                type="turbulence"
                baseFrequency="0.02"
                numOctaves="10"
                result="noise1"
                seed="1"
              />
              <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
                <animate
                  attributeName="dy"
                  values="700; 0"
                  dur="12s"
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              </feOffset>

              <feTurbulence
                type="turbulence"
                baseFrequency="0.02"
                numOctaves="10"
                result="noise2"
                seed="1"
              />
              <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
                <animate
                  attributeName="dy"
                  values="0; -700"
                  dur="12s"
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              </feOffset>

              <feTurbulence
                type="turbulence"
                baseFrequency="0.02"
                numOctaves="10"
                result="noise1"
                seed="2"
              />
              <feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
                <animate
                  attributeName="dx"
                  values="490; 0"
                  dur="12s"
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              </feOffset>

              <feTurbulence
                type="turbulence"
                baseFrequency="0.02"
                numOctaves="10"
                result="noise2"
                seed="2"
              />
              <feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
                <animate
                  attributeName="dx"
                  values="0; -490"
                  dur="12s"
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              </feOffset>

              <feComposite
                in="offsetNoise1"
                in2="offsetNoise2"
                result="part1"
              />
              <feComposite
                in="offsetNoise3"
                in2="offsetNoise4"
                result="part2"
              />
              <feBlend
                in="part1"
                in2="part2"
                mode="color-dodge"
                result="combinedNoise"
              />

              <feDisplacementMap
                in="SourceGraphic"
                in2="combinedNoise"
                scale="30"
                xChannelSelector="R"
                yChannelSelector="B"
              />
            </filter>
          </defs>
        </svg> */}
        <div className="w-full h-full relative z-10" ref={pathRef}>
          {/* <div className="absolute top-0 left-0 w-[12vmin] h-fit" ref={runRef}>
            <img src={"/run_pika.gif"} className="object-contain w-full"></img>
          </div> */}
          <div className="w-full h-full rounded-2xl overflow-hidden">
            <MouseImageTrail
              renderImageBuffer={50}
              rotationRange={25}
              images={
                data[currentIndex]?.children?.map((item: CategoryItem) =>
                  item.type === "video" ? item.thumbnail : item.sourcePath
                ) || []
              }
            >
              <section className="grid h-full w-full place-content-center bg-black">
                <p className="flex items-center gap-2 text-3xl font-bold uppercase text-white">
                  <FiMousePointer />
                  <span>Hover me</span>
                </p>
              </section>
            </MouseImageTrail>
          </div>
        </div>
        {/* <div className="absolute top-1/2 left-1/2 -translate-1/2 w-[calc(4px_+_calc(100%_-_16vmin))] h-[calc(4px_+_calc(100%_-_16vmin))] z-20 pointer-events-none">
          <div className="border-2 border-[var(--electric-border-color)] rounded-2xl w-full h-full">
            <div className="w-full h-full rounded-2xl border-2 border-[var(--electric-border-color)] filter-[url(#turbulent-displace)] mt-[-4px] ml-[-4px]"></div>
          </div>
          <div className="w-full h-full rounded-2xl absolute inset-0 blur-[1px] border-2 border-[var(--gradient-color)]"></div>
          <div className="w-full h-full rounded-2xl absolute inset-0 blur-[4px] border-2 border-[var(--electric-light-color)]"></div>
        </div> */}
      </div>
    );
  return { mouseImageTrailJsx, setCurrentIndex };
}
