"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { ClientIcon, prefetchClientIcon } from "@/components/ui/client-icon";
import { successIcons, successTexts } from "@/constants/exercises";

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

type SuccessCelebrationProps = {
  visible: boolean;
};

export function SuccessCelebration({ visible }: SuccessCelebrationProps) {
  const prevVisible = useRef(false);
  const celebrationRef = useRef({
    icon: successIcons[0]!,
    text: successTexts[0]!,
  });
  const [iconReady, setIconReady] = useState(false);

  if (visible && !prevVisible.current) {
    celebrationRef.current = {
      icon: pickRandom(successIcons),
      text: pickRandom(successTexts),
    };
  }
  prevVisible.current = visible;

  useEffect(() => {
    void Promise.all(successIcons.map(prefetchClientIcon));
  }, []);

  useEffect(() => {
    if (!visible) {
      setIconReady(false);
      return;
    }

    let cancelled = false;

    prefetchClientIcon(celebrationRef.current.icon).then(() => {
      if (!cancelled) {
        setIconReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [visible]);

  const { icon, text } = celebrationRef.current;
  const show = visible && iconReady;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="success-celebration"
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{
            hidden: {},
            visible: {},
            exit: { transition: { when: "afterChildren" } },
          }}
        >
          <motion.div
            className="absolute inset-0 bg-background/15 backdrop-blur-xs"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { duration: 0.25, ease: "easeOut" },
              },
              exit: {
                opacity: 0,
                transition: { duration: 0.15, ease: "easeIn" },
              },
            }}
          />
          <motion.div
            className="relative z-10 flex flex-col items-center gap-2 text-center"
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: { duration: 0.15, ease: "easeOut" },
              },
              exit: {
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.1, ease: "easeIn" },
              },
            }}
          >
            <ClientIcon
              src={icon}
              size={96}
              className="text-feedback-success"
              label={text}
            />
            <p className="max-w-sm text-lg font-medium">{text}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
