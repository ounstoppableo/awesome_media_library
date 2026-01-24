"use client";
import { ConfigProvider, message, theme } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import {
  selectTaojimaControlOpenStatus,
  setOpen as TaotajimaOpen,
} from "@/store/taotajimaControl/taotajima-slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/button-1";
import {
  ArrowUpDown,
  Bell,
  Check,
  Clapperboard,
  FolderKanban,
  Moon,
  Palette,
  Pen,
  Settings,
  ShieldCheck,
  Sun,
  Truck,
} from "lucide-react";
import { MobileIcon } from "@radix-ui/react-icons";
import AssetsList from "@/components/settingDialog/assetsList";
import { setCloseScroll } from "@/store/jiejoeControl/jiejoeControl-slice";
import { selectDarkMode, setDarkMode } from "@/store/darkMode/darkMode-slice";
import ThemeProvider from "@/components/themeProvider";
import { cn } from "@/lib/utils";
import zhCN from "antd/locale/zh_CN";
import {
  selectMediaLibraryOpenStatus,
  setOpen as setMediaLibraryOpen,
} from "@/store/mediaLibrarControl/mediaLibrary-slice";
import MediaLibrary from "@/components/mediaLibrary";

export default function Home() {
  const router = useRouter();
  const loading = useAppSelector(selectGlobalLoading);
  const darkMode = useAppSelector(selectDarkMode);

  const dispatch = useAppDispatch();

  const sienaOpenStatus = useAppSelector(selectSienaControlOpenStatus);
  const sienaContainer = useRef<any>(null);
  const [showSiena, setShowSiena] = useState(false);
  const sienaLoading = useAppSelector(selectSienaLoading);
  const { contextSafe: siena } = useGSAP(
    () => {
      const tm = gsap.timeline();
      if (sienaOpenStatus) {
        dispatch(setSienaLoading({ sienaLoading: true }));
        tm.to(sienaContainer.current, {
          y: 0,
          duration: 0.5,
          ease: "linear",
        });
        tm.fromTo(
          sienaContainer.current,
          {
            borderTopLeftRadius: "20vmin",
            borderTopRightRadius: "20vmin",
          },
          {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            duration: 0.5,
            ease: "linear",
          }
        );
        tm.play().then(() => {
          setShowSiena(true);
        });
      } else {
        tm.to(
          sienaContainer.current,
          {
            y: "100%",
            duration: 0.5,
            ease: "linear",
          },
          0
        ).then(() => {
          setShowSiena(false);
        });
        tm.fromTo(
          sienaContainer.current,
          {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          },
          {
            borderTopLeftRadius: "20vmin",
            borderTopRightRadius: "20vmin",
            duration: 0.1,
            ease: "linear",
          },
          0
        );
      }
    },
    {
      scope: sienaContainer,
      dependencies: [sienaOpenStatus],
    }
  );

  const taojimaOpenStatus = useAppSelector(selectTaojimaControlOpenStatus);
  const taojimaLoading = useAppSelector(selectTaotajimaLoading);
  const taojimaContainer = useRef<any>(null);
  const [showTaojima, setShowTaojima] = useState(false);
  const { contextSafe: taojima } = useGSAP(
    () => {
      const tm = gsap.timeline();
      if (taojimaOpenStatus) {
        dispatch(setTaotajimaLoading({ taotajimaLoading: true }));
        tm.to(taojimaContainer.current, {
          x: 0,
          duration: 0.5,
          ease: "linear",
        });
        tm.fromTo(
          taojimaContainer.current,
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
          setShowTaojima(true);
        });
      } else {
        tm.to(
          taojimaContainer.current,
          {
            x: "100%",
            duration: 0.5,
            ease: "linear",
          },
          0
        ).then(() => {
          setShowTaojima(false);
        });
        tm.fromTo(
          taojimaContainer.current,
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
      scope: taojimaContainer,
      dependencies: [taojimaOpenStatus],
    }
  );

  const mediaLibraruOpenStatus = useAppSelector(selectMediaLibraryOpenStatus);
  const mediaLibraryLoading = useAppSelector(selectMediaLibraryLoading);
  const mediaLibraryContainer = useRef<any>(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const { contextSafe: mediaLibrary } = useGSAP(
    () => {
      const tm = gsap.timeline();
      if (mediaLibraruOpenStatus) {
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
      dependencies: [mediaLibraruOpenStatus],
    }
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <ThemeProvider>
      <ConfigProvider
        locale={zhCN}
        theme={{
          algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
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
            "transition-all duration-300 hover:bg-white [--stroke:white] hover:[--stroke:black] absolute focus:outline-none top-[6vmin] right-[8vmin] z-120 w-8 h-8 bg-transparent rounded-full flex justify-center items-center cursor-pointer"
          )}
        >
          <MenuToggleIcon
            open={sienaOpenStatus}
            className="size-6"
            duration={500}
          />
        </button>
        <div
          className="fixed inset-0 translate-y-1/1 z-100 overflow-hidden"
          ref={sienaContainer}
        >
          {sienaLoading && (
            <div className="inset-0 top-0 z-[var(--maxZIndex)] w-[100dvw] h-[100dvh] [--foreground:white] bg-black flex justify-center items-center">
              <OrbitalLoader />
            </div>
          )}
          {showSiena && <SienaStyle></SienaStyle>}
        </div>
        <div
          className="fixed inset-0 translate-x-1/1 z-140 overflow-hidden"
          ref={taojimaContainer}
        >
          {taojimaLoading && (
            <div className="inset-0 top-0 z-[var(--maxZIndex)] w-[100dvw] h-[100dvh] [--foreground:white] bg-black flex justify-center items-center">
              <OrbitalLoader />
            </div>
          )}
          {showTaojima && <Taotajima></Taotajima>}
        </div>
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
        <JiejoeHomePage></JiejoeHomePage>
        <div className="fixed bottom-[6vmin] right-[6vmin] z-150">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Settings className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 z-150">
              <DropdownMenuItem
                onClick={() => {
                  setDialogOpen(true);
                  dispatch(TaotajimaOpen({ open: false, id: "" }));
                  dispatch(setCloseScroll({ closeScroll: true }));
                }}
                className="flex items-center gap-2 rounded-lg py-2 px-2 hover:bg-background/50"
              >
                <FolderKanban className="w-4 h-4" />
                资产管理
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  dispatch(
                    setMediaLibraryOpen({ open: !mediaLibraruOpenStatus })
                  );
                  dispatch(
                    setCloseScroll({ closeScroll: !mediaLibraruOpenStatus })
                  );
                }}
                className="flex items-center gap-2 rounded-lg py-2 px-2 hover:bg-background/50"
              >
                <Clapperboard className="w-4 h-4" />
                媒体库
                <div className="flex-1"></div>
                {mediaLibraruOpenStatus ? (
                  <Check className="h-4 w-4"></Check>
                ) : (
                  <></>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center gap-2 rounded-lg py-2 px-2 hover:bg-background/50">
                  <Palette className="w-4 h-4" />
                  <span className="flex-1">主题管理</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-44 rounded-lg border shadow-sm p-1 z-[var(--maxZIndex)]">
                    <DropdownMenuRadioGroup value="light">
                      <DropdownMenuRadioItem
                        value="light"
                        className="flex items-center gap-2 py-1 px-2 rounded"
                        onClick={() => {
                          dispatch(setDarkMode({ darkMode: false }));
                        }}
                      >
                        <Sun className="w-4 h-4" />
                        <span className="flex-1">亮色模式</span>
                        {darkMode ? <></> : <Check className="h-4 w-4"></Check>}
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="dark"
                        className="flex items-center gap-2 py-1 px-2 rounded"
                        onClick={() => {
                          dispatch(setDarkMode({ darkMode: true }));
                        }}
                      >
                        <Moon className="w-4 h-4" />
                        <span className="flex-1">暗黑模式</span>
                        {darkMode ? <Check className="h-4 w-4"></Check> : <></>}
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <AssetsList
          open={dialogOpen}
          handleOpenChange={(value: boolean) => {
            setDialogOpen(value);
            dispatch(setCloseScroll({ closeScroll: false }));
          }}
          className={"z-160"}
        ></AssetsList>
      </ConfigProvider>
    </ThemeProvider>
  );
}
