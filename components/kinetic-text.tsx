"use client";

import { motion } from "framer-motion";

export function KineticText({ children, className }: { children: string; className?: string }) {
    // Split phrase into words, then characters to prevent layout breaks
    const words = children.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            } as any,
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            } as any,
        },
    };

    return (
        <motion.h1
            className={`flex flex-wrap overflow-hidden ${className}`}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {words.map((word, index) => (
                <span key={index} className="mr-[0.25em] whitespace-nowrap">
                    {Array.from(word).map((letter, index) => (
                        <motion.span variants={child} key={index} className="inline-block">
                            {letter}
                        </motion.span>
                    ))}
                </span>
            ))}
        </motion.h1>
    );
}
