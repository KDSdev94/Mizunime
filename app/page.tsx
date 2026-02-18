import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getHome, getBatch } from '@/lib/api';
import { HeroSlider } from '@/components/hero-slider';
import { HomeMainContent } from '@/components/home-main-content';
import { MainLayout } from '@/components/main-layout';

export const metadata: Metadata = {
  title: 'Mizunime | Nonton dan Unduh Anime Subtitle Indonesia',
  description: 'Streaming anime subtitle Indonesia terbaru dan terlengkap. Update setiap hari dengan kualitas HD. Nonton anime ongoing, completed, dan download batch gratis.',
  openGraph: {
    title: 'Mizunime - Nonton Anime Subtitle Indonesia Terbaru',
    description: 'Streaming anime subtitle Indonesia terbaru dan terlengkap. Update setiap hari dengan kualitas HD.',
    url: 'https://animekompi.fun',
    type: 'website',
  },
};

async function HomeContent() {
  const [homeData, batchData] = await Promise.all([
    getHome(1),
    getBatch(1),
  ]);

  const animeList = homeData.data.anime;
  const batchList = batchData.data.anime.slice(0, 5);
  const trending = animeList.slice(0, 5);
  const trendingTop10 = animeList.slice(0, 10);

  return (
    <div className="flex flex-col">
      {/* Hero Section - Full Width */}
      <section className="w-full">
        <HeroSlider animeList={trending} />
      </section>

      {/* Main Content + Sidebar Area - Using MainLayout for shared structure */}
      <MainLayout>
        <HomeMainContent
          initialAnime={animeList}
          trendingTop10={trendingTop10}
          batchList={batchList}
          totalPages={homeData.data.total_pages}
        />
      </MainLayout>
    </div>
  );
}

function HomeLoading() {
  return (
    <div className="flex flex-col">
      {/* Hero skeleton */}
      <div className="h-72 md:h-[550px] bg-[#0d1525] animate-pulse" />

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-10">
            <div className="h-8 w-48 bg-[#1a2a3a] rounded mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-[#0d1525] animate-pulse rounded-xl" />
              ))}
            </div>
          </div>
          <div className="lg:w-1/3 space-y-6">
            <div className="h-64 bg-[#0d1525] animate-pulse rounded-2xl" />
            <div className="h-48 bg-[#0d1525] animate-pulse rounded-2xl" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}
