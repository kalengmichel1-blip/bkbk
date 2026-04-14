import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Team BKBK",
    description: "Political thought, analysis, and news by Dr. Barnabé Kikaya Bin Karubi.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body
                suppressHydrationWarning
                className="antialiased font-sans bg-white text-charcoal-900"
            >
                {children}
            </body>
        </html>
    );
}
