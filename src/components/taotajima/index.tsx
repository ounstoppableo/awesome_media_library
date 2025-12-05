"use client";
import { useEffect, useRef, useState } from "react";

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
  useEffect(() => {
    const sketch = new (window as any).Sketch({
      contentId: "taotajimaSliderContent",
      sliderId: "taotajimaSlider",
      duration: 1,
      debug: false,
      easing: "easeOut",
      uniforms: {},
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
              float proj = dot(vUv - 0.5, dir) + 0.5;
              float intpl = pow(abs(smoothstep(0., 1., (prog*2. - proj + 0.5))), 10.);
              
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

  return (
    <>
      <div id="taotajimaSliderContent" className="w-[100dvw] h-[100dvh]">
        <div
          className="w-full h-full"
          id="taotajimaSlider"
          data-images='["/Magic.jpg","/img21.jpg","/img33.jpg"]'
        ></div>
      </div>
    </>
  );
}
