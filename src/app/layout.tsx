import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventPulse | Your Campus. Connected.",
  description: "Discover, register, and track campus events. Your campus, connected.",
  manifest: "/manifest.json",
  themeColor: "#1C1C1E",
  appleWebApp: {
    title: "EventPulse",
    statusBarStyle: "default",
    capable: true,
  },
  icons: {
    apple: "/icons/icon-180x180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} antialiased selection:bg-blue-500/30`}>
        <div className="mx-auto max-w-[430px] min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] relative shadow-2xl shadow-black/50 overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
