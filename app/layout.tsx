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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${merriweather.variable} antialiased font-sans bg-white text-charcoal-900 flex flex-col min-h-screen`}
      >
        <SiteHeader />
        <div className="flex-grow">
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
