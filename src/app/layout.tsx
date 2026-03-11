import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ClientShell } from "@/components/ClientShell";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "EventPulse | Your Campus. Connected.",
  description: "Discover, register, and track campus events. Your campus, connected.",
  metadataBase: new URL("https://eventpulse.netlify.app"), // Replace with actual URL
  keywords: ["campus events", "university", "student life", "event tracking"],
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
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={outfit.variable}>
      <head>
        {/* Anti-FOUC Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('app_theme') || 'dark';
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
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
      <body className="antialiased selection:bg-blue-500/30 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-300 min-h-screen flex justify-center overflow-x-hidden">
        <Providers>
          <div className="w-full max-w-[430px] bg-white dark:bg-neutral-900 min-h-screen relative shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-x-hidden">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
