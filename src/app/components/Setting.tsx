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
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setOpen as setTaotajimaOpen } from "@/store/taotajimaControl/taotajima-slice";
import {
  selectMediaLibraryOpenStatus,
  setOpen as setMediaLibraryOpen,
} from "@/store/mediaLibraryControl/mediaLibrary-slice";
import { selectDarkMode, setDarkMode } from "@/store/darkMode/darkMode-slice";
import { AnimatePresence, motion } from "motion/react";
import { initMessageTool as fetchInitMessageTool } from "@/utils/fetch";
import { initMessageTool as wsInitMessageTool } from "@/utils/clientWsMethod";
import { App } from "antd";
import {
  selectAssetsManageOpenStatus,
  setOpen as setAssetsManangeOpen,
} from "@/store/assetsManageControl/assetsManage-slice";
import gsap from "gsap";

export default function Settiing(props: any) {
  const { showSetting } = props;
  const dispatch = useAppDispatch();
  const mediaLibraryOpenStatus = useAppSelector(selectMediaLibraryOpenStatus);
  const assetsManageOpenStatus = useAppSelector(selectAssetsManageOpenStatus);
  const darkMode = useAppSelector(selectDarkMode);
  const { message } = App.useApp();
  useEffect(() => {
    fetchInitMessageTool(message);
    wsInitMessageTool(message);
  }, []);

  // 移动逻辑
  const [open, setOpen] = useState(false);
  const [moveFlag, setMoveFlag] = useState(false);
  const menuContainerRef = useRef(null);
  const triggerBtnRef = useRef<any>(null);
  const triggerBtnRect = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const xTo = useRef<any>(() => {});
  const yTo = useRef<any>(() => {});
  useEffect(() => {
    if (showSetting) {
      triggerBtnRect.current = triggerBtnRef.current.getBoundingClientRect();
      gsap.set(menuContainerRef.current, {
        x:
          innerWidth -
          Math.min(innerHeight, innerWidth) * 0.06 -
          triggerBtnRect.current.width,
        y:
          innerHeight -
          Math.min(innerHeight, innerWidth) * 0.06 -
          triggerBtnRect.current.width,
      });
      xTo.current = gsap.quickTo(menuContainerRef.current, "x", {
        duration: 0.1,
      });
      yTo.current = gsap.quickTo(menuContainerRef.current, "y", {
        duration: 0.1,
      });
    }

    const resizeCb = () => {
      requestAnimationFrame(() => {
        triggerBtnRect.current = triggerBtnRef.current.getBoundingClientRect();
        gsap.set(menuContainerRef.current, {
          x:
            innerWidth -
            Math.min(innerHeight, innerWidth) * 0.06 -
            triggerBtnRect.current.width,
          y:
            innerHeight -
            Math.min(innerHeight, innerWidth) * 0.06 -
            triggerBtnRect.current.width,
        });
      });
    };

    window.addEventListener("resize", resizeCb);
    return () => {
      window.removeEventListener("resize", resizeCb);
    };
  }, [showSetting]);

  return (
    <AnimatePresence>
      {showSetting && (
        <motion.div
          ref={menuContainerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed top-0 left-0 z-[calc(var(--maxZIndex)_-_1)]"
        >
          <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger
              asChild
              style={{ touchAction: "none" }}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMoveFlag(true);
                setOpen(false);
                triggerBtnRect.current =
                  triggerBtnRef.current.getBoundingClientRect();
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerUp={() => {
                setMoveFlag(false);
              }}
              onPointerMove={(e) => {
                if (moveFlag) {
                  xTo.current(e.clientX - triggerBtnRect.current.width / 2);
                  yTo.current(e.clientY - triggerBtnRect.current.height / 2);
                }
              }}
            >
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                ref={triggerBtnRef}
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <Settings className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side={"top"}
              className="w-48 z-[calc(var(--maxZIndex)_-_1)]"
            >
              <DropdownMenuItem
                onClick={() => {
                  dispatch(
                    setAssetsManangeOpen({ open: !assetsManageOpenStatus })
                  );
                  dispatch(setMediaLibraryOpen({ open: false }));
                  dispatch(setTaotajimaOpen({ open: false, id: "" }));
                }}
                className="flex items-center gap-2 rounded-lg py-2 px-2 hover:bg-background/50"
              >
                <FolderKanban className="w-4 h-4" />
                资产管理 <div className="flex-1"></div>
                {assetsManageOpenStatus ? (
                  <Check className="h-4 w-4"></Check>
                ) : (
                  <></>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  dispatch(
                    setMediaLibraryOpen({ open: !mediaLibraryOpenStatus })
                  );
                  dispatch(setAssetsManangeOpen({ open: false }));
                  dispatch(setTaotajimaOpen({ open: false, id: "" }));
                }}
                className="flex items-center gap-2 rounded-lg py-2 px-2 hover:bg-background/50"
              >
                <Clapperboard className="w-4 h-4" />
                媒体库
                <div className="flex-1"></div>
                {mediaLibraryOpenStatus ? (
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
