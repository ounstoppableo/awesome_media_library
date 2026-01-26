import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unstoppable840的摄影集",
  description: "Unstoppable840的摄影集",
  icons: ["https://www.unstoppable840.cn/assets/avatar.jpeg"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cn">
      <head>
        <script src="/iconfont/iconfont.js"></script>
        <link
          rel="stylesheet"
          href="/font/YunDuoAiChiMianHuaTang/stylesheet.css"
        ></link>
        <script src="/3d/three.js"></script>
        <script src="/3d/dat-gui.js"></script>
        <script src="/3d/gsap.js"></script>
        <script src="/3d/sketch.js"></script>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <Suspense>{children}</Suspense>
        </StoreProvider>
      </body>
    </html>
  );
}
