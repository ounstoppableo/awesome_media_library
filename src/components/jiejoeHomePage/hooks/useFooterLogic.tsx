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
      <div className="relative min-h-120">
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
                    "--size": `${2 + Math.random() * 6}rem`,
                    "--position": `${-10 + Math.random() * 110}%`,
                    "--distance": `${0 + Math.random() * 6}rem`,
                    "--time": `${2 + Math.random() * 2}s`,
                    "--delay": `${-1 * (2 + Math.random() * 2)}s`,
                    animation: `bubble-size var(--time, 4s) ease-in infinite var(--delay, 0s),
                  bubble-move var(--time, 4s) ease-in infinite var(--delay, 0s)`,
                  } as any
                }
              ></div>
            ))}
        </div>
        <div className="absolute bg-white inset-0 top-1/2"></div>
      </div>
    </>
  );
  return { footerJsx };
}
