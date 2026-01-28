import { OrbitalLoader } from "@/components/orbital-loader";
import AssetsList from "@/components/settingDialog/assetsList";
import { selectAssetsManageOpenStatus } from "@/store/assetsManageControl/assetsManage-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAssetsManageLoading,
  setAssetsManageLoading,
} from "@/store/loading/loading-slice";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

export default function AssetsListDialog() {
  const dispatch = useAppDispatch();
  const assetsManageOpenStatus = useAppSelector(selectAssetsManageOpenStatus);
  const mediaLibraryLoading = useAppSelector(selectAssetsManageLoading);
  const assetsManangeContainer = useRef<any>(null);
  const [showAssetsManage, setShowAssetsManage] = useState(false);
  const { contextSafe: assetsManage } = useGSAP(
    () => {
      const tm = gsap.timeline();
      if (assetsManageOpenStatus) {
        dispatch(setAssetsManageLoading({ assetsManageLoading: true }));
        tm.to(assetsManangeContainer.current, {
          x: 0,
          duration: 0.5,
          ease: "linear",
        });
        tm.fromTo(
          assetsManangeContainer.current,
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
          setShowAssetsManage(true);
        });
      } else {
        tm.to(
          assetsManangeContainer.current,
          {
            x: "100%",
            duration: 0.5,
            ease: "linear",
          },
          0
        ).then(() => {
          setShowAssetsManage(false);
        });
        tm.fromTo(
          assetsManangeContainer.current,
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
      scope: assetsManangeContainer,
      dependencies: [assetsManageOpenStatus],
    }
  );
  return (
    <div
      className="fixed inset-0 translate-x-1/1 z-150 overflow-hidden bg-background"
      ref={assetsManangeContainer}
    >
      {mediaLibraryLoading && (
        <div className="inset-0 top-0 z-[var(--maxZIndex)] w-[100dvw] h-[100dvh] [--foreground:white] bg-black flex justify-center items-center">
          <OrbitalLoader />
        </div>
      )}
      {showAssetsManage && (
        <AssetsList editDialogClassname="z-160"></AssetsList>
      )}
    </div>
  );
}
