'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Flame, Download, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import type { AnimeItem, HomeResponse } from '@/lib/types';
import { isEpisodeSlug } from '@/lib/utils-episode';
import { AnimeCard } from '@/components/anime-card';

interface HomeMainContentProps {
    initialAnime: AnimeItem[];
    trendingTop10: AnimeItem[];
    batchList: AnimeItem[];
    totalPages: number;
}

const PRIMARY = '#58d0f6';
const SECONDARY = '#2a75ae';

export function HomeMainContent({ initialAnime, trendingTop10, batchList, totalPages }: HomeMainContentProps) {
    const [activeTab, setActiveTab] = useState<'trending' | 'history'>('trending');
    const [currentPage, setCurrentPage] = useState(1);
    // Initial filter for the first load (already passed and sliced in page.tsx ideally, but we do it here again to be safe)
    const [animeList, setAnimeList] = useState<AnimeItem[]>(initialAnime.filter(a => !a.slug.toLowerCase().includes('batch')).slice(0, 15));
    const [loading, setLoading] = useState(false);

    // Function to fetch and filter latest releases (excluding batches) via internal API Proxy
    const fetchPage = async (page: number) => {
        console.log(`[Pagination] Fetching page ${page}...`);
        setLoading(true);
        try {
            // Fetching from our internal proxy to avoid CORS
            const res = await fetch(`/api/home?page=${page}`, { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const response: HomeResponse = await res.json();

            console.log(`[Pagination] Response for page ${page}:`, response);

            if (response.status === 'success' && response.data) {
                const fetchedAnime = response.data.anime || [];
                const filtered = fetchedAnime
                    .filter(item => !item.slug.toLowerCase().includes('batch'))
                    .slice(0, 15);

                console.log(`[Pagination] New filtered list size: ${filtered.length}`);

                setAnimeList(filtered);
                setCurrentPage(page);

                // Scroll to top of section
                const element = document.getElementById('rilisan-terbaru');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        } catch (error) {
            console.error('[Pagination] Failed to fetch page:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        fetchPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            fetchPage(currentPage - 1);
        }
    };

    return (
        <div className="space-y-12">

            {/* ── Section 1: Rilisan Terbaru ── */}
            <section id="rilisan-terbaru" className="scroll-mt-24">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-1 h-7 rounded-full"
                            style={{ background: `linear-gradient(180deg, ${PRIMARY}, ${SECONDARY})` }}
                        />
                        <h2 className="text-xl font-black uppercase tracking-tight text-white">
                            Rilisan Terbaru
                        </h2>
                    </div>
                </div>

                {/* Anime Grid */}
                <div className="relative">
                    {loading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-xl">
                            <Loader2 className="w-10 h-10 text-[#22c55e] animate-spin" />
                        </div>
                    )}
                    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6`}>
                        {animeList.map((anime, index) => (
                            <AnimeCard key={`${anime.slug}-${index}`} anime={anime} />
                        ))}
                    </div>
                </div>

                {/* Pagination Controls */}
                <div className="mt-10 flex justify-center gap-4">
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1 || loading}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm text-white transition-all transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:grayscale cursor-pointer disabled:cursor-not-allowed"
                        style={{ background: '#22c55e' }}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Sebelumnya
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={loading || animeList.length < 10} // If we have less than 10 items, it's likely the last page
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm text-white transition-all transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:grayscale cursor-pointer disabled:cursor-not-allowed"
                        style={{ background: '#22c55e' }}
                    >
                        Selanjutnya
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </section>

            {/* ── Section 2: Top 10 Trending ── */}
            <section
                className="rounded-2xl p-6 border"
                style={{
                    background: 'linear-gradient(135deg, #0d1525 0%, #0a1020 100%)',
                    borderColor: 'rgba(88, 208, 246, 0.12)',
                }}
            >
                <div className="flex items-center gap-2 mb-8">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <h2 className="text-lg font-black uppercase text-white">Top 10 Trending Hari Ini</h2>
                </div>

                <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
                    {trendingTop10.map((anime, index) => {
                        const img = anime.thumbnail || anime.image || '';
                        const isEpisode = isEpisodeSlug(anime.slug);
                        const href = isEpisode ? `/watch/${anime.slug}` : `/anime/${anime.slug}`;

                        return (
                            <Link
                                key={anime.slug}
                                href={href}
                                className="flex-shrink-0 w-40 group cursor-pointer relative pt-3"
                            >
                                <div
                                    className="absolute -top-0 left-0 z-10 font-black px-3 py-1 rounded-lg italic shadow-lg text-sm text-white"
                                    style={{
                                        background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
                                        boxShadow: `0 4px 12px rgba(88, 208, 246, 0.4)`,
                                    }}
                                >
                                    #{index + 1}
                                </div>

                                <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-md">
                                    <Image
                                        src={img}
                                        alt={anime.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="160px"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>

                                <p className="mt-3 font-bold text-xs text-center line-clamp-2 text-gray-300 transition-colors duration-200 group-hover:text-[#58d0f6]">
                                    {anime.title}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* ── Section 3: Batch Terbaru ── */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-1 h-7 rounded-full"
                            style={{ background: `linear-gradient(180deg, ${PRIMARY}, ${SECONDARY})` }}
                        />
                        <h2 className="text-xl font-black uppercase tracking-tight text-white">
                            Daftar Anime BATCH Terbaru
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {batchList.map((anime) => {
                        const img = anime.thumbnail || anime.image || '';
                        const href = `/anime/${anime.slug}`;

                        return (
                            <Link
                                key={anime.slug}
                                href={href}
                                className="group relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg"
                            >
                                <Image
                                    src={img}
                                    alt={anime.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, 20vw"
                                    unoptimized
                                />

                                <div
                                    className="absolute top-2 left-0 text-white text-[9px] font-black px-3 py-0.5 uppercase tracking-wider"
                                    style={{ background: 'linear-gradient(90deg, #ef4444, #dc2626)' }}
                                >
                                    COMPLETED
                                </div>

                                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                                    <span className="backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase" style={{ background: 'rgba(0,0,0,0.75)' }}>
                                        Batch
                                    </span>
                                    <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-[10px] font-black">
                                        SUB
                                    </span>
                                </div>

                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
                                    <h4 className="text-xs font-bold text-white mb-2 line-clamp-3">{anime.title}</h4>
                                    <span className="flex items-center gap-1 text-xs font-bold" style={{ color: PRIMARY }}>
                                        <Download className="w-3 h-3" />
                                        Download Now
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

        </div>
    );
}
