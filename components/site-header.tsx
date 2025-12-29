"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, X, Newspaper } from "lucide-react";
import clsx from "clsx";

export function SiteHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "News", href: "/category/news" },
        { name: "Analysis", href: "/category/analysis" },
        { name: "Opinion", href: "/category/opinion" },
        { name: "La Plume", href: "/category/la-plume-de-bkbk" },
        { name: "Call of Duties", href: "/category/call-of-duties" },
        { name: "La Voix des Autres", href: "/category/la-voix-des-autres" },
    ];

    return (
        <header
            className={clsx(
                "sticky top-0 z-50 w-full transition-all duration-300 border-b",
                isScrolled
                    ? "bg-white/95 backdrop-blur-sm border-gray-200 shadow-sm py-2"
                    : "bg-white border-transparent py-4"
            )}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <img
                            src="/logo.png"
                            alt="Team BKBK Logo"
                            className="h-10 md:h-12 w-auto object-contain"
                        />
                        {/* Mobile-only text fallback if needed, but logo has text */}
                        <span className="sr-only">Team BKBK</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 hover:text-brand-red transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="h-4 w-px bg-gray-300 mx-2" />
                        <Link
                            href="/about"
                            className="text-sm font-medium text-gray-600 hover:text-brand-red transition-colors"
                        >
                            About
                        </Link>
                        <button className="p-2 text-gray-500 hover:text-brand-red transition-colors">
                            <Search className="h-5 w-5" />
                        </button>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 text-gray-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-base font-medium text-gray-800 py-2 border-b border-gray-100 last:border-0"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/about"
                        className="text-base font-medium text-gray-800 py-2 border-b border-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        About BKBK
                    </Link>
                </div>
            )}
        </header>
    );
}
