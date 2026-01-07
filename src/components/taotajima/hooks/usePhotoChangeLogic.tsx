import { useEffect, useRef } from "react";

export default function usePhotoChangeLogic(props: any) {
  const { nextCb, prevCb, clearCb, data, togglePageControl } = props;
  const sketch = useRef<any>(null);

  // 照片翻页
  useEffect(() => {
    sketch.current = new (window as any).Sketch({
      contentId: "taotajimaSliderContent",
      sliderId: "taotajimaSlider",
      duration: 0.8,
      debug: false,
      easing: "easeOut",
      uniforms: {},
      displacement: "/3d/disp1.jpg",
      images: data.children.map((item: any) => item.img),
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
              float prog = progress*0.8 - 0.05 + noise.g * 0.06;

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
          cb: async (e: any, prev: any, next: any) => {
            if (e.deltaY < 0) {
              if (togglePageControl.current) return;
              clearCb?.("prev");
              togglePageControl.current = prev();
              togglePageControl.current.then(async (current: number) => {
                await prevCb?.(current);
                togglePageControl.current = null;
              });
            } else {
              if (togglePageControl.current) return;
              clearCb?.("next");
              togglePageControl.current = next();
              togglePageControl.current.then(async (current: number) => {
                await nextCb?.(current);
                togglePageControl.current = null;
              });
            }
          },
        },
      ],
      noiseAngle: Math.PI * 0.75,
    });

    return () => {
      sketch.current.destroy();
    };
  }, []);
  return { sketch };
}
