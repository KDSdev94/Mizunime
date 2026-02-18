'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import type { AnimeItem } from '@/lib/types';
import { isEpisodeSlug } from '@/lib/utils-episode';

interface HomeSidebarProps {
    trendingAnime: AnimeItem[];
    newSeries: AnimeItem[];
}

const PRIMARY = '#58d0f6';
const SECONDARY = '#2a75ae';

export function HomeSidebar({ trendingAnime, newSeries }: HomeSidebarProps) {
    const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'all'>('weekly');
    const [displayList, setDisplayList] = useState<AnimeItem[]>(trendingAnime.slice(0, 7));
    const [isChanging, setIsChanging] = useState(false);

    // Update display list when tab changes
    useEffect(() => {
        setIsChanging(true);

        // Simulate a small delay for better feel
        const timer = setTimeout(() => {
            let newList: AnimeItem[] = [];
            if (activeTab === 'weekly') {
                newList = trendingAnime.slice(0, 7);
            } else if (activeTab === 'monthly') {
                // Return a different slice or shuffled
                newList = trendingAnime.slice(7, 14);
                if (newList.length === 0) newList = [...trendingAnime].reverse().slice(0, 7);
            } else {
                // 'all' tab - shuffle or show middle slice
                newList = trendingAnime.slice(4, 11);
                if (newList.length === 0) newList = trendingAnime.slice(0, 7);
            }

            setDisplayList(newList);
            setIsChanging(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [activeTab, trendingAnime]);

    return (
        <div className="space-y-8">

            {/* ── Widget 1: Trending Anime ── */}
            <div
                className="rounded-2xl overflow-hidden border"
                style={{
                    background: 'linear-gradient(135deg, #0d1525 0%, #0a1020 100%)',
                    borderColor: 'rgba(88, 208, 246, 0.12)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                }}
            >
                {/* Header */}
                <div
                    className="px-6 py-4 border-b"
                    style={{ borderColor: 'rgba(88, 208, 246, 0.1)', background: 'rgba(88,208,246,0.04)' }}
                >
                    <h2 className="text-base font-black uppercase tracking-tight text-white">
                        Trending Anime
                    </h2>
                </div>

                <div className="p-4">
                    {/* Tab switcher */}
                    <div
                        className="flex rounded-xl p-1 mb-5"
                        style={{ background: 'rgba(0,0,0,0.3)' }}
                    >
                        {(['weekly', 'monthly', 'all'] as const).map((tab) => {
                            const labels = { weekly: 'Mingguan', monthly: 'Bulanan', all: 'Semua' };
                            const active = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className="flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200"
                                    style={{
                                        background: active
                                            ? `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`
                                            : 'transparent',
                                        color: active ? '#fff' : '#64748b',
                                        boxShadow: active ? `0 2px 10px rgba(88,208,246,0.3)` : 'none',
                                    }}
                                >
                                    {labels[tab]}
                                </button>
                            );
                        })}
                    </div>

                    {/* Trending list */}
                    <div className={`space-y-4 transition-opacity duration-300 ${isChanging ? 'opacity-30' : 'opacity-100'}`}>
                        {displayList.map((anime, index) => {
                            const img = anime.thumbnail || anime.image || '';
                            const isEpisode = isEpisodeSlug(anime.slug);
                            const href = isEpisode ? `/watch/${anime.slug}` : `/anime/${anime.slug}`;

                            return (
                                <Link
                                    key={`${anime.slug}-${activeTab}`}
                                    href={href}
                                    className="flex gap-3 items-start group"
                                >
                                    {/* Rank number */}
                                    <div
                                        className="w-7 text-base font-black flex-shrink-0 flex items-center justify-center pt-3 transition-colors duration-200"
                                        style={{ color: '#475569' }}
                                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = PRIMARY; }}
                                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#475569'; }}
                                    >
                                        {index + 1}
                                    </div>

                                    {/* Thumbnail */}
                                    <div className="relative w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                                        <Image
                                            src={img}
                                            alt={anime.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="56px"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4
                                            className="text-sm font-bold line-clamp-2 text-gray-200 transition-colors duration-200 group-hover:text-[#58d0f6]"
                                        >
                                            {anime.title}
                                        </h4>
                                        <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">
                                            {anime.type} • {anime.latest_episode || 'Ongoing'}
                                        </p>
                                        {/* Stars */}
                                        <div className="flex items-center gap-1 mt-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4].map((s) => (
                                                    <Star
                                                        key={s}
                                                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                                                    />
                                                ))}
                                                <Star className="w-3 h-3 text-slate-600" />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {(8.5 - index * 0.2).toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Widget 2: New Series / Movie ── */}
            <div
                className="rounded-2xl overflow-hidden border"
                style={{
                    background: 'linear-gradient(135deg, #0d1525 0%, #0a1020 100%)',
                    borderColor: 'rgba(88, 208, 246, 0.12)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                }}
            >
                {/* Header */}
                <div
                    className="px-6 py-4 border-b"
                    style={{ borderColor: 'rgba(88, 208, 246, 0.1)', background: 'rgba(88,208,246,0.04)' }}
                >
                    <h2 className="text-base font-black uppercase tracking-tight text-white">
                        New Series / Movie
                    </h2>
                </div>

                <div className="p-4 space-y-5">
                    {newSeries.map((anime) => {
                        const img = anime.thumbnail || anime.image || '';
                        const isEpisode = isEpisodeSlug(anime.slug);
                        const href = isEpisode ? `/watch/${anime.slug}` : `/anime/${anime.slug}`;

                        return (
                            <Link
                                key={anime.slug}
                                href={href}
                                className="flex gap-3 group cursor-pointer"
                            >
                                {/* Thumbnail */}
                                <div className="relative w-12 h-[68px] rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                                    <Image
                                        src={img}
                                        alt={anime.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="48px"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h4
                                        className="text-xs font-bold line-clamp-2 text-gray-200 transition-colors duration-200 group-hover:text-[#58d0f6]"
                                    >
                                        {anime.title}
                                    </h4>
                                    <p className="text-[9px] text-slate-500 mt-1">
                                        {anime.type}
                                    </p>
                                    <span
                                        className="inline-block mt-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full"
                                        style={{
                                            background: 'rgba(88,208,246,0.1)',
                                            color: PRIMARY,
                                            border: '1px solid rgba(88,208,246,0.2)',
                                        }}
                                    >
                                        {anime.latest_episode || 'New'}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
