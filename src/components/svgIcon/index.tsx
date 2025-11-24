import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type SvgIconProps = {
  path: string;
  className?: string;
};
export default function SvgIcon(props: SvgIconProps) {
  const [svgString, setSvgString] = useState("");
  useEffect(() => {
    fetch(props.path).then(async (res) => {
      setSvgString(await res.text());
    });
  }, [props.path]);
  return (
    <div
      className={cn(
        "w-4 h-4 flex justify-center items-center text-yellow-600",
        props.className
      )}
      dangerouslySetInnerHTML={{ __html: svgString }}
    ></div>
  );
}
