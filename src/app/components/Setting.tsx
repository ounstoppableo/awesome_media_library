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
import { setCloseScroll } from "@/store/jiejoeControl/jiejoeControl-slice";
import { setOpen as setTaotajimaOpen } from "@/store/taotajimaControl/taotajima-slice";
import {
  selectMediaLibraryOpenStatus,
  setOpen as setMediaLibraryOpen,
} from "@/store/mediaLibrarControl/mediaLibrary-slice";
import { selectDarkMode, setDarkMode } from "@/store/darkMode/darkMode-slice";
import { AnimatePresence, motion } from "motion/react";
import { initMessageTool as fetchInitMessageTool } from "@/utils/fetch";
import { initMessageTool as wsInitMessageTool } from "@/utils/clientWsMethod";
import { App } from "antd";

export default function Settiing(props: any) {
  const { setDialogOpen, showSetting } = props;
  const dispatch = useAppDispatch();
  const mediaLibraryOpenStatus = useAppSelector(selectMediaLibraryOpenStatus);
  const darkMode = useAppSelector(selectDarkMode);
  const { message } = App.useApp();
  useEffect(() => {
    fetchInitMessageTool(message);
    wsInitMessageTool(message);
  }, []);

  return (
    <AnimatePresence>
      {showSetting && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-[6vmin] right-[6vmin] z-150"
        >
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
                  dispatch(setTaotajimaOpen({ open: false, id: "" }));
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
                    setMediaLibraryOpen({ open: !mediaLibraryOpenStatus })
                  );
                  dispatch(
                    setCloseScroll({ closeScroll: !mediaLibraryOpenStatus })
                  );
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
