"use client";

import Link from "next/link";
import { User, Users, PartyPopper } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { motion } from "framer-motion";

export default function Splash() {
  return (
    <div className="flex flex-col items-center justify-between h-screen py-16 px-7 relative">
      {/* Decorative dots background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 4 + 2 + "px",
              height: Math.random() * 4 + 2 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Event Pulse</h1>
        <p className="text-[var(--color-text-muted)] text-base">Your Campus. Connected.</p>
      </motion.div>

      <motion.div
        className="w-full relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="p-10 flex flex-col items-center gap-6 bg-[#161a22]/80 backdrop-blur-xl border border-[var(--color-border)] shadow-2xl relative overflow-hidden">
          {/* Subtle glow effect behind icons */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[var(--color-accent)] opacity-5 rounded-full blur-3xl" />

          <motion.div
            className="flex relative h-20 w-48 items-center justify-center mb-2"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#1E2F5E] border-[4px] border-[#161a22] text-[#8B5CF6] absolute left-0 z-10 shadow-lg">
              <User size={28} />
            </div>
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#1A3D2E] border-[4px] border-[#161a22] text-[#10B981] absolute left-11 z-20 shadow-lg scale-110">
              <Users size={32} />
            </div>
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#2D2459] border-[4px] border-[#161a22] text-[#3B82F6] absolute left-24 z-10 shadow-lg">
              <PartyPopper size={28} />
            </div>
          </motion.div>

          {/* Skeleton lines pattern */}
          <div className="w-full flex flex-col gap-2.5 items-center mt-2 opacity-60">
            <div className="h-2 w-3/4 rounded-full bg-[var(--color-surface-elevated)]" />
            <div className="h-2 w-1/2 rounded-full bg-[var(--color-surface-elevated)]" />
          </div>
        </Card>
      </motion.div>

      <motion.div
        className="w-full flex flex-col gap-4 items-center z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Link href="/home" className="w-full block">
          <Button fullWidth className="py-4.5 rounded-2xl">
            <div className="mr-2">🎓</div>
            Sign in with University Email
          </Button>
        </Link>
        <p className="text-[13px] text-[var(--color-text-muted)] text-center mt-2 px-6">
          By continuing, you agree to our <span className="underline decoration-white/30 hover:text-white transition-colors cursor-pointer">Terms of Service</span> and <span className="underline decoration-white/30 hover:text-white transition-colors cursor-pointer">Privacy Policy</span>.
        </p>
      </motion.div>
    </div>
  );
}
