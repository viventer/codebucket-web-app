"use client";

import { useCallback, useMemo, useState } from "react";

import type { FillGapsContent } from "@/schemas/courseSchema";

function getGapIds(content: FillGapsContent): string[] {
  return content.lines
    .filter((line) => line.kind === "gap")
    .map((line) => line.id);
}

function getFirstEmptyGapId(
  gapIds: string[],
  assignments: Record<string, string | null>,
): string | null {
  return gapIds.find((id) => assignments[id] === null) ?? null;
}

export function useFillGapsState(content: FillGapsContent) {
  const gapIds = useMemo(() => getGapIds(content), [content]);

  const initialAssignments = useMemo(() => {
    const assignments: Record<string, string | null> = {};
    for (const id of gapIds) {
      assignments[id] = null;
    }
    return assignments;
  }, [gapIds]);

  const [assignments, setAssignments] =
    useState<Record<string, string | null>>(initialAssignments);
  const [activeGapId, setActiveGapId] = useState<string | null>(
    gapIds[0] ?? null,
  );

  const availableOptions = useMemo(() => {
    const used = new Set(
      Object.values(assignments).filter((value): value is string => value !== null),
    );
    return content.options.filter((option) => !used.has(option));
  }, [assignments, content.options]);

  const selectOption = useCallback(
    (option: string) => {
      if (!activeGapId) return;

      setAssignments((prev) => {
        const next = {
          ...prev,
          [activeGapId]: option,
        };
        setActiveGapId(getFirstEmptyGapId(gapIds, next));
        return next;
      });
    },
    [activeGapId, gapIds],
  );

  const clearGap = useCallback((gapId: string) => {
    setAssignments((prev) => ({
      ...prev,
      [gapId]: null,
    }));
    setActiveGapId(gapId);
  }, []);

  const reset = useCallback(() => {
    setAssignments(initialAssignments);
    setActiveGapId(gapIds[0] ?? null);
  }, [gapIds, initialAssignments]);

  return {
    assignments,
    activeGapId,
    availableOptions,
    selectOption,
    clearGap,
    setActiveGapId,
    reset,
  };
}
