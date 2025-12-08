import React from "react";
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
        className={cn(
          `group relative w-32 cursor-pointer overflow-hidden rounded-full ${
            border ? "border" : ""
          }  p-2 text-center font-semibold`,
          className,
          "bg-" + defaultColor
        )}
        {...props}
      >
        <span
          className={`inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 text-${hoverColor}`}
        >
          {text}
        </span>
        <div
          className={`absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100 text-${defaultColor}`}
        >
          <span>{text}</span>
          <ArrowRight />
        </div>
        <div
          className={`absolute left-[20%] top-[${dotPosition}] h-2 w-2 scale-[1] rounded-lg transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] ${`group-hover:${
            "bg-" + hoverColor
          } bg-${hoverColor}`}`}
        ></div>
      </button>
    );
  }
);

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
