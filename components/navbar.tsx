'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Loader2, X, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { search } from '@/lib/api';
import type { AnimeItem } from '@/lib/types';
import { getAnimeSlugFromEpisode, isEpisodeSlug } from '@/lib/utils-episode';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Jadwal Rilis', href: '/schedule' },
    { label: 'Batch', href: '/batch' },
];

const supportLinks = ['Live Action'];

export function Navbar() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<AnimeItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);

    // Debounced search for suggestions
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length >= 3) {
                setIsSearching(true);
                try {
                    const response = await search(searchQuery, 1);
                    setSuggestions(response.data.anime.slice(0, 6));
                    setShowSuggestions(true);
                } catch (error) {
                    console.error('Search error:', error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle click outside to close suggestions
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node) &&
                mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
                if (!searchQuery) setIsMobileSearchOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [searchQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowSuggestions(false);
            setIsMobileSearchOpen(false);
        }
    };

    return (
        <nav className="sticky top-0 z-50 shadow-lg bg-[#090a0c] border-b border-[#58d0f6]/10">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 gap-4">

                    {/* Left: Logo & Nav Links */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex-shrink-0">
                            <Image
                                src="/header.png"
                                alt="Mizunime"
                                width={140}
                                height={38}
                                className="h-15 w-auto object-contain"
                                priority
                                unoptimized
                            />
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-3 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="h-4 w-[1px] bg-white/10 mx-2" />

                            {supportLinks.map((link) => (
                                <Link
                                    key={link}
                                    href={`/search?q=${encodeURIComponent(link)}`}
                                    className="px-2 py-2 text-xs font-semibold text-slate-500 hover:text-[#58d0f6] transition-colors"
                                >
                                    {link}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right: Search (Desktop) */}
                    <div className="flex items-center gap-4 flex-1 max-w-md justify-end">
                        {/* Search Desktop */}
                        <div className="relative hidden sm:block flex-1 max-w-[320px]" ref={searchRef}>
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari Anime..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.length >= 3 && setShowSuggestions(true)}
                                    className="w-full bg-[#16181d] border border-white/10 rounded-full pl-4 pr-10 py-1.5 text-xs text-white focus:outline-none focus:border-[#58d0f6]/50 transition-all font-medium"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    {isSearching ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#58d0f6]" />
                                    ) : (
                                        <button type="submit" className="text-slate-500 hover:text-[#58d0f6] transition-colors">
                                            <Search className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </form>

                            {/* Suggestion Dropdown (Desktop) */}
                            {showSuggestions && !isMobileSearchOpen && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#16181d] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                                    <div className="py-2">
                                        {suggestions.map((anime) => {
                                            const isEp = isEpisodeSlug(anime.slug);
                                            const href = isEp ? `/anime/${getAnimeSlugFromEpisode(anime.slug)}` : `/anime/${anime.slug}`;
                                            const displayTitle = anime.title.split(' Episode ')[0];

                                            return (
                                                <Link
                                                    key={anime.slug}
                                                    href={href}
                                                    onClick={() => setShowSuggestions(false)}
                                                    className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors group"
                                                >
                                                    <div className="relative w-10 h-14 rounded overflow-hidden flex-shrink-0 bg-slate-800">
                                                        <Image
                                                            src={anime.thumbnail || anime.image || ''}
                                                            alt={anime.title}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                            sizes="40px"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-slate-200 group-hover:text-[#58d0f6] transition-colors line-clamp-1">
                                                            {displayTitle}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            {anime.latest_episode && (
                                                                <span className="text-[10px] text-slate-500 bg-black/30 px-1.5 py-0.5 rounded">
                                                                    {anime.latest_episode}
                                                                </span>
                                                            )}
                                                            <span className="text-[10px] text-[#58d0f6] font-medium tracking-wide">
                                                                {isEp ? 'Episode' : anime.type || 'Series'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                        <div className="border-t border-white/5 mt-1 pt-1">
                                            <button
                                                onClick={handleSearch}
                                                className="w-full text-center py-2 text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
                                            >
                                                Lihat Semua Hasil
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Header Buttons */}
                        <div className="flex items-center gap-2 sm:hidden">
                            <button
                                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                                className="p-2.5 rounded-full text-slate-300 hover:text-white bg-white/5 transition-colors"
                            >
                                {isMobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Search Panel (Expansion below Navbar) */}
            {isMobileSearchOpen && (
                <div
                    className="sm:hidden bg-[#0d0e12] border-t border-white/5 animate-in slide-in-from-top duration-300"
                    ref={mobileSearchRef}
                >
                    <div className="px-4 py-4 space-y-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Cari Judul Anime..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#1c1d24] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#58d0f6]/50 transition-all font-medium"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                {isSearching ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-[#58d0f6]" />
                                ) : (
                                    <button type="submit" className="text-slate-500">
                                        <Search className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Mobile Suggestions Inside Panel */}
                        {suggestions.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saran Anime</span>
                                    <button onClick={handleSearch} className="text-[10px] font-bold text-[#58d0f6] flex items-center gap-1">
                                        LIHAT SEMUA <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="grid gap-2">
                                    {suggestions.map((anime) => {
                                        const isEp = isEpisodeSlug(anime.slug);
                                        const href = isEp ? `/anime/${getAnimeSlugFromEpisode(anime.slug)}` : `/anime/${anime.slug}`;
                                        const displayTitle = anime.title.split(' Episode ')[0];

                                        return (
                                            <Link
                                                key={anime.slug}
                                                href={href}
                                                onClick={() => {
                                                    setIsMobileSearchOpen(false);
                                                    setShowSuggestions(false);
                                                }}
                                                className="flex items-center gap-3 p-2 bg-[#1c1d24] rounded-xl border border-white/5 active:bg-white/10 transition-colors"
                                            >
                                                <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                                                    <Image
                                                        src={anime.thumbnail || anime.image || ''}
                                                        alt={anime.title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="48px"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-200 line-clamp-1">
                                                        {displayTitle}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[9px] text-slate-400 bg-black/40 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                                            {isEp ? 'EP' : anime.type || 'TV'}
                                                        </span>
                                                        <span className="text-[9px] text-[#58d0f6] font-bold">
                                                            {anime.latest_episode}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
