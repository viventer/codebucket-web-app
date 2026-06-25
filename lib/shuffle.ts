"use client";

import { useEffect, useState } from "react";

export function shuffleArray<T>(items: readonly T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j]!, next[i]!];
  }
  return next;
}

function getItemsDependencyKey<T>(items: readonly T[]): string {
  return JSON.stringify(items);
}

export function useShuffledItems<T>(
  items: readonly T[],
  shuffleToken: number,
): T[] {
  const itemsKey = getItemsDependencyKey(items);
  const [order, setOrder] = useState<T[]>(() => [...items]);

  useEffect(() => {
    setOrder(shuffleArray(items));
  }, [itemsKey, shuffleToken]);

  return order;
}
