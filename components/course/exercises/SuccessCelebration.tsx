"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { ClientIcon } from "@/components/ui/client-icon";
import { successIcons, successTexts } from "@/constants/exercises";

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

type SuccessCelebrationProps = {
  visible: boolean;
};

export function SuccessCelebration({ visible }: SuccessCelebrationProps) {
  const [celebration, setCelebration] = useState({
    icon: successIcons[0],
    text: successTexts[0],
  });

  useEffect(() => {
    if (!visible) return;

    setCelebration({
      icon: pickRandom(successIcons),
      text: pickRandom(successTexts),
    });
  }, [visible]);

  const { icon, text } = celebration;

  // visible = true;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="success-celebration"
          className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center gap-2 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
        >
          <div className="bg-background/15 backdrop-blur-xs rounded-xl p-8 h-screen w-screen flex flex-col items-center justify-center">
            <ClientIcon
              src={icon}
              size={96}
              className="text-feedback-success"
              label={text}
            />
            <p className="max-w-sm text-lg font-medium ">{text}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
