'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, Flame, Star } from 'lucide-react';
import type { AnimeItem } from '@/lib/types';
import { isEpisodeSlug, getAnimeSlugFromEpisode } from '@/lib/utils-episode';

interface HeroSliderProps {
    animeList: AnimeItem[];
}

const PRIMARY = '#58d0f6';
const SECONDARY = '#2a75ae';

export function HeroSlider({ animeList }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % animeList.length);
        }, 5500);
        return () => clearInterval(interval);
    }, [animeList.length]);

    if (!animeList || animeList.length === 0) return null;

    return (
        <div className="relative w-full h-[420px] md:h-[550px] overflow-hidden group">
            {/* Slides */}
            {animeList.map((anime, index) => {
                const img = anime.thumbnail || anime.image || '';
                const isEpisode = isEpisodeSlug(anime.slug);
                const href = isEpisode ? `/watch/${anime.slug}` : `/anime/${anime.slug}`;

                return (
                    <div
                        key={anime.slug}
                        className={`absolute inset-0 transition-opacity duration-700 ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                        {/* Background image */}
                        <Image
                            src={img}
                            alt={anime.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />

                        {/* Gradient overlay — matches HTML: to top + to right */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `
                                    linear-gradient(to top, #0f1115 10%, transparent 100%),
                                    linear-gradient(to right, #0f1115 30%, transparent 70%)
                                `,
                            }}
                        />

                        {/* Content */}
                        <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-center">
                            <div className="max-w-2xl space-y-5">

                                {/* Trending badge */}
                                <div
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest animate-pulse"
                                    style={{ background: '#dc2626', color: '#fff' }}
                                >
                                    <Flame className="w-3.5 h-3.5" />
                                    NEw
                                </div>

                                {/* Title */}
                                <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-lg leading-tight">
                                    {anime.title}
                                </h1>

                                {/* Meta row */}
                                <div className="flex items-center gap-4 text-white/90 font-semibold text-sm">
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        <Star className="w-4 h-4 fill-yellow-400" />
                                        <span>8.5</span>
                                    </div>
                                    <span className="text-white/40">•</span>
                                    <span>2026</span>
                                    <span className="text-white/40">•</span>
                                    <span
                                        className="px-2 py-0.5 rounded text-xs"
                                        style={{ background: 'rgba(255,255,255,0.15)' }}
                                    >
                                        {anime.type || 'TV Series'}
                                    </span>
                                    {anime.latest_episode && (
                                        <>
                                            <span className="text-white/40">•</span>
                                            <span
                                                className="px-2 py-0.5 rounded text-xs font-bold"
                                                style={{
                                                    background: `rgba(88,208,246,0.15)`,
                                                    color: PRIMARY,
                                                    border: `1px solid rgba(88,208,246,0.3)`,
                                                }}
                                            >
                                                {anime.latest_episode}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-3 md:gap-4 pt-2">
                                    <Link
                                        href={href}
                                        className="flex items-center gap-2 px-5 py-2.5 md:px-7 md:py-3.5 rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                                        style={{
                                            background: `linear-gradient(135deg, ${PRIMARY}, ${SECONDARY})`,
                                            color: '#fff',
                                            boxShadow: `0 4px 18px rgba(88,208,246,0.4)`,
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 24px rgba(88,208,246,0.6)`;
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 18px rgba(88,208,246,0.4)`;
                                        }}
                                    >
                                        <Play className="w-3.5 h-3.5 md:w-4 md:h-4 fill-white" />
                                        Tonton Sekarang
                                    </Link>

                                    <Link
                                        href={isEpisode ? `/anime/${getAnimeSlugFromEpisode(anime.slug)}` : `/anime/${anime.slug}`}
                                        className="flex items-center gap-2 px-5 py-2.5 md:px-7 md:py-3.5 rounded-lg md:rounded-xl font-bold text-xs md:text-sm text-white transition-all duration-300 hover:bg-white/20"
                                        style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                        }}
                                    >
                                        <Info className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        Info Lengkap
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Slide indicators */}
            <div className="absolute bottom-6 right-6 md:right-12 flex gap-2 z-20">
                {animeList.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className="rounded-full transition-all duration-300"
                        style={{
                            width: index === currentIndex ? '28px' : '8px',
                            height: '8px',
                            background: index === currentIndex
                                ? `linear-gradient(90deg, ${PRIMARY}, ${SECONDARY})`
                                : 'rgba(255,255,255,0.35)',
                            boxShadow: index === currentIndex ? `0 0 10px rgba(88,208,246,0.6)` : 'none',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
