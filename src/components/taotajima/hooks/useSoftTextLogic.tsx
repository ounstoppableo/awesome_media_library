import { AnimatedText3D, pxToWorld, remToWorld } from "@/utils/AnimatedText3D";
import { Engine } from "@/utils/engine";
import getVMinInJs from "@/utils/getVMinInJs";
import { useEffect, useRef } from "react";

export default function useSoftTextLogic(props: any) {
  const { resizeObserverCb, data, contentRef, shareRef, introduceRef } = props;
  const softText = useRef<any>(null);
  const engine = useRef<any>(null);
  const softTextInst = useRef<any>([]);
  const generateSoftText = useRef<any>(() => {});
  const currentSoftTextInst = useRef<any>(null);
  // 文字飘动
  useEffect(() => {
    if (!data || !data.children || data.children.length === 0) return;
    const textGenerate = () => {
      engine.current?.destroy();
      engine.current = new Engine(
        softText.current.offsetWidth,
        softText.current.offsetHeight
      );

      return (generateSoftText.current = (
        pageCountText: string,
        titleText: string,
        contentText: string,
        direction: "next" | "prev" = "next"
      ) => {
        engine.current.clear();
        engine.current.updateSize(
          softText.current.clientWidth,
          softText.current.clientHeight
        );
        const _base = pxToWorld(
          getVMinInJs() * 2,
          engine.current.camera,
          softText.current
        );
        const _sequence = pxToWorld(
          getVMinInJs() * 3,
          engine.current.camera,
          softText.current
        );
        const _title = pxToWorld(
          getVMinInJs() * 5,
          engine.current.camera,
          softText.current
        );

        const contentRect = contentRef.current.getBoundingClientRect();
        const shareRect = shareRef.current.getBoundingClientRect();
        const introduceRect = introduceRef.current.getBoundingClientRect();
        const centerToLeftEdge = pxToWorld(
          contentRect.x,
          engine.current.camera,
          softText.current
        );

        const _gap = getVMinInJs() * 2;
        const centerToTopEdge = pxToWorld(
          (contentRect.height + _gap + shareRect.height) / 2,
          engine.current.camera,
          softText.current
        );
        engine.current.camera.position.x = centerToLeftEdge;
        softTextInst.current.forEach((item: any) => {
          item?.destroy?.();
        });

        const gap = pxToWorld(_gap, engine.current.camera, softText.current);

        const pageCount = new AnimatedText3D(pageCountText, {
          color: "#ffffff",
          size: _sequence,
          basicY: centerToTopEdge,
          lineHeight: _sequence,
          floatX: pxToWorld(
            contentRect.width,
            engine.current.camera,
            softText.current
          ),
        });
        const title = new AnimatedText3D(titleText, {
          color: "#ffffff",
          size: _title,
          basicY: centerToTopEdge - _sequence - gap,
          lineHeight: _title,
          floatX: pxToWorld(
            contentRect.width,
            engine.current.camera,
            softText.current
          ),
        });
        const content = new AnimatedText3D(contentText, {
          color: "#ffffff",
          size: _base,
          xEdge: pxToWorld(
            contentRect.width,
            engine.current.camera,
            softText.current
          ),
          yEdge: pxToWorld(
            introduceRect.height,
            engine.current.camera,
            softText.current
          ),
          floatX: pxToWorld(
            contentRect.width,
            engine.current.camera,
            softText.current
          ),
          lineHeight: _base * 1.8,
          basicY: centerToTopEdge - _sequence - _title - 2 * gap + _base * 0.35,
        });
        softTextInst.current = [pageCount, title, content];
        engine.current.scene.add(pageCount);
        engine.current.scene.add(title);
        engine.current.scene.add(content);
        softText.current.appendChild(engine.current.renderer.domElement);
        engine.current.start();
        const inst = {
          toShow: async (_direction: "next" | "prev") => {
            const enterOffset =
              _direction === "next"
                ? {
                    x: pxToWorld(-100, engine.current.camera, softText.current),
                    y: pxToWorld(100, engine.current.camera, softText.current),
                  }
                : {
                    x: pxToWorld(100, engine.current.camera, softText.current),
                    y: pxToWorld(-100, engine.current.camera, softText.current),
                  };

            const promise = Promise.all([
              pageCount.show(enterOffset),
              title.show(enterOffset),
              content.show(enterOffset),
            ]);

            return promise;
          },
          toHidden: async (_direction: "next" | "prev") => {
            const enterOffset =
              _direction === "next"
                ? {
                    x: pxToWorld(-100, engine.current.camera, softText.current),
                    y: pxToWorld(100, engine.current.camera, softText.current),
                  }
                : {
                    x: pxToWorld(100, engine.current.camera, softText.current),
                    y: pxToWorld(-100, engine.current.camera, softText.current),
                  };
            const promise = Promise.all([
              pageCount.hide(enterOffset),
              title.hide(enterOffset),
              content.hide(enterOffset),
            ]);
            return promise;
          },
        };
        currentSoftTextInst.current = inst;
        return inst;
      });
    };
    const cb = () => {
      textGenerate()(
        `#${(1).toString().padStart(3, "0")}  /  ${data.children[0].tag}`,
        data.children[0].chineseTitle || data.children[0].englishTitle,
        data.children[0].introduce
      ).toShow("next");
    };
    resizeObserverCb.current.push(cb);
    cb();
    return () => {
      engine.current?.destroy();
      resizeObserverCb.current = resizeObserverCb.current.filter(
        (c: any) => c !== cb
      );
    };
  }, [data]);
  return {
    currentSoftTextInst,
    generateSoftText,
    softText,
  };
}
