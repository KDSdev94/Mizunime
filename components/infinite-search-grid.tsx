'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimeCard } from '@/components/anime-card';
import { SearchResponse, AnimeItem } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export function InfiniteSearchGrid({
    initialAnime,
    initialPage,
    query
}: {
    initialAnime: AnimeItem[],
    initialPage: number,
    query: string
}) {
    const [anime, setAnime] = useState<AnimeItem[]>(initialAnime);
    const [page, setPage] = useState(initialPage);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setAnime(initialAnime);
        setPage(initialPage);
        setHasMore(true);
    }, [initialAnime, initialPage, query]);

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const nextPage = page + 1;
            const res = await fetch(`https://rgsordertracking.com/animekompi/endpoints/search.php?q=${encodeURIComponent(query)}&page=${nextPage}`);
            const data: SearchResponse = await res.json();

            if (data.status === 'success' && data.data.anime.length > 0) {
                setAnime(prev => [...prev, ...data.data.anime]);
                setPage(nextPage);
                if (nextPage >= data.data.total_pages) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Search load more error:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {anime.map((item, index) => (
                    <AnimeCard key={`${item.slug}-${index}`} anime={item} />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center pt-8">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-8 py-3 rounded-full bg-[#58d0f6] text-black font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Memuat...' : 'Muat Lebih Banyak'}
                    </button>
                </div>
            )}
        </div>
    );
}
