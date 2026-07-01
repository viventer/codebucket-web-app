"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  exitElementFullscreen,
  getFullscreenElement,
  requestElementFullscreen,
  subscribeToFullscreenChange,
} from "@/lib/dom/request-fullscreen";

type CheatsheetFullscreenContextValue = {
  isFullscreen: boolean;
  slideIndex: number;
  slidesCount: number;
  setSlideIndex: (index: number) => void;
  setSlidesCount: (count: number) => void;
  registerOverlayElement: (element: HTMLElement | null) => void;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
};

const CheatsheetFullscreenContext =
  createContext<CheatsheetFullscreenContextValue | null>(null);

export function CheatsheetFullscreenProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [slidesCount, setSlidesCount] = useState(0);
  const overlayRef = useRef<HTMLElement | null>(null);

  const registerOverlayElement = useCallback((element: HTMLElement | null) => {
    overlayRef.current = element;
  }, []);

  const enterFullscreen = useCallback(() => {
    if (slidesCount === 0) {
      return;
    }

    setIsFullscreen(true);
    void requestElementFullscreen(overlayRef.current);
  }, [slidesCount]);

  const exitFullscreen = useCallback(() => {
    void exitElementFullscreen();
    setIsFullscreen(false);
  }, []);

  useEffect(() => {
    return subscribeToFullscreenChange(() => {
      if (!getFullscreenElement()) {
        setIsFullscreen(false);
      }
    });
  }, []);

  return (
    <CheatsheetFullscreenContext.Provider
      value={{
        isFullscreen,
        slideIndex,
        slidesCount,
        setSlideIndex,
        setSlidesCount,
        registerOverlayElement,
        enterFullscreen,
        exitFullscreen,
      }}
    >
      {children}
    </CheatsheetFullscreenContext.Provider>
  );
}

export function useCheatsheetFullscreen(): CheatsheetFullscreenContextValue {
  const context = useContext(CheatsheetFullscreenContext);

  if (!context) {
    throw new Error(
      "useCheatsheetFullscreen must be used within CheatsheetFullscreenProvider",
    );
  }

  return context;
}
