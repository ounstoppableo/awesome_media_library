import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "motion/react";
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
        <div className="flex flex-col items-center gap-[3vmin]">
          <div className="rounded-full w-[12vmin] overflow-hidden hover:rotate-360 transition-all duration-500">
            <img
              src="https://www.unstoppable840.cn/assets/avatar.jpeg"
              className="icon-class w-full"
            />
          </div>
          <nav className="flex flex-wrap justify-center gap-[4vmin] text-[2.5vmin] text-black">
            <motion.a
              href="#"
              className="flex gap-[1vmin] items-center cursor-pointer"
              whileHover={{
                scale: 1.2,
                color: "var(--themeColor)",
                transition: { duration: 0.1 },
              }}
              transition={{ duration: 0.5 }}
            >
              <Home className="h-[2vmin] w-[2vmin]"></Home>
              Home
            </motion.a>
            <motion.a
              href="#"
              className="flex gap-[1vmin] items-center cursor-pointer"
              whileHover={{
                scale: 1.2,
                color: "var(--themeColor)",
                transition: { duration: 0.1 },
              }}
              transition={{ duration: 0.5 }}
            >
              <Newspaper className="h-[2vmin] w-[2vmin]"></Newspaper>
              Blog
            </motion.a>
            <motion.a
              href="#"
              className="flex gap-[1vmin] items-center cursor-pointer"
              whileHover={{
                scale: 1.2,
                color: "var(--themeColor)",
                transition: { duration: 0.1 },
              }}
              transition={{ duration: 0.5 }}
            >
              <MessageSquareMore className="h-[2vmin] w-[2vmin]"></MessageSquareMore>
              Chat
            </motion.a>
            <motion.a
              href="#"
              className="flex gap-[1vmin] items-center cursor-pointer"
              whileHover={{
                scale: 1.2,
                color: "var(--themeColor)",
                transition: { duration: 0.1 },
              }}
              transition={{ duration: 0.5 }}
            >
              <Component className="h-[2vmin] w-[2vmin]"></Component>
              Component
            </motion.a>
          </nav>
          <div className="flex space-x-[4vmin]">
            <motion.button
              className="w-fit h-fit cursor-pointer"
              whileHover={{
                scale: 1.3,
                color: "var(--themeColor)",
                transition: { duration: 0.1 },
              }}
              transition={{ duration: 0.5 }}
            >
              <BsWechat className="h-[3vmin_!important] w-[3vmin_!important]" />
              <span className="sr-only">WeChat</span>
            </motion.button>

            <motion.button
              className="w-fit h-fit cursor-pointer"
              whileHover={{
                scale: 1.3,
                color: "var(--themeColor)",
                transition: { duration: 0.1 },
              }}
              transition={{ duration: 0.5 }}
            >
              <BsTiktok className="h-[3vmin_!important] w-[3vmin_!important]" />
              <span className="sr-only">TikTok</span>
            </motion.button>
            <motion.button
              className="w-fit h-fit cursor-pointer"
              whileHover={{
                scale: 1.3,
                color: "var(--themeColor)",
                transition: { duration: 0.1 },
              }}
              transition={{ duration: 0.5 }}
            >
              <BsTelegram className="h-[3vmin_!important] w-[3vmin_!important]" />
              <span className="sr-only">Telegram</span>
            </motion.button>
            <motion.button
              className="w-fit h-fit cursor-pointer"
              whileHover={{
                scale: 1.3,
                color: "var(--themeColor)",
                transition: { duration: 0.1 },
              }}
              transition={{ duration: 0.5 }}
            >
              <Github className="h-[3vmin_!important] w-[3vmin_!important]" />
              <span className="sr-only">Github</span>
            </motion.button>
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
