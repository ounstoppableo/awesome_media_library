"use client";

import MediaLibrary from "@/components/mediaLibrary";
import { ConfigProvider, message, theme } from "antd";
import Image from "next/image";
import { useEffect } from "react";

export default function MediaLibraryPage() {
  useEffect(() => {
    message.config({
      duration: 3,
      maxCount: 1,
      rtl: true,
    });
  });
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <div className="h-[100dvh]">
        <MediaLibrary></MediaLibrary>
      </div>
    </ConfigProvider>
  );
}
