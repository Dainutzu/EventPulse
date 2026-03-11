"use client";

import ProfileSection from "@/components/spa/ProfileSection";
import { BottomNav } from "@/components/ui";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 overflow-x-hidden pb-20">
        <ProfileSection />
      </main>
      <BottomNav activeTab="profile" />
    </div>
  );
}
