import type { LearningFlowItemConfig } from "@/lib/learning-flow-content";
import { LazyVideo } from "@/components/home/LazyVideo";
import { ClientIcon } from "@/components/ui/client-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type LearningFlowCardProps = {
  item: LearningFlowItemConfig;
  videoSrc: string | undefined;
  isActive: boolean;
};

export function LearningFlowCard({
  item,
  videoSrc,
  isActive,
}: LearningFlowCardProps) {
  return (
    <Card>
      <CardHeader className="grid-cols-1 gap-3">
        <div className="flex items-center gap-2">
          <ClientIcon
            src={item.icon}
            size={50}
            className="hidden shrink-0 sm:inline-block"
          />
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg tracking-tight sm:text-xl">
              {item.titleBefore}
              <span className="font-bold text-accent">{item.titleAccent}</span>
              {item.titleAfter ?? ""}
            </CardTitle>
            <CardDescription className="text-sm leading-tight">
              {item.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mx-auto aspect-video w-full max-w-[720px] overflow-hidden rounded-xl bg-muted">
          <LazyVideo
            src={videoSrc}
            className="h-full w-full"
            isActive={isActive}
          />
        </div>
      </CardContent>
    </Card>
  );
}
