"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SplashContent from "./SplashContent";
import HomeContent from "./home/HomeContent";
import ExploreContent from "./explore/ExploreContent";
import PortfolioContent from "./portfolio/PortfolioContent";
import ProfileContent from "./profile/ProfileContent";
import ScannerContent from "./scanner/ScannerContent";
import { useEventStore } from "@/state/useEventStore";
import { BottomNav } from "@/components/ui";
import { MOCK_EVENTS } from "@/lib/mockData";

export default function Page() {
  const { activeTab, setActiveTab, isHydrated } = useEventStore();
  const [showSplash, setShowSplash] = useState(true);

  // Initial state handling
  useEffect(() => {
    // If we want a splash screen delay
    const timer = setTimeout(() => {
      // setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnterApp = () => {
    setShowSplash(false);
    setActiveTab("home");
  };

  if (showSplash) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        {/* We override SplashContent's Link with a button action */}
        <SplashContainer onEnter={handleEnterApp} />
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-full h-full pb-20"
          >
            {activeTab === "home" && <HomeContent initialEvents={MOCK_EVENTS} />}
            {activeTab === "explore" && <ExploreContent />}
            {activeTab === "scanner" && <ScannerContent />}
            {activeTab === "portfolio" && <PortfolioContent />}
            {activeTab === "profile" && <ProfileContent />}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

// Wrapper to hijack SplashContent's Link behavior
function SplashContainer({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="flex flex-col items-center justify-between h-screen py-16 px-7 relative">
      <div className="text-center z-10 flex flex-col items-center pt-20">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
          <span className="text-4xl text-white">⚡</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Event Pulse</h1>
        <p className="text-[var(--color-text-muted)] text-base">Your Campus. Connected.</p>
      </div>

      <div className="w-full h-40 flex items-center justify-center">
        <div className="w-full max-w-[280px] h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      <motion.div
        className="w-full flex flex-col gap-4 items-center z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <button
          onClick={onEnter}
          className="w-full py-4.5 bg-blue-600 text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-all"
        >
          <div className="inline-block mr-2">🎓</div>
          Sign in with University Email
        </button>
        <p className="text-[13px] text-[var(--color-text-muted)] text-center mt-2 px-6">
          Investor Presentation Mode • Mobile SPA
        </p>
      </motion.div>
    </div>
  );
}
