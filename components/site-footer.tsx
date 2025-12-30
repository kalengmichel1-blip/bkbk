"use client";

import Link from "next/link";
import { Newspaper } from "lucide-react";
import dynamic from "next/dynamic";

const ParticleWave = dynamic(() => import("./three/particle-wave"), { ssr: false });

export function SiteFooter() {
    return (
        <footer className="relative bg-[#1f2125] text-white py-12 border-t border-gray-800 overflow-hidden">
            <ParticleWave />
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="block mb-4">
                            <img
                                src="/logo.png"
                                alt="Team BKBK Logo"
                                className="h-10 w-auto object-contain brightness-0 invert opacity-90"
                            />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed serif-body">
                            The authoritative source for political thought, memory, and sovereignty.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="col-span-1">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Sections</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link href="/category/news" className="hover:text-brand-red transition-colors">News</Link></li>
                            <li><Link href="/category/analysis" className="hover:text-brand-red transition-colors">Analysis</Link></li>
                            <li><Link href="/category/opinion" className="hover:text-brand-red transition-colors">Opinion</Link></li>
                            <li><Link href="/category/la-plume-de-bkbk" className="hover:text-brand-red transition-colors">La Plume de BKBK</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">About</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link href="/about" className="hover:text-brand-red transition-colors">Who is BKBK?</Link></li>
                            <li><Link href="/contact" className="hover:text-brand-red transition-colors">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-brand-red transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Connect</h4>
                        <p className="text-sm text-gray-400 mb-4">
                            Follow Team BKBK for the latest updates and strategic analysis.
                        </p>
                        {/* Social placeholders */}
                        <div className="flex gap-4">
                            <div className="h-8 w-8 bg-gray-800 rounded-full hover:bg-brand-red transition-colors cursor-pointer"></div>
                            <div className="h-8 w-8 bg-gray-800 rounded-full hover:bg-brand-red transition-colors cursor-pointer"></div>
                            <div className="h-8 w-8 bg-gray-800 rounded-full hover:bg-brand-red transition-colors cursor-pointer"></div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Team BKBK. All rights reserved.</p>
                    <p>Designed for Sovereignty.</p>
                </div>
            </div>
        </footer>
    );
}
