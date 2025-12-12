import { AnimatedText3D, pxToWorld, remToWorld } from "@/utils/AnimatedText3D";
import { Engine } from "@/utils/engine";
import { useEffect, useRef } from "react";

export default function useSoftTextLogic(props: any) {
  const { resizeObserverCb, data } = props;
  const softText = useRef<any>(null);
  const engine = useRef<any>(null);
  const softTextInst = useRef<any>([]);
  const generateSoftText = useRef<any>(() => {});
  const currentSoftTextInst = useRef<any>(null);
  // 文字飘动
  useEffect(() => {
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
        const _base = remToWorld(1, engine.current.camera, softText.current);
        const _xl = remToWorld(1.25, engine.current.camera, softText.current);
        const _6xl = remToWorld(3.75, engine.current.camera, softText.current);

        const centerToLeftEdge = pxToWorld(
          softText.current.offsetWidth / 2,
          engine.current.camera,
          softText.current
        );
        const centerToTopEdge = pxToWorld(
          softText.current.offsetHeight / 2,
          engine.current.camera,
          softText.current
        );
        engine.current.camera.position.x = centerToLeftEdge;
        softTextInst.current.forEach((item: any) => {
          item?.destroy?.();
        });

        const gap = remToWorld(1, engine.current.camera, softText.current);
        const pageCountY = _xl + _xl / 2;
        const titleY = pageCountY + _6xl + _6xl / 2 + gap;
        const enterOffset =
          direction === "next"
            ? {
                x: pxToWorld(-100, engine.current.camera, softText.current),
                y: pxToWorld(100, engine.current.camera, softText.current),
              }
            : {
                x: pxToWorld(100, engine.current.camera, softText.current),
                y: pxToWorld(-100, engine.current.camera, softText.current),
              };
        const pageCount = new AnimatedText3D(pageCountText, {
          color: "#ffffff",
          size: _xl,
          basicY: centerToTopEdge - pageCountY,
          enterOffset,
        });
        const title = new AnimatedText3D(titleText, {
          color: "#ffffff",
          size: _6xl,
          basicY: centerToTopEdge - titleY,
          enterOffset,
        });
        const content = new AnimatedText3D(contentText, {
          color: "#ffffff",
          size: _base,
          xEdge: pxToWorld(
            softText.current.offsetWidth,
            engine.current.camera,
            softText.current
          ),
          yEdge:
            pxToWorld(
              softText.current.offsetHeight,
              engine.current.camera,
              softText.current
            ) -
            titleY -
            _base * 2.5 -
            gap,
          lineHeight: _base * 2.5,
          basicY: centerToTopEdge - titleY - _base * 2.5 - gap,
          enterOffset,
        });
        softTextInst.current = [pageCount, title, content];
        engine.current.scene.add(pageCount);
        engine.current.scene.add(title);
        engine.current.scene.add(content);
        softText.current.appendChild(engine.current.renderer.domElement);
        engine.current.start();
        const inst = {
          toShow: (_direction: "next" | "prev") => {
            return Promise.all([
              pageCount.show(),
              title.show(),
              content.show(),
            ]);
          },
          toHidden: (_direction: "next" | "prev") => {
            let enterOffset;
            if (_direction !== direction) {
              enterOffset =
                _direction === "next"
                  ? {
                      x: pxToWorld(
                        -100,
                        engine.current.camera,
                        softText.current
                      ),
                      y: pxToWorld(
                        100,
                        engine.current.camera,
                        softText.current
                      ),
                    }
                  : {
                      x: pxToWorld(
                        100,
                        engine.current.camera,
                        softText.current
                      ),
                      y: pxToWorld(
                        -100,
                        engine.current.camera,
                        softText.current
                      ),
                    };
            }
            return Promise.all([
              pageCount.hide(enterOffset),
              title.hide(enterOffset),
              content.hide(enterOffset),
            ]);
          },
        };
        currentSoftTextInst.current = inst;
        return inst;
      });
    };
    const cb = () => {
      textGenerate()(
        `#${(1).toString().padStart(3, "0")}      ${"Tag Tag Tag"}`,
        data.children[0].title,
        data.children[0].content
      ).toShow("next");
    };
    resizeObserverCb.current.push(cb);

    return () => {
      resizeObserverCb.current = resizeObserverCb.current.filter(
        (c: any) => c !== cb
      );
    };
  }, []);
  return {
    currentSoftTextInst,
    generateSoftText,
    softText,
  };
}
