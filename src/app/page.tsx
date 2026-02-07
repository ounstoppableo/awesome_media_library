"use client";
import { App, ConfigProvider, theme } from "antd";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "@ant-design/v5-patch-for-react-19";
import SienaStyle from "@/components/sienaStyle";
import Taotajima from "@/components/taotajima";
import JiejoeHomePage from "@/components/jiejoeHomePage";
import UniqueLoading from "@/components/morph-loading";
import { OrbitalLoader } from "@/components/orbital-loader";
import {
  selectGlobalLoading,
  selectMediaLibraryLoading,
  selectSienaLoading,
  selectTaotajimaLoading,
  setMediaLibraryLoading,
  setSienaLoading,
  setTaotajimaLoading,
} from "@/store/loading/loading-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { MenuToggleIcon } from "@/components/menu-toggle-icon";
import {
  selectSienaControlOpenStatus,
  setOpen as setSienaOpen,
} from "@/store/sienaControl/sinaControl-slice";
import { useGSAP } from "@gsap/react";

import { MobileIcon } from "@radix-ui/react-icons";
import AssetsList from "@/components/settingDialog/assetsList";
import { selectDarkMode, setDarkMode } from "@/store/darkMode/darkMode-slice";
import ThemeProvider from "@/components/themeProvider";
import { cn } from "@/lib/utils";
import zhCN from "antd/locale/zh_CN";
import {
  selectMediaLibraryOpenStatus,
  setOpen as setMediaLibraryOpen,
} from "@/store/mediaLibraryControl/mediaLibrary-slice";
import MediaLibrary from "@/components/mediaLibrary";
import SienaDialog from "./components/SienaDialog";
import TaotajimaDialog from "./components/TaotajimaDialog";
import MedialibraryDialog from "./components/MediaLibraryDialog";
import Settiing from "./components/Setting";
import {
  selectTaojimaControlOpenStatus,
  setOpen as setTaotajimaOpen,
} from "@/store/taotajimaControl/taotajima-slice";
import AssetsListDialog from "./components/AssetsListDialog";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectGlobalLoading);
  const darkMode = useAppSelector(selectDarkMode);
  const mediaLibraryOpenStatus = useAppSelector(selectMediaLibraryOpenStatus);
  const sienaOpenStatus = useAppSelector(selectSienaControlOpenStatus);
  const taojimaOpenStatus = useAppSelector(selectTaojimaControlOpenStatus);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const token = searchParams.get("token");
    const categoryId = searchParams.get("categoryId");
    if (token) {
      localStorage.setItem("token", token);
      location.href = location.origin;
    }
    if (categoryId) {
      dispatch(setTaotajimaOpen({ id: categoryId, open: true }));
      router.replace(pathname);
    }
  }, []);

  return (
    <ThemeProvider>
      <ConfigProvider
        locale={zhCN}
        theme={{
          algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <App message={{ maxCount: 1 }}>
          {loading && (
            <div className="fixed inset-0 top-0 z-[var(--maxZIndex)] w-[100dvw] h-[100dvh] [--foreground:white] bg-black flex justify-center items-center">
              <OrbitalLoader />
            </div>
          )}
          <button
            onClick={() => {
              dispatch(setSienaOpen({ open: !sienaOpenStatus }));
            }}
            className={cn(
              "transition-all duration-300 hover:bg-white [--stroke:white] hover:[--stroke:black] absolute focus:outline-none top-[6vmin] right-[8vmin] z-120 w-8 h-8 bg-transparent rounded-full flex justify-center items-center cursor-pointer",
            )}
          >
            <MenuToggleIcon
              open={sienaOpenStatus}
              className="size-6"
              duration={500}
            />
          </button>
          <SienaDialog></SienaDialog>
          <TaotajimaDialog></TaotajimaDialog>
          <MedialibraryDialog></MedialibraryDialog>
          <JiejoeHomePage
            hiddenSilkBackground={
              sienaOpenStatus || taojimaOpenStatus || mediaLibraryOpenStatus
            }
            hiddenStarBackground={
              sienaOpenStatus || taojimaOpenStatus || mediaLibraryOpenStatus
            }
          ></JiejoeHomePage>
          <Settiing
            showSetting={!sienaOpenStatus && !taojimaOpenStatus}
          ></Settiing>
          <AssetsListDialog></AssetsListDialog>
          <Toaster position="top-center" duration={1000} />
        </App>
      </ConfigProvider>
    </ThemeProvider>
  );
}
