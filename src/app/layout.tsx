"use client";

import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { EventProvider } from "@/state/useEventStore";
import { ThemeProvider } from "@/state/useThemeStore";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { BottomNav } from "@/components/ui";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventPulse | Your Campus. Connected.",
  description: "Discover, register, and track campus events. Your campus, connected.",
  manifest: "/manifest.json",
  appleWebApp: {
    title: "EventPulse",
    statusBarStyle: "default",
    capable: true,
  },
  icons: {
    icon: [
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#1C1C1E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('app_theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (!theme && supportDarkMode) theme = 'dark';
                  if (!theme) theme = 'dark';
                  
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${outfit.variable} antialiased selection:bg-blue-500/30 bg-[var(--color-bg)] transition-colors duration-300`}>
        <ThemeProvider>
          <EventProvider>
            <KeyboardShortcuts />
            {/* Main Application Container */}
            <div className="min-h-screen flex relative">
              {/* Desktop Sidebar */}
              <div id="desktop-sidebar-container" className="hidden lg:block">
                <DesktopSidebar />
              </div>

              {/* Main Content Area */}
              <main className="flex-1 flex flex-col min-w-0">
                <div className="mx-auto w-full max-w-[430px] lg:max-w-[1200px] xl:max-w-[1400px] min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] relative shadow-2xl lg:shadow-none shadow-black/50 overflow-x-hidden transition-all duration-300 px-0 lg:px-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={pathname}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="w-full"
                    >
                      {children}
                    </motion.div>
                  </AnimatePresence>

                  <div className="lg:hidden">
                    <BottomNav />
                  </div>
                </div>
              </main>

              {/* Analytics Panel */}
              <div id="analytics-panel-container" className="hidden xl:block w-[360px] shrink-0 border-l border-[var(--color-border)] p-10">
                <AnalyticsPanel />
              </div>
            </div>
          </EventProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
