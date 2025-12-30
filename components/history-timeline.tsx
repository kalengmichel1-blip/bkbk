"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const events = [
    {
        year: "1960",
        title: "Independence & The Rise of Lumumba",
        description: "On June 30, 1960, the DRC gains independence from Belgium. Patrice Lumumba becomes the first Prime Minister, delivering a historic speech condemning colonialism. The nation faces immediate challenges with secessionist movements in Katanga.",
        color: "bg-yellow-500",
    },
    {
        year: "1965",
        title: "The Mobutu Era Begins",
        description: "Joseph-Désiré Mobutu takes power in a coup, establishing a one-party state. He later renames the country Zaire and initiates the 'Authenticité' campaign, enforcing cultural nationalism.",
        color: "bg-green-600",
    },
    {
        year: "1997",
        title: "Liberation & Laurent-Désiré Kabila",
        description: "The AFDL rebellion, led by Laurent-Désiré Kabila, ousts Mobutu. The country is renamed the Democratic Republic of the Congo. A period of reconstruction and regional conflict follows.",
        color: "bg-blue-600",
    },
    {
        year: "2001",
        title: "Joseph Kabila Takes Office",
        description: "Following the assassination of his father, Joseph Kabila assumes the presidency. He oversees the transition to peace, the 2006 constitution, and distinct periods of post-war rebuilding.",
        color: "bg-blue-800",
    },
    {
        year: "2019",
        title: "First Peaceful Transfer of Power",
        description: "Félix Tshisekedi is declared the winner of the presidential election, marking the first peaceful transfer of power since independence. He governs in a coalition before consolidating authority.",
        color: "bg-brand-red",
    },
    {
        year: "2025",
        title: "The Future & Strategic Vision",
        description: "The DRC continues its path towards modernization, focusing on economic sovereignty, digital transformation, and regional leadership. The 'Professor & Strategist' vision guides the intellectual framework for this new era.",
        color: "bg-purple-600",
    },
];

function TimelineItem({ event, index }: { event: any; index: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`mb-16 flex justify-between items-center w-full ${index % 2 === 0 ? "flex-row-reverse" : ""
                }`}
        >
            <div className="w-5/12"></div>

            <div className="z-20 flex items-center order-1 shadow-xl w-12 h-12 rounded-full border-4 border-white bg-gray-900 justify-center">
                <div className={`w-4 h-4 rounded-full ${event.color}`} />
            </div>

            <div className={`w-5/12 order-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-sm shadow-xl border border-white/20 hover:shadow-2xl transition-shadow duration-300">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2 ${event.color}`}>
                        {event.year}
                    </span>
                    <h3 className="text-xl font-bold font-serif text-gray-900 mb-3">{event.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                </div>
            </div>
        </motion.div>
    );
}

export function HistoryTimeline() {
    return (
        <div className="relative container mx-auto px-6 py-12 overflow-hidden">
            {/* Central Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200" />

            {events.map((event, index) => (
                <TimelineItem key={index} event={event} index={index} />
            ))}
        </div>
    );
}
