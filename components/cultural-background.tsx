"use client";

import { useEffect, useState } from "react";

export function CulturalBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden mix-blend-overlay opacity-[0.03]">
            <svg className="w-full h-full opacity-100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    {/* Kuba Cloth Geometric Pattern */}
                    <pattern
                        id="kuba-pattern"
                        x="0"
                        y="0"
                        width="100"
                        height="100"
                        patternUnits="userSpaceOnUse"
                    >
                        {/* Diamonds/Triangles characteristic of Kuba art */}
                        <path
                            d="M0 50 L50 0 L100 50 L50 100 Z"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                        />
                        <path
                            d="M50 0 V100 M0 50 H100"
                            fill="none"
                            stroke="white"
                            strokeWidth="1"
                        />
                        <circle cx="50" cy="50" r="10" fill="white" />
                    </pattern>

                    {/* Leopard Spot Pattern */}
                    <pattern
                        id="leopard-pattern"
                        x="0"
                        y="0"
                        width="200"
                        height="200"
                        patternUnits="userSpaceOnUse"
                        patternTransform="rotate(45)"
                    >
                        {/* Abstract organic shapes mimicking rosettes */}
                        <path d="M20,20 Q30,10 40,20 T60,20 T70,40" fill="none" stroke="white" strokeWidth="3" opacity="0.8" />
                        <path d="M120,120 Q130,110 140,120 T160,120 T170,140" fill="none" stroke="white" strokeWidth="3" opacity="0.8" />
                        <circle cx="50" cy="50" r="4" fill="white" opacity="0.6" />
                        <circle cx="150" cy="150" r="6" fill="white" opacity="0.6" />
                        <path d="M80,80 C90,70 100,90 90,100 C80,110 70,90 80,80" fill="none" stroke="white" strokeWidth="2" />
                    </pattern>
                </defs>

                {/* Layer 1: Tribal Base */}
                <rect width="100%" height="100%" fill="url(#kuba-pattern)" opacity="0.5" />

                {/* Layer 2: Leopard Accents */}
                <rect width="100%" height="100%" fill="url(#leopard-pattern)" opacity="0.3" />
            </svg>

            {/* Texture Grain Overlay for 'Cloth' feel */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        </div>
    );
}
