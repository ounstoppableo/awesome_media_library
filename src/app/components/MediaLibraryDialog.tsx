import MediaLibrary from "@/components/mediaLibrary";
import { OrbitalLoader } from "@/components/orbital-loader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectMediaLibraryLoading,
  setMediaLibraryLoading,
} from "@/store/loading/loading-slice";
import { selectMediaLibraryOpenStatus } from "@/store/mediaLibraryControl/mediaLibrary-slice";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

export default function MedialibraryDialog() {
  const dispatch = useAppDispatch();
  const mediaLibraryOpenStatus = useAppSelector(selectMediaLibraryOpenStatus);
  const mediaLibraryLoading = useAppSelector(selectMediaLibraryLoading);
  const mediaLibraryContainer = useRef<any>(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const { contextSafe: mediaLibrary } = useGSAP(
    () => {
      const tm = gsap.timeline();
      if (mediaLibraryOpenStatus) {
        dispatch(setMediaLibraryLoading({ mediaLibraryLoading: true }));
        tm.to(mediaLibraryContainer.current, {
          x: 0,
          duration: 0.5,
          ease: "linear",
        });
        tm.fromTo(
          mediaLibraryContainer.current,
          {
            borderTopLeftRadius: "20vmin",
            borderBottomLeftRadius: "20vmin",
          },
          {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            duration: 0.5,
            ease: "linear",
          }
        );
        tm.play().then(() => {
          setShowMediaLibrary(true);
        });
      } else {
        tm.to(
          mediaLibraryContainer.current,
          {
            x: "100%",
            duration: 0.5,
            ease: "linear",
          },
          0
        ).then(() => {
          setShowMediaLibrary(false);
        });
        tm.fromTo(
          mediaLibraryContainer.current,
          {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
          {
            borderTopLeftRadius: "20vmin",
            borderBottomLeftRadius: "20vmin",
            duration: 0.1,
            ease: "linear",
          },
          0
        );
      }
    },
    {
      scope: mediaLibraryContainer,
      dependencies: [mediaLibraryOpenStatus],
    }
  );
  return (
    <div
      className="fixed inset-0 translate-x-1/1 z-150 overflow-hidden bg-background"
      ref={mediaLibraryContainer}
    >
      {mediaLibraryLoading && (
        <div className="inset-0 top-0 z-[var(--maxZIndex)] w-[100dvw] h-[100dvh] [--foreground:white] bg-black flex justify-center items-center">
          <OrbitalLoader />
        </div>
      )}
      {showMediaLibrary && <MediaLibrary></MediaLibrary>}
    </div>
  );
}
