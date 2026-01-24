"use client";

import { store } from "@/app/StoreProvider";
import { selectDarkMode, setDarkMode } from "@/store/darkMode/darkMode-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { ReactNode, useEffect } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const darkMode = useAppSelector(selectDarkMode);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const localDarkMode = localStorage.getItem("darkMode");
    dispatch(
      setDarkMode(
        JSON.parse(
          localDarkMode !== "true" && localDarkMode !== "false"
            ? "true"
            : localDarkMode
        )
      )
    );
  }, []);
  useEffect(() => {
    darkMode
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [darkMode]);
  return children;
}
