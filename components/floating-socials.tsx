"use client";

import React from "react";
import { Linkedin } from "lucide-react";
import Link from "next/link";

const socialLinks = [
    {
        name: "X (Twitter)",
        url: "https://x.com/kikayabinkarubi",
        icon: (
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-5 h-5 fill-current"
            >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        color: "hover:bg-black hover:text-white",
    },
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/barnab%C3%A9-kikaya-bin-karubi-73528811/",
        icon: <Linkedin className="w-5 h-5" />,
        color: "hover:bg-[#0077b5] hover:text-white",
    },
    {
        name: "Wikipedia",
        url: "https://fr.wikipedia.org/wiki/Kikaya_Bin_Karubi",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
            >
                <path d="M12.09 13.91L9.19 4.36H6.16L9.67 15.65L7.05 23.36H10.12L13.1 14.65L16.27 23.36H19.34L16.27 13.91L19.45 4.36H16.42L13.1 13.91L14.56 18.57L12.09 13.91ZM4.66 4.36L2.14 11.96L3.92 17.65L7.29 23.36L4.66 4.36Z" />
            </svg>
        ),
        color: "hover:bg-gray-200 hover:text-black",
    },
];

export function FloatingSocials() {
    return (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 hidden md:flex">
            {socialLinks.map((item) => (
                <Link
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
            p-3 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-white/20
            text-gray-600 transition-all duration-300 transform hover:scale-110
            ${item.color} group relative
          `}
                    aria-label={item.name}
                >
                    {item.icon}

                    {/* Tooltip */}
                    <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {item.name}
                    </span>
                </Link>
            ))}
        </div>
    );
}
