"use client";
import React, { Ref, RefObject, useEffect, useRef, useState } from "react";
import { Instagram, Play, Twitter, X } from "lucide-react";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { splitText, animate as animejsAnimate, stagger } from "animejs";

/**
 * 操作量：图片尺寸、canvas尺寸(坐标轴尺度)、缩放比例
 * 一般来说，图片按照原始尺寸映射到canvas坐标轴上，比如说500x500的图片，映射到300x300的canvas上，将会超出
 * 但如果canvas尺寸为500x500，那么则可以正好填满
 *
 * 但是假设我们就是想将500x500的图片正好铺满300x300的canvas，应该怎么做?
 * 只需要设置ctx.drawImage(image,x,y,swidth,sheight)的swidth和sheight即可，其含义为将图片尺寸伸缩至swidth和sheight
 * 比如ctx.drawImage(image,0,0,300,300),假设图片原始宽高为500x500,那么绘制到canvas上将占300x300的位置,但是图片能够完全展示,由于尺寸明显变小,所以图片被压缩了,伸长同理
 *
 * 到这里我们其实可以知道,原始图片尺寸与canvas尺寸是一一对应的,也就是1单位的图片像素等于1单位的canvas坐标点,而通过调节swidth和sheight可以控制图片像素与canvas尺寸的关系
 * 其像素比(每canvas单位对应多少图片像素)将为: 图片尺寸 / s[width|height]
 */

export default function Taotajima() {
  const leftBtnRef = useRef<HTMLDivElement>(null);
  const rightBtnRef = useRef<HTMLDivElement>(null);
  const backBtnRef = useRef<HTMLDivElement>(null);
  const twitterBtnRef = useRef<any>(null);
  const instagramBtnRef = useRef<any>(null);

  useEffect(() => {
    const sketch = new (window as any).Sketch({
      contentId: "taotajimaSliderContent",
      sliderId: "taotajimaSlider",
      duration: 0.8,
      debug: false,
      easing: "easeOut",
      uniforms: {},
      // displacement: "/3d/disp1.jpg",
      fragment: `
            uniform float time;
            uniform float progress;
            uniform float width;
            uniform float scaleX;
            uniform float scaleY;
            uniform float transition;
            uniform float radius;
            uniform float swipe;
            uniform sampler2D texture1;
            uniform sampler2D texture2;
            uniform sampler2D displacement;
            uniform vec4 resolution;
            uniform float angle;
            uniform float direction;
    
            varying vec2 vUv;
            varying vec4 vPosition;
            vec2 mirrored(vec2 v) {
                vec2 m = mod(v,2.);
                return mix(m,2.0 - m, step(1.0 ,m));
            }
    
            void main()	{
              vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
              vec4 noise = texture2D(displacement, mirrored(newUV+time*0.04));
              // float prog = 0.6*progress + 0.2 + noise.g * 0.06;
              float prog = progress*0.8 -0.05 + noise.g * 0.06;

              // 控制噪音角度
              vec2 dir = vec2(cos(angle), sin(angle));
              float proj = dot(vUv - 0.5, dir);
              proj = (proj + 0.70710678) * 0.70710678;
              float intpl = pow(abs(smoothstep(0., 1., (prog * 2.0 + direction * (proj - 0.5)))), 10.);
              
              vec4 t1 = texture2D( texture1, (newUV - 0.5) * (1.0 - intpl) + 0.5 ) ;
              vec4 t2 = texture2D( texture2, (newUV - 0.5) * intpl + 0.5 );
              gl_FragColor = mix( t1, t2, intpl );
    
            }
    
        `,
      eventRigisters: [
        {
          event: "wheel",
          cb: (e: any, prev: any, next: any) => {
            if (e.deltaY > 0) {
              prev();
            } else {
              next();
            }
          },
        },
      ],
      noiseAngle: Math.PI * 0.75,
    });
    const clears = sketch.eventRigister();

    return () => {
      clears.forEach((clear: any) => clear());
    };
  }, []);

  const animeObj = useRef<any>({});
  const animatePageToggleBtn = (
    container: RefObject<HTMLDivElement | null>,
    direction: "left" | "right",
    animate: "enter" | "leave"
  ) => {
    if (!container.current) return;
    const arrow = container.current.querySelector<SVGElement>(".arrow")!;
    const title = container.current.querySelector<HTMLDivElement>(".title")!;
    const pageCount =
      container.current.querySelector<HTMLDivElement>(".pageCount")!;

    if (direction === "left") {
      if (animate === "leave") {
      } else {
        gsap.fromTo(
          arrow,
          {
            scaleX: 0,
          },
          {
            scaleX: 1,
            duration: 0.3,
            ease: "linear",
          }
        );
      }
    } else {
      if (animate === "leave") {
      } else {
        gsap.fromTo(
          arrow,
          {
            scaleX: 0,
          },
          {
            scaleX: 1,
            duration: 0.3,
            ease: "linear",
          }
        );
      }
    }
    if (animate === "leave") {
      animeObj.current.titleChars?.revert?.();
      animeObj.current.pageCountChars?.revert?.();
    } else {
      title &&
        (animeObj.current.titleChars = splitText(title, {
          chars: { class: "page-btn-title-split-char" },
        }));
      pageCount &&
        (animeObj.current.pageCountChars = splitText(pageCount, {
          chars: { class: "page-btn-pageCount-split-char" },
        }));
      animejsAnimate(".page-btn-title-split-char", {
        y: ["0rem", "-.5rem", "0rem"],
        duration: 300,
        delay: stagger(30),
      });
      animejsAnimate(".page-btn-pageCount-split-char", {
        y: ["0rem", "-.5rem", "0rem"],
        duration: 300,
        delay: stagger(30),
      });
    }
  };

  const animateBtn = (btnRef: RefObject<any>) => {
    if (!btnRef.current) return;
    if (animeObj.current.btnTwine) return;
    animeObj.current.btnTwine = gsap
      .fromTo(
        btnRef.current,
        { scale: 0.5 },
        { scale: 1, ease: "power2.inOut", duration: 0.3 }
      )
      .then(() => {
        animeObj.current.btnTwine = null;
      });
  };

  return (
    <>
      <div
        id="taotajimaSliderContent"
        className="w-[100dvw] h-[100dvh] relative"
      >
        <div
          className="w-full h-full relative after:absolute after:inset-0 after:bg-black/40"
          id="taotajimaSlider"
          data-images='["/Magic.jpg","/img21.jpg","/img33.jpg"]'
        ></div>
        <div className="absolute inset-0 flex justify-center items-center flex-col p-16 pt-8 cursor-default">
          <div className="flex text-xl text-white justify-between w-full">
            <div
              ref={backBtnRef}
              className="cursor-pointer flex gap-2"
              onMouseEnter={animatePageToggleBtn.bind(
                null,
                backBtnRef,
                "left",
                "enter"
              )}
              onMouseLeave={animatePageToggleBtn.bind(
                null,
                backBtnRef,
                "left",
                "leave"
              )}
            >
              <svg
                viewBox="0 0 35 7"
                className="w-12 fill-white arrow origin-right"
              >
                <polyline points="360,7 0,7 21,0 21,6 360,6"></polyline>
              </svg>
              <div className="text-end title">BACK</div>
            </div>
            <div className="flex text-2xl gap-4 h-fit">
              <div className="select-none">Blog</div>
              <div className="w-[1px] h-9 bg-white/80 rotate-20"></div>
              <div className="cursor-pointer relative after:bottom-0 after:left-0 after:absolute after:border-b-2 after:border-white hover:after:w-full after:transition-all after:w-0">
                Unstoppable840
              </div>
            </div>
          </div>
          <div className="flex-1"></div>
          <div className="relative flex gap-8 items-center max-w-[50dvw]">
            <div className=" text-white gap-4 flex flex-col items-start">
              <div className="flex text-2xl gap-4 h-fit">
                <div>#010</div>
                <div className="w-[1px] h-9 bg-white/80 rotate-20"></div>
                <div className="">taotajima</div>
              </div>
              <div className="text-6xl">MTV ULTRAHITS</div>
              <div className="line-clamp-4 leading-8">
                Planned and produced a short video that was exhibited in NHK
                (Japan Broadcasting Corporation)'s TECHNE. This experimental
                video captures nothing but the movements of the line of sight of
                living creatures. It explored the idea that each individual
                creature's characteristic might remain, even in a video with
                just these movements and sound effects.
              </div>
              <div className="text-xl flex gap-4 items-center">
                <div>Share:</div>
                <div className="flex gap-4">
                  <Twitter
                    ref={twitterBtnRef}
                    onMouseEnter={animateBtn.bind(null, twitterBtnRef)}
                    className="cursor-pointer"
                  />
                  <Instagram
                    ref={instagramBtnRef}
                    onMouseEnter={animateBtn.bind(null, instagramBtnRef)}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div className="dark">
              <InteractiveHoverButton
                className="text-xl w-40 aspect-1/1 z-20 opacity-80"
                text="play"
                defaultColor="white"
                border={false}
                hoverColor="black"
                dotPosition={"50%"}
              />
            </div>
          </div>
          <div className="flex-1"></div>
          <div className="relative text-white text-xl flex gap-[10dvw] max-w-[50dvw]">
            <div
              className="relative flex flex-col items-end w-[20dvw] cursor-pointer"
              ref={leftBtnRef}
              onMouseEnter={animatePageToggleBtn.bind(
                null,
                leftBtnRef,
                "left",
                "enter"
              )}
              onMouseLeave={animatePageToggleBtn.bind(
                null,
                leftBtnRef,
                "left",
                "leave"
              )}
            >
              <div className="pageCount">#009</div>
              <div className="truncate w-[80%] title text-right">
                Xperia Ear Open-style Concept
              </div>
              <svg
                viewBox="0 0 360 7"
                className="fill-white absolute bottom-2 arrow origin-right"
              >
                <polyline points="360,7 0,7 21,0 21,6 360,6"></polyline>
              </svg>
            </div>
            <div
              className="relative flex flex-col items-start w-[20dvw] cursor-pointer"
              ref={rightBtnRef}
              onMouseEnter={animatePageToggleBtn.bind(
                null,
                rightBtnRef,
                "right",
                "enter"
              )}
              onMouseLeave={animatePageToggleBtn.bind(
                null,
                rightBtnRef,
                "right",
                "leave"
              )}
            >
              <div className="pageCount">#011</div>
              <div className="truncate w-[80%] title">TECHNE</div>
              <svg
                viewBox="0 0 360 7"
                className="fill-white absolute bottom-2 arrow origin-left"
              >
                <polyline points="0,7 360,7 339,0 339,6 0,6"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
