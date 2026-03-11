"use client";

import ExploreSection from "@/components/spa/ExploreSection";
import { BottomNav } from "@/components/ui";

export default function ExplorePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 overflow-x-hidden pb-20">
        <ExploreSection />
      </main>
      <BottomNav activeTab="explore" />
    </div>
  );
}
