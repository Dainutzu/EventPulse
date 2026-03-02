import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { EventProvider } from "@/state/useEventStore";
import { ThemeProvider } from "@/state/useThemeStore";

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
      <body className={`${outfit.variable} antialiased selection:bg-blue-500/30`}>
        <ThemeProvider>
          <EventProvider>
            <div className="mx-auto max-w-[430px] min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] relative shadow-2xl shadow-black/50 overflow-hidden transition-colors duration-300">
              {children}
            </div>
          </EventProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
