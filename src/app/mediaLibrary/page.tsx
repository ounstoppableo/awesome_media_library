"use client";

import MediaLibrary from "@/components/mediaLibrary";
import { message } from "antd";
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
    <div className="h-[100dvh]">
      <MediaLibrary></MediaLibrary>
    </div>
  );
}
