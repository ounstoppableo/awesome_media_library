"use client";

import MediaLibrary from "@/components/mediaLibrary";
import ThemeProvider from "@/components/themeProvider";
import { selectDarkMode } from "@/store/darkMode/darkMode-slice";
import { useAppSelector } from "@/store/hooks";
import { ConfigProvider, message, theme } from "antd";
import { useEffect } from "react";

export default function MediaLibraryPage() {
  const darkMode = useAppSelector(selectDarkMode);
  useEffect(() => {
    message.config({
      duration: 3,
      maxCount: 1,
      rtl: true,
    });
  });
  return (
    <ThemeProvider>
      <ConfigProvider
        theme={{
          algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <div className="h-[100dvh]">
          <MediaLibrary></MediaLibrary>
        </div>
      </ConfigProvider>
    </ThemeProvider>
  );
}
