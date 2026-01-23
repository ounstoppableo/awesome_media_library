import { StackedCircularFooter } from "@/components/ui/stacked-circular-footer";
import { useEffect, useState } from "react";

export default function useFooterLogic() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const footerJsx = mounted && (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="blob">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
          1 0 0 0 0
          0 1 0 0 0
          0 0 1 0 0
          0 0 0 19 -9
        "
              result="blob"
            />
          </filter>
        </defs>
      </svg>
      <div className="relative h-[70vmin]">
        <div
          className=" [--footer-background:#fff] w-full absolute top-1/2 left-0"
          style={{
            filter: 'url("#blob")',
          }}
        >
          {Array(256)
            .fill(0)
            .map((_, index) => (
              <div
                className={`absolute left-[var(--position,50%)] bg-[var(--footer-background)] rounded-full translate-[(-50%,100%)]`}
                key={index}
                style={
                  {
                    "--size": `${10 + Math.random() * 10}vmin`,
                    "--position": `${-10 + Math.random() * 120}%`,
                    "--distance": `${0 + Math.random() * 5}vmin`,
                    "--time": `${2 + Math.random() * 4}s`,
                    "--delay": `${2 * (2 + Math.random() * 4)}s`,
                    animation: `bubble-size var(--time, 4s) ease-in infinite var(--delay, 0s),
                  bubble-move var(--time, 4s) ease-in infinite var(--delay, 0s)`,
                  } as any
                }
              ></div>
            ))}
        </div>
        <div className="absolute bg-white inset-0 top-[30vmin]">
          <StackedCircularFooter />
        </div>
      </div>
    </>
  );
  return { footerJsx };
}
