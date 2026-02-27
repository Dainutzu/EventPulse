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
    apple: "/icons/icon-180x180.png",
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
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('app_theme') || 'dark';
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
      <body className={`${outfit.variable} antialiased selection:bg-blue-500/30 transition-colors duration-300`}>
        <ThemeProvider>
          <EventProvider>
            <div className="mx-auto max-w-[430px] min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] relative shadow-2xl shadow-black/50 overflow-hidden">
              {children}
            </div>
          </EventProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
