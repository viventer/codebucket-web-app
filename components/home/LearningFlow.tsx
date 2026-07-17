"use client";

import { useState } from "react";
import { LEARNING_FLOW_ITEMS } from "@/lib/learning-flow-content";
import { LearningFlowCard } from "@/components/home/LearningFlowCard";
import { ClientIcon } from "@/components/ui/client-icon";
import { normalizeStoragePath } from "@/actions/storage/helpers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LearningFlowProps = {
  videoUrls: Record<string, string>;
};

export function LearningFlow({ videoUrls }: LearningFlowProps) {
  const [activeTab, setActiveTab] = useState("0");

  return (
    <section className="flex snap-start flex-col items-center justify-center gap-8">
      <header className="flex max-w-[720px] flex-col items-center gap-2 text-center">
        <h2 className="text-xl tracking-tight sm:text-2xl lg:text-3xl">
          Poznaj <span className="text-accent font-bold">optymalny</span> sposób
          nauki
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base leading-tight">
          3-etapowy cykl nauki, dzięki któremu nauczysz się programowania
          szybciej i skuteczniej.
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
        <TabsList className="mx-auto h-auto w-full max-w-md">
          {LEARNING_FLOW_ITEMS.map((item, index) => (
            <TabsTrigger
              key={item.storagePath}
              value={String(index)}
              className="data-active:border-accent! data-active:bg-accent/10!"
            >
              <ClientIcon src={item.icon} size={16} />
              {item.tabLabel}
            </TabsTrigger>
          ))}
        </TabsList>

        {LEARNING_FLOW_ITEMS.map((item, index) => {
          const normalizedPath = normalizeStoragePath(item.storagePath);
          const videoSrc = videoUrls[normalizedPath];
          return (
            <TabsContent
              key={item.storagePath}
              value={String(index)}
              forceMount
              hidden={activeTab !== String(index)}
            >
              <LearningFlowCard
                item={item}
                videoSrc={videoSrc}
                isActive={activeTab === String(index)}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
}
