import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Component,
  Facebook,
  Github,
  Home,
  Instagram,
  Linkedin,
  MessageSquareMore,
  Newspaper,
  Twitter,
} from "lucide-react";
import { BsTelegram, BsTiktok, BsWechat } from "react-icons/bs";

function StackedCircularFooter() {
  return (
    <footer className="bg-transparent pb-[4vmin] h-full flex justify-center items-center">
      <div className="container mx-auto px-[2%] md:px-[3%]">
        <div className="flex flex-col items-center gap-[2vmin]">
          <div className="rounded-full w-[12vmin] overflow-hidden hover:rotate-360 transition-all duration-500">
            <img
              src="https://www.unstoppable840.cn/assets/avatar.jpeg"
              className="icon-class w-full"
            />
          </div>
          <nav className="flex flex-wrap justify-center gap-[4vmin] text-primary-foreground text-[2.5vmin]">
            <a
              href="#"
              className="hover:text-[var(--themeColor)] flex gap-[1vmin] transition-all duration-500 items-center cursor-pointer"
            >
              <Home className="h-[2vmin] w-[2vmin]"></Home>
              Home
            </a>
            <a
              href="#"
              className="hover:text-[var(--themeColor)] flex gap-[1vmin] transition-all duration-500 items-center cursor-pointer"
            >
              <Newspaper className="h-[2vmin] w-[2vmin]"></Newspaper>
              Blog
            </a>
            <a
              href="#"
              className="hover:text-[var(--themeColor)] flex gap-[1vmin] transition-all duration-500 items-center cursor-pointer"
            >
              <MessageSquareMore className="h-[2vmin] w-[2vmin]"></MessageSquareMore>
              Chat
            </a>
            <a
              href="#"
              className="hover:text-[var(--themeColor)] flex gap-[1vmin] transition-all duration-500 items-center cursor-pointer"
            >
              <Component className="h-[2vmin] w-[2vmin]"></Component>
              Component
            </a>
          </nav>
          <div className="flex space-x-[4vmin] text-primary-foreground">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:text-[var(--themeColor)] transition-all duration-500 w-fit h-fit cursor-pointer"
            >
              <BsWechat className="h-[2vmin_!important] w-[2vmin_!important]" />
              <span className="sr-only">WeChat</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:text-[var(--themeColor)] transition-all duration-500 w-fit h-fit cursor-pointer"
            >
              <BsTiktok className="h-[2vmin_!important] w-[2vmin_!important]" />
              <span className="sr-only">TikTok</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:text-[var(--themeColor)] transition-all duration-500 w-fit h-fit cursor-pointer"
            >
              <BsTelegram className="h-[2vmin_!important] w-[2vmin_!important]" />
              <span className="sr-only">Telegram</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:text-[var(--themeColor)] transition-all duration-500 w-fit h-fit cursor-pointer"
            >
              <Github className="h-[2vmin_!important] w-[2vmin_!important]" />
              <span className="sr-only">Github</span>
            </Button>
          </div>
          <div className="text-center">
            <p className="text-[2vmin] text-muted-foreground">
              © 2026 Unstoppable840. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { StackedCircularFooter };
