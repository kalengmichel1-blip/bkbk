import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "../globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { GrainOverlay } from "@/components/grain-overlay";
import { Spotlight } from "@/components/spotlight";
import { CulturalBackground } from "@/components/cultural-background";
import { BreakingNewsTicker } from "@/components/breaking-news";
import { FloatingSocials } from "@/components/floating-socials";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Spotlight />
      <SmoothScroll />
      <GrainOverlay />
      <CulturalBackground />

      <SiteHeader />
      <BreakingNewsTicker />
      <FloatingSocials />
      <div className="flex-grow z-10">
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
