import { HistoryTimeline } from "@/components/history-timeline";
import { FadeIn } from "@/components/fade-in";
import { KineticText } from "@/components/kinetic-text";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "History of DR Congo | Team BKBK",
    description: "A timeline of the Democratic Republic of the Congo's political history from 1960 to present.",
};

export default function HistoryPage() {
    return (
        <main className="min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-4 mb-16 text-center">
                <FadeIn>
                    <span className="text-brand-red font-bold uppercase tracking-[0.2em] text-sm mb-4 block">
                        National Heritage
                    </span>
                    <KineticText className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6 justify-center">
                        The Congolese Journey
                    </KineticText>
                    <p className="max-w-2xl mx-auto text-gray-600 text-lg leading-relaxed">
                        From the dawn of independence to the strategic vision of 2025, exploring the pivotal moments that have shaped the Democratic Republic of the Congo.
                    </p>
                </FadeIn>
            </div>

            <HistoryTimeline />
        </main>
    );
}
