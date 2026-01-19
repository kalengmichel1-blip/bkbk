import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/sidebar";

export const metadata: Metadata = {
    title: "Admin Dashboard | Team BKBK",
    description: "Content Management System",
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-gray-950 text-white flex">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                {/* Top Header (Optional) */}
                <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Workspace</h2>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-brand-gold flex items-center justify-center text-charcoal-900 font-bold text-xs">
                            AD
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
