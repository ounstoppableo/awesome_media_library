import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  defaultColor?: string;
  hoverColor?: string;
  dotPosition?: string;
  border?: boolean;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(
  (
    {
      text = "Button",
      defaultColor = "background",
      hoverColor = "primary",
      dotPosition = "40%",
      border = true,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        style={{
          transformOrigin: "left center",
        }}
        className={cn(
          `group relative w-[12vmin] h-[3vmin] cursor-pointer overflow-hidden rounded-full ${
            border ? "border-2" : ""
          }  p-2 text-center font-semibold`,
          className,
          "bg-" + defaultColor
        )}
        {...props}
      >
        <div className="absolute flex items-center justify-center gap-[8%] inset-0">
          <div
            style={{ "--top": `${dotPosition}` } as any}
            className={`absolute left-[20%] top-[50%] -translate-y-1/2 h-2 w-2 scale-[1] rounded-lg transition-all duration-300 group-hover:h-full group-hover:w-full group-hover:scale-[1.8] ${`group-hover:${
              "bg-" + hoverColor
            } bg-${hoverColor}`} `}
          ></div>
          <div className="h-2 w-2"></div>
          <div
            className={`inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 text-${hoverColor} text-[3vmin]`}
          >
            {text}
          </div>
        </div>
        <div
          className={`absolute inset-0 z-10 flex h-full w-full translate-x-0 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100 text-${defaultColor} text-[3vmin]`}
        >
          <span>{text}</span>
          <ArrowRight className="h-[100%] w-[3vmin]" />
        </div>
      </button>
    );
  }
);

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
