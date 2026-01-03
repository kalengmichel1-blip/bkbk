"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, X } from "lucide-react";

export default function AboutPage() {
    const [showVolumeToast, setShowVolumeToast] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = 0.5;

        const enableAudio = () => {
            if (audio.paused) {
                audio.play()
                    .then(() => setIsPlaying(true))
                    .catch(e => console.error("Play failed even after interaction:", e));
            }
            // Remove listeners once played
            document.removeEventListener("click", enableAudio);
            document.removeEventListener("touchstart", enableAudio);
            document.removeEventListener("keydown", enableAudio);
        };

        const attemptPlay = async () => {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch (error) {
                console.log("Autoplay blocked. Waiting for interaction.");
                // Add fallback listeners
                document.addEventListener("click", enableAudio);
                document.addEventListener("touchstart", enableAudio);
                document.addEventListener("keydown", enableAudio);
            }
        };

        attemptPlay();

        // Show "Turn up volume" toast almost immediately
        const timer = setTimeout(() => {
            setShowVolumeToast(true);
        }, 500);

        // Hide it after 2 seconds
        const hideTimer = setTimeout(() => {
            setShowVolumeToast(false);
        }, 2500);

        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
            document.removeEventListener("click", enableAudio);
            document.removeEventListener("touchstart", enableAudio);
            document.removeEventListener("keydown", enableAudio);
        };
    }, []);

    return (
        <main className="bg-gray-100 min-h-screen font-sans overflow-x-hidden">
            {/* Volume Notification Toast */}
            <AnimatePresence>
                {showVolumeToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: 50 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 right-6 z-50 bg-white shadow-2xl rounded-sm p-4 flex items-center gap-4 border-l-4 border-brand-red max-w-[90vw] md:max-w-xs"
                    >
                        <div className="bg-brand-red/10 p-2 rounded-full text-brand-red animate-pulse">
                            <Volume2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm uppercase tracking-wider">Audio Experience</p>
                            <p className="text-xs text-gray-600 font-serif italic">
                                {isPlaying ? "Listening to story..." : "Turn up volume for the full story."}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowVolumeToast(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] lg:h-screen flex items-center justify-center">
                {/* Background: Map & Gradient */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-400" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.15, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <Image
                            src="/drc-map-new.jpg"
                            alt="Map Background"
                            width={1200}
                            height={1200}
                            className="object-contain w-full h-full max-w-[1400px]"
                        />
                    </motion.div>
                </div>

                {/* Content Container */}
                <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center pt-20 lg:pt-0">
                    <div className="grid lg:grid-cols-12 gap-8 items-center h-full">

                        {/* LEFT: Typography & Red Box */}
                        <div className="lg:col-span-7 relative z-20">
                            {/* Big Bold Text */}
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] xl:text-[9rem] leading-[0.95] md:leading-[0.9] font-sans font-black text-white drop-shadow-xl uppercase tracking-tighter mb-4">
                                    THE<br />
                                    PROFESSOR &  THE<br />
                                    STRATEGIST
                                </h1>
                                <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-800 mb-8 ml-1 md:ml-2">
                                    Barnabé Kikaya Bin Karubi
                                </h2>

                                {/* Audio Story Player (Hidden Autoplay) */}
                                <audio
                                    ref={audioRef}
                                    id="bkbk-audio"
                                    src="/bkbk-story.mp3"
                                    className="hidden"
                                    onEnded={() => setIsPlaying(false)}
                                />

                            </motion.div>


                        </div>

                        {/* RIGHT: Portrait */}
                        <div className="lg:col-span-5 relative h-full flex items-end justify-center lg:justify-end mt-8 lg:mt-0">
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.4 }}
                                className="relative w-full max-w-md lg:max-w-xl h-[50vh] lg:h-[75vh]"
                            >
                                <Image
                                    src="/bkbk-portrait-final.png"
                                    alt="Barnabé Kikaya Bin Karubi"
                                    fill
                                    className="object-cover object-top drop-shadow-2xl rounded-sm"
                                    priority
                                />

                                {/* Floating Quote Box - Overlapping Image */}
                                <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                    className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-6 md:bottom-12 md:-left-24 bg-brand-red text-white p-4 sm:p-6 md:p-8 max-w-[260px] sm:max-w-xs md:max-w-md shadow-2xl rounded-sm z-30"
                                >
                                    <p className="text-base sm:text-lg font-serif leading-relaxed italic">
                                        &quot;This Congo is not just a country; it is a destiny. Our duty is to ensure that this destiny remains in the hands of its people.&quot;
                                    </p>
                                    <div className="mt-4 w-8 h-1 bg-brand-yellow" />
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Bottom Left Contact/Info (Absolute on Desktop) */}
                <div className="absolute bottom-0 left-0 bg-white p-8 md:p-10 z-30 max-w-sm hidden lg:block shadow-lg">
                    <h3 className="text-brand-red font-bold uppercase tracking-widest mb-2 text-xs">Diplomacy & Strategy</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed font-serif">
                        Former Ambassador & Diplomatic Advisor to the Head of State.<br />
                        Professor of Information and Communication Sciences at Unikin.
                    </p>
                </div>
            </section>

            {/* Biography Content (Scrollable) */}
            <section className="bg-white py-12 md:py-32">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="prose prose-base md:prose-lg prose-red mx-auto text-gray-700 font-serif leading-loose">

                        <div className="mb-16">
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b-2 border-brand-red pb-6 inline-block">
                                A Life of Service & Intellect
                            </h3>

                            <p className="text-xl leading-relaxed text-gray-900 mb-8 font-medium">
                                <strong>Barnabé Kikaya Bin Karubi</strong> is a distinguished Congolese scholar, diplomat, and statesman. His career is a testament to the intersection of intellectual rigor and high-stakes statecraft.
                                As a long-serving servant of the Democratic Republic of the Congo, he has stood at the forefront of the nation&apos;s diplomatic battles and reconstruction efforts.
                            </p>
                        </div>

                        <div className="mb-16">
                            <h4 className="text-2xl font-bold text-brand-blue mb-6">Education & Early Career</h4>
                            <p className="mb-6">
                                An intellectual by training, Dr. Kikaya holds a <strong>Ph.D. in Political Science and Journalism</strong> from <strong>Boston University (1989)</strong>, as well as a degree in English Language and Literature from the University of Lubumbashi.
                                His diverse academic background laid the foundation for a global worldview that bridges the Anglophone and Francophone spheres.
                            </p>
                            <p>
                                Before entering politics, he honed his communication skills as <strong>Editor-in-Chief of Canal Afrique</strong> in Johannesburg, South Africa, and founded the communication consultancy <strong>Afro 2C</strong> (1995-1997).
                            </p>
                        </div>

                        <div className="mb-16">
                            <h4 className="text-2xl font-bold text-brand-blue mb-8">Diplomatic & Political Leadership</h4>
                            <p className="mb-8">
                                Dr. Kikaya&apos;s political ascent coincides with pivotal moments in Congolese history.
                                Under President Laurent-Désiré Kabila, he was appointed <strong>Ambassador to Zimbabwe</strong>, a critical ally during the war.
                                Later, under President Joseph Kabila, he took on the vital role of <strong>Minister of Information (2001-2003)</strong>, serving as the voice of the government during the Sun City peace negotiations.
                            </p>
                            <ul className="list-none pl-0 space-y-8 my-10">
                                <li className="flex items-start gap-4 p-6 bg-gray-50 rounded-sm border-l-4 border-brand-red">
                                    <span className="text-brand-red font-bold text-xl mt-1">•</span>
                                    <div>
                                        <strong className="block text-gray-900 text-lg mb-2">Principal Diplomatic Advisor (2015-2018)</strong>
                                        <span className="text-gray-600 block">Served as the chief foreign policy architect for the Head of State, navigating complex geopolitical landscapes.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 p-6 bg-gray-50 rounded-sm border-l-4 border-brand-blue">
                                    <span className="text-brand-blue font-bold text-xl mt-1">•</span>
                                    <div>
                                        <strong className="block text-gray-900 text-lg mb-2">Ambassador to the United Kingdom (2009-2014)</strong>
                                        <span className="text-gray-600 block">Revitalized relations with London, representing the DRC as Ambassador Extraordinary and Plenipotentiary.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 p-6 bg-gray-50 rounded-sm border-l-4 border-brand-yellow">
                                    <span className="text-brand-yellow font-bold text-xl mt-1">•</span>
                                    <div>
                                        <strong className="block text-gray-900 text-lg mb-2">Member of Parliament (elected 2006)</strong>
                                        <span className="text-gray-600 block">Represented the Kasongo constituency (Maniema), serving on the External Relations Commission.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-2xl font-bold text-brand-blue mb-6">Academic Legacy</h4>
                            <p className="mb-0">
                                Beyond the corridors of power, &quot;The Professor&quot; has never left the classroom.
                                Since 2005, he has served as a <strong>Professor of Information and Communication Sciences</strong> at the <strong>University of Kinshasa (UNIKIN)</strong>.
                                He is also a Distinguished Research Associate at the <strong>University of Johannesburg (CADL)</strong>, contributing to pan-African discourse on diplomacy and leadership.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
