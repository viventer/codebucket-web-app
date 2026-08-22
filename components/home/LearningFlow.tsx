"use client";

import { useState } from "react";
import { LEARNING_FLOW_ITEMS } from "@/lib/learning-flow-content";
import { LearningFlowCard } from "@/components/home/LearningFlowCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ClientIcon } from "@/components/ui/client-icon";
import { normalizeStoragePath } from "@/actions/storage/helpers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LearningFlowProps = {
  videoUrls: Record<string, string>;
};

export function LearningFlow({ videoUrls }: LearningFlowProps) {
  const [activeTab, setActiveTab] = useState("0");

  return (
    <section className="flex flex-col items-center justify-center gap-8 sm:mb-16 sm:snap-center">
      <SectionHeading>
        <SectionHeading.Title>
          Poznaj <span className="text-accent font-bold">optymalny</span> sposób
          nauki
        </SectionHeading.Title>
        <SectionHeading.Description className="leading-tight sm:text-base">
          3-etapowy cykl nauki, dzięki któremu nauczysz się programowania
          szybciej i skuteczniej.
        </SectionHeading.Description>
      </SectionHeading>

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
