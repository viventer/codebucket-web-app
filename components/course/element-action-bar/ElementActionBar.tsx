import { Actions } from "./Actions";
import { ElementInfo } from "./ElementInfo";
import type { ElementActionBarProps } from "./types";

export function ElementActionBar({
  type,
  title,
  prevHref,
  nextHref,
  hasMaterials,
}: ElementActionBarProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-4">
      <div className="mx-auto flex w-[95vw] max-w-[1280px] items-center justify-between gap-4 rounded-xl border bg-background/70 px-4 py-3 backdrop-blur">
        <ElementInfo type={type} title={title} />
        <Actions
          type={type}
          prevHref={prevHref}
          nextHref={nextHref}
          hasMaterials={hasMaterials}
        />
      </div>
    </nav>
  );
}
