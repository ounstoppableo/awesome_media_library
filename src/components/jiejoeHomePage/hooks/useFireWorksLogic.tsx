import { FireworksBackground } from "@/components/animate-ui/components/backgrounds/fireworks";
import { Fireworks } from "@fireworks-js/react";
import { useEffect, useRef } from "react";
export default function useFireWorksLogic() {
  const fireworksJsx = (
    <FireworksBackground
      className="absolute inset-0 flex items-center justify-center rounded-xl"
      color={"white"}
      population={1}
    />
  );
  return { fireworksJsx };
}
