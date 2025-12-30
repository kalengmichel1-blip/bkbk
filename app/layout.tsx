import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Team BKBK | News & Analysis",
  description: "Political thought, analysis, and news from Dr. Barnabé Kikaya Bin Karubi.",
};

import { GlobalBackground } from "@/components/three/global-background";
import { SmoothScroll } from "@/components/smooth-scroll";
import { GrainOverlay } from "@/components/grain-overlay";
import { Spotlight } from "@/components/spotlight";
import { CustomCursor } from "@/components/custom-cursor";
import { BreakingNewsTicker } from "@/components/breaking-news";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${merriweather.variable} antialiased font-sans bg-white text-charcoal-900 flex flex-col min-h-screen relative cursor-none`}
      >
        <Spotlight />
        <CustomCursor />
        <SmoothScroll />
        <GrainOverlay />
        <GlobalBackground />
        <SiteHeader />
        <BreakingNewsTicker />
        <div className="flex-grow z-10">
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
