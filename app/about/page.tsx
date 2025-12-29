import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Qui est BKBK ? | Team BKBK",
    description: "Biography of Dr. Barnabé Kikaya Bin Karubi - Diplomat, Scholar, and Statesman.",
};

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <span className="text-brand-red font-bold uppercase tracking-wider text-sm mb-2 block">
                            Biography
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight mb-6">
                            Dr. Barnabé Kikaya Bin Karubi
                        </h1>
                        <p className="text-xl text-gray-600 font-serif italic">
                            Diplomat. Political Thinker. Voice of Sovereignty.
                        </p>
                    </div>

                    {/* Profile Section */}
                    <div className="grid md:grid-cols-12 gap-12 items-start mb-16">
                        <div className="md:col-span-5 relative">
                            <div className="aspect-[3/4] w-full relative rounded-sm overflow-hidden shadow-md bg-gray-100">
                                <Image
                                    src="/bkbk-portrait.jpg"
                                    alt="Dr. Barnabé Kikaya Bin Karubi"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <div className="mt-4 text-center md:text-left">
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                                    Former Diplomatic Advisor to the President
                                </p>
                            </div>
                        </div>

                        <div className="md:col-span-7 prose prose-lg prose-slate font-serif text-gray-800 leading-loose">
                            <p>
                                <strong>Barnabé Kikaya Bin Karubi</strong> is a prominent Congolese figure known for his dual legacy as a seasoned diplomat and an academic scholar. A staunch advocate for the sovereignty of the Democratic Republic of Congo, he has served at the highest levels of statecraft.
                            </p>

                            <h3 className="text-brand-blue font-bold mt-8 mb-4">A Life of Public Service</h3>
                            <p>
                                Dr. Kikaya served as the <strong>Diplomatic Advisor</strong> to President Joseph Kabila from 2015 to 2018, playing a pivotal role in shaping the DRC's foreign policy during a critical period of transition. His deep understanding of international relations was further demonstrated during his tenure as the DRC's <strong>Ambassador to the United Kingdom</strong>.
                            </p>
                            <p>
                                Prior to his diplomatic assignments, he held the crucial portfolio of <strong>Minister of Information and Communication</strong> (2001–2003), where he was the voice of the government during the challenging times of the peace negotiations.
                            </p>

                            <h3 className="text-brand-blue font-bold mt-8 mb-4">Intellectual & Academic Roots</h3>
                            <p>
                                Beyond politics, Dr. Kikaya is a man of letters. He holds a <strong>Ph.D. in Political Science and Journalism</strong> from <strong>Boston University (1989)</strong>.
                            </p>
                            <p>
                                He is a Professor of Strategic Communication at the University of Kinshasa and a Distinguished Research Associate at the Centre for African Diplomacy and Leadership (CADL) at the University of Johannesburg. His writings reflect a deep commitment to preserving the institutional memory of the Congo and analyzing the geopolitical forces shaping Africa.
                            </p>

                            <div className="bg-gray-50 p-6 border-l-4 border-brand-red mt-8 not-italic">
                                <p className="mb-0 text-sm text-gray-600">
                                    "The Congo is not just a country; it is a destiny. Our duty is to ensure that this destiny remains in the hands of its people."
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
