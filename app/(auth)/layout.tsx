import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | Team BKBK Admin",
    description: "Secure access for Team BKBK administration.",
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-serif font-bold text-white tracking-tight">Team BKBK</h1>
                    <p className="text-gray-400 text-sm mt-2 uppercase tracking-widest">Admin Access</p>
                </div>
                {children}
            </div>
        </div>
    );
}
