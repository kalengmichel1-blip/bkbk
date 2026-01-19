import { getAllPosts } from "@/lib/data";

export const dynamic = 'force-dynamic';

export default async function DebugImagesPage() {
    const posts = await getAllPosts();
    const missing = posts.filter(p => !p.featured_image_url);
    const present = posts.filter(p => p.featured_image_url);

    return (
        <div className="p-10 font-mono text-sm max-w-6xl mx-auto bg-white min-h-screen text-black">
            <h1 className="text-2xl font-bold mb-4">Debug Images Status</h1>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="bg-red-50 p-4 rounded">
                    <h2 className="font-bold text-red-700">Missing Images: {missing.length}</h2>
                </div>
                <div className="bg-green-50 p-4 rounded">
                    <h2 className="font-bold text-green-700">Images Present: {present.length}</h2>
                </div>
            </div>

            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2 text-left">ID</th>
                        <th className="border p-2 text-left">Title</th>
                        <th className="border p-2 text-left">Image URL (Raw)</th>
                        <th className="border p-2 text-left">Preview</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.slice(0, 100).map(p => (
                        <tr key={p.id} className={p.featured_image_url ? "" : "bg-red-50"}>
                            <td className="border p-2 text-gray-500">{p.id}</td>
                            <td className="border p-2 font-bold">{p.title}</td>
                            <td className="border p-2 break-all text-xs text-blue-600">
                                {p.featured_image_url || 'NULL'}
                            </td>
                            <td className="border p-2">
                                {p.featured_image_url && (
                                    <img src={p.featured_image_url} alt="preview" className="w-16 h-10 object-cover" />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
