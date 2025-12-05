"use client";
import { message } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "@ant-design/v5-patch-for-react-19";
import SienaStyle from "@/components/sienaStyle";
import Taotajima from "@/components/taotajima";

export default function Home() {
  const router = useRouter();

  return <Taotajima></Taotajima>;
}
