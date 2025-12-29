"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Show splash for slightly longer for the premium reveal
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 4000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#15203B]" // Deeper Brand Blue for luxury
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="relative z-10 flex flex-col items-center">
                        {/* Flag Container */}
                        <div className="relative w-80 h-52 bg-[#0077CC] overflow-hidden shadow-2xl rounded-sm ring-1 ring-white/10">

                            {/* 1. Diagonal Stripe Reveal */}
                            <motion.div
                                initial={{ x: -100, y: 100, opacity: 0 }}
                                animate={{ x: 0, y: 0, opacity: 1 }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                                className="absolute inset-0"
                            >
                                <div className="absolute -inset-10 bg-[#C8102E] w-[200%] h-14 rotate-[-35deg] transform origin-bottom-left border-y-[6px] border-[#F7D618] translate-y-24 translate-x-[-10px] shadow-lg"></div>
                            </motion.div>

                            {/* 2. Star Pop with Gold Glow */}
                            <motion.div
                                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 1.0 }}
                                className="absolute top-5 left-5 text-[#F7D618] drop-shadow-[0_0_15px_rgba(247,214,24,0.6)]"
                            >
                                <svg width="60" height="60" viewBox="0 0 51 48">
                                    <path fill="currentColor" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z" />
                                </svg>
                            </motion.div>

                            {/* 3. Premium Light Sweep Animation */}
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "200%" }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 1.8 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                            />

                            {/* Inner Glow / Vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                        </div>

                        {/* Text Reveal - Staggered */}
                        <div className="mt-10 overflow-hidden flex flex-col items-center gap-2">
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
                                className="text-white font-serif font-bold text-3xl tracking-[0.25em] uppercase text-center"
                            >
                                Team BKBK
                            </motion.p>

                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 1.6 }}
                                className="h-px w-24 bg-brand-red"
                            />

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.8 }}
                                transition={{ duration: 1, delay: 2.0 }}
                                className="text-white/70 font-sans text-[10px] uppercase tracking-[0.4em]"
                            >
                                Diplomacy • Sovereignty
                            </motion.p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
