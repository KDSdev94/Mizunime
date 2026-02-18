'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Loader2, X, ChevronRight, Menu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);

    // Track scroll for navbar background
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                // We keep isMobileSearchOpen as is, unless user specifically closes it or searches
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [searchQuery]);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowSuggestions(false);
            setIsMobileSearchOpen(false);
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? "bg-[#090a0c]/95 backdrop-blur-md border-b border-[#58d0f6]/10" : "bg-gradient-to-b from-black/80 to-transparent"
            }`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center h-16 md:h-20 gap-4 relative">

                    {/* Mobile: Hamburger Button (Left) */}
                    <button
                        onClick={() => {
                            setIsMobileMenuOpen(!isMobileMenuOpen);
                            setIsMobileSearchOpen(false);
                        }}
                        className="md:hidden w-10 h-10 flex items-center justify-start rounded-full text-slate-300 hover:text-[#58d0f6] transition-colors z-20"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Logo (Center Mobile, Left Desktop) */}
                    <div className="flex-1 md:flex-none flex items-center justify-center md:justify-start">
                        <Link href="/" className="z-20 flex absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:left-auto">
                            <Image
                                src="/header.png"
                                alt="Mizunime"
                                width={140}
                                height={38}
                                className="h-10 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                                priority
                                unoptimized
                            />
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-1 ml-8">
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

                    {/* Right Section: Search & Additional Buttons */}
                    <div className="flex items-center gap-4 flex-none justify-end z-20 md:flex-1">
                        {/* Search Desktop */}
                        <div className="relative hidden md:block w-full max-w-[300px]" ref={searchRef}>
                            <form onSubmit={handleSearch} className="relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Search className="w-4 h-4 text-white/50 group-focus-within:text-[#58d0f6] transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari Anime..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.length >= 3 && setShowSuggestions(true)}
                                    className="w-full bg-[#16181d] border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:bg-[#1c1d24] focus:border-[#58d0f6]/50 focus:ring-2 focus:ring-[#58d0f6]/20 transition-all font-medium"
                                />
                                {isSearching && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 className="w-4 h-4 animate-spin text-[#58d0f6]" />
                                    </div>
                                )}
                            </form>

                            {/* Suggestion Dropdown (Desktop) */}
                            <AnimatePresence>
                                {showSuggestions && suggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full right-0 mt-4 w-[400px] max-h-[60vh] overflow-y-auto bg-[#0d0e12]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-2 z-50"
                                    >
                                        <div className="space-y-1">
                                            {suggestions.map((anime) => {
                                                const isEp = isEpisodeSlug(anime.slug);
                                                const href = isEp ? `/anime/${getAnimeSlugFromEpisode(anime.slug)}` : `/anime/${anime.slug}`;
                                                const displayTitle = anime.title.split(' Episode ')[0];

                                                return (
                                                    <Link key={anime.slug} href={href} onClick={() => setShowSuggestions(false)}>
                                                        <div className="gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group flex items-start">
                                                            <div className="relative w-12 h-16 rounded-md overflow-hidden flex-shrink-0 bg-slate-800 shadow-sm">
                                                                <Image
                                                                    src={anime.thumbnail || anime.image || ''}
                                                                    alt={anime.title}
                                                                    fill
                                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                                    sizes="48px"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-sm font-semibold text-white group-hover:text-[#58d0f6] transition-colors truncate">{displayTitle}</h4>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#58d0f6]/20 text-[#58d0f6] font-bold">
                                                                        {isEp ? 'EP' : anime.type || 'TV'}
                                                                    </span>
                                                                    <span className="text-xs text-white/40 truncate">{anime.latest_episode}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                            <div className="border-t border-white/5 mt-2 pt-2">
                                                <button
                                                    onClick={() => handleSearch()}
                                                    className="w-full text-center py-2 text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
                                                >
                                                    Lihat Semua Hasil
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Search Toggle Button */}
                        <button
                            onClick={() => {
                                setIsMobileSearchOpen(!isMobileSearchOpen);
                                setIsMobileMenuOpen(false);
                            }}
                            className="md:hidden w-10 h-10 flex items-center justify-end text-slate-300 hover:text-[#58d0f6] transition-colors"
                        >
                            {isMobileSearchOpen ? <X className="w-6 h-6" /> : <Search className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar Expansion (Exactly below navbar) */}
                <AnimatePresence>
                    {isMobileSearchOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden bg-[#0d0e12]/60 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                            ref={mobileSearchRef}
                        >
                            <div className="p-4 pt-2">
                                <form onSubmit={handleSearch} className="relative">
                                    <div className="relative flex items-center bg-[#1c1d24]/60 border border-white/10 rounded-xl focus-within:border-[#58d0f6]/50 focus-within:ring-1 focus-within:ring-[#58d0f6]/50 transition-all backdrop-blur-md">
                                        <Search className="absolute left-4 w-5 h-5 text-white/30" />
                                        <input
                                            type="text"
                                            autoFocus
                                            placeholder="Cari Anime..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-transparent py-4 pl-12 pr-4 text-base text-white placeholder:text-white/20 focus:outline-none"
                                        />
                                        {isSearching && (
                                            <div className="absolute right-4">
                                                <Loader2 className="w-5 h-5 animate-spin text-[#58d0f6]" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Mobile Search Results */}
                                    {searchQuery.length >= 3 && suggestions.length > 0 && (
                                        <div className="mt-2 max-h-[50vh] overflow-y-auto bg-[#0d0e12]/40 backdrop-blur-2xl border border-white/10 rounded-xl p-2">
                                            <div className="space-y-1">
                                                {suggestions.map((anime) => {
                                                    const isEp = isEpisodeSlug(anime.slug);
                                                    const href = isEp ? `/anime/${getAnimeSlugFromEpisode(anime.slug)}` : `/anime/${anime.slug}`;
                                                    const displayTitle = anime.title.split(' Episode ')[0];

                                                    return (
                                                        <Link key={anime.slug} href={href} onClick={() => setIsMobileSearchOpen(false)}>
                                                            <div className="gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group flex items-start">
                                                                <div className="relative w-12 h-16 rounded-md overflow-hidden flex-shrink-0 bg-slate-800">
                                                                    <Image
                                                                        src={anime.thumbnail || anime.image || ''}
                                                                        alt={anime.title}
                                                                        fill
                                                                        className="object-cover"
                                                                        sizes="48px"
                                                                    />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-bold text-slate-200 line-clamp-1">{displayTitle}</p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <span className="text-[9px] text-slate-400 bg-black/40 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                                                            {isEp ? 'EP' : anime.type || 'TV'}
                                                                        </span>
                                                                        <span className="text-[9px] text-[#58d0f6] font-bold">
                                                                            {anime.latest_episode}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Menu (Hamburger content) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed top-16 left-0 right-0 bg-[#0d0e12]/95 backdrop-blur-xl border-b border-white/10 z-[60] md:hidden overflow-hidden"
                    >
                        <nav className="flex flex-col p-4 gap-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-1">Menu Utama</p>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-3 rounded-xl transition-colors font-medium flex items-center justify-between bg-[#1c1d24] border border-white/5 text-white/80 hover:text-[#58d0f6] active:bg-white/10"
                                >
                                    {link.label}
                                    <ChevronRight className="w-4 h-4 text-slate-500" />
                                </Link>
                            ))}

                            <div className="pt-4">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Kategori Populer</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {supportLinks.map((link) => (
                                        <Link
                                            key={link}
                                            href={`/search?q=${encodeURIComponent(link)}`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="px-4 py-2 bg-white/5 rounded-xl text-xs font-semibold text-slate-400 text-center hover:bg-white/10 active:bg-white/10"
                                        >
                                            {link}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
