"use client";

import dynamic from "next/dynamic";

const FloatingGeometry = dynamic(() => import("./floating-geometry"), { ssr: false });

export function GlobalBackground() {
    return <FloatingGeometry />;
}
