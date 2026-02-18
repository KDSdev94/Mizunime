import Image from 'next/image';
import Link from 'next/link';
import { Flame } from 'lucide-react';
import type { AnimeItem } from '@/lib/types';

interface AnimeCardProps {
    anime: AnimeItem;
    rank?: number; // optional rank for trending
}

const SECONDARY = '#2a75ae';

export function AnimeCard({ anime, rank }: AnimeCardProps) {
    const image = anime.thumbnail || anime.image || '/placeholder.png';
    const isEpisode = anime.slug.includes('episode') || anime.slug.includes('ep-');
    const href = isEpisode ? `/watch/${anime.slug}` : `/anime/${anime.slug}`;
    const isTrending = rank !== undefined && rank <= 3;

    return (
        <Link href={href} className="group block cursor-pointer">
            {/* Card image area */}
            <div
                className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:-translate-y-2"
            >
                <Image
                    src={image}
                    alt={anime.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />

                {/* Top-left badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {isTrending && (
                        <span
                            className="text-[10px] font-black text-white p-1 rounded-sm flex items-center"
                            style={{ background: '#dc2626' }}
                        >
                            <Flame className="w-3 h-3" />
                        </span>
                    )}
                    <span
                        className="text-[10px] font-black text-white px-1.5 py-0.5 rounded-sm"
                        style={{ background: SECONDARY }}
                    >
                        {anime.type || 'TV'}
                    </span>
                </div>

                {/* Bottom badges */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                    <span
                        className="backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-white"
                        style={{ background: 'rgba(0,0,0,0.8)' }}
                    >
                        {anime.latest_episode || anime.episode || 'Ep ?'}
                    </span>
                    <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-[10px] font-black">
                        SUB
                    </span>
                </div>

                {/* Hover glow border */}
                <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        boxShadow: `inset 0 0 0 2px rgba(88,208,246,0.5)`,
                    }}
                />
            </div>

            {/* Title */}
            <h3
                className="mt-3 text-sm font-bold text-center line-clamp-2 text-gray-300 transition-colors duration-200 group-hover:text-[#58d0f6]"
            >
                {anime.title}
            </h3>
        </Link>
    );
}
