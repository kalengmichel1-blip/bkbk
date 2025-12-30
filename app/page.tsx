import { getAllPosts } from "@/lib/data";
import { HeroSection } from "@/components/hero-section";
import { NewsGrid } from "@/components/news-grid";
import { SplashScreen } from "@/components/splash-screen";
import { FadeIn } from "@/components/fade-in";

export default function Home() {
  const allPosts = getAllPosts();

  if (allPosts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading content...</p>
      </div>
    )
  }

  const heroPost = allPosts[0];
  const secondaryPosts = allPosts.slice(1, 7); // Next 6 posts
  const moreNews = allPosts.slice(7, 16); // Next 9 posts

  return (
    <div className="min-h-screen bg-transparent">
      <SplashScreen />
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <FadeIn>
          <HeroSection post={heroPost} />
        </FadeIn>

        <FadeIn delay={0.2}>
          <NewsGrid posts={secondaryPosts} title="Latest Headlines" />
        </FadeIn>

        <div className="border-t border-gray-200/50 my-12" />

        <FadeIn delay={0.3}>
          <NewsGrid posts={moreNews} title="More News" />
        </FadeIn>
      </main>
    </div>
  );
}
