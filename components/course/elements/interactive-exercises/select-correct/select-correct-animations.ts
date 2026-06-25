import type { Variants } from "motion/react";

export const selectCorrectSuccessVariants: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.02, 1],
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const selectCorrectErrorVariants: Variants = {
  initial: { x: 0 },
  animate: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

export const selectCorrectListSuccessVariants: Variants = {
  initial: { opacity: 1 },
  animate: {
    opacity: [1, 0.95, 1],
    transition: { duration: 0.4 },
  },
};
