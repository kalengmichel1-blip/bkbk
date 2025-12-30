"use client";

import { useMotionTemplate, useMotionValue, motion } from "framer-motion";
import { useEffect } from "react";

export function Spotlight() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
        mouseX.set(clientX);
        mouseY.set(clientY);
    }

    useEffect(() => {
        window.addEventListener("mousemove", (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        });
    }, [mouseX, mouseY]);

    return (
        <div className="pointer-events-none fixed inset-0 z-30 transition duration-300">
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.15),
              transparent 80%
            )
          `,
                }}
            />
        </div>
    );
}
