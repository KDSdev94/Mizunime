'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ChevronLeft, ChevronRight, List, Loader2 } from 'lucide-react';
import type { StreamingServer, DownloadLink } from '@/lib/types';

interface VideoPlayerProps {
    title: string;
    servers: StreamingServer[];
    downloads: DownloadLink[];
    prevEpisode?: string | null;
    nextEpisode?: string | null;
    animeSlug?: string;
}

export function VideoPlayer({ title, servers, downloads, prevEpisode, nextEpisode, animeSlug }: VideoPlayerProps) {
    const [currentServer, setCurrentServer] = useState(0);
    const [showOverlay, setShowOverlay] = useState(true);
    const [isLightsOff, setIsLightsOff] = useState(false);
    const [playerKey, setPlayerKey] = useState(0);

    const handleServerChange = (index: number) => {
        setCurrentServer(index);
        setShowOverlay(true);
        setPlayerKey(prev => prev + 1); // Refresh player on server change
    };

    const reloadPlayer = () => {
        setPlayerKey(prev => prev + 1);
        setShowOverlay(true);
    };

    if (!servers || servers.length === 0) {
        return (
            <Card className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border-white/10 mb-6">
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                    <p>Stream not available.</p>
                </div>
            </Card>
        );
    }

    return (
        <>
            {/* Lights Out Overlay */}
            {isLightsOff && (
                <div
                    className="fixed inset-0 bg-black/95 z-[100] transition-opacity duration-500 cursor-pointer"
                    onClick={() => setIsLightsOff(false)}
                    title="Klik untuk menyalakan lampu"
                />
            )}

            {/* Player Container */}
            <div className={`relative w-full aspect-video mb-4 ${isLightsOff ? 'z-[101] ring-4 ring-blue-500/50' : ''}`}>
                <Card className="w-full h-full bg-black rounded-xl overflow-hidden shadow-2xl border-white/10">
                    <iframe
                        key={`${currentServer}-${playerKey}`}
                        src={servers[currentServer].url}
                        className="w-full h-full"
                        allowFullScreen
                        allow="autoplay; fullscreen"
                    />
                </Card>

                {/* Ad-Blocker / Click Protection Overlay */}
                {showOverlay && (
                    <div
                        className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowOverlay(false);
                        }}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                                <List className="w-8 h-8 text-white fill-white" />
                            </div>
                            <span className="text-white font-bold text-lg tracking-wide bg-black/40 px-4 py-2 rounded-lg">
                                Klik untuk Play
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Player Tools */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 px-1 gap-2 sm:gap-0">
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsLightsOff(!isLightsOff)}
                        className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors bg-white/5 px-3 py-1.5 rounded-full"
                    >
                        <div className={`w-2 h-2 rounded-full ${isLightsOff ? 'bg-yellow-400 animate-pulse' : 'bg-slate-500'}`} />
                        {isLightsOff ? 'Nyalakan Lampu' : 'Matikan Lampu'}
                    </button>
                    <button
                        onClick={reloadPlayer}
                        className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors bg-white/5 px-3 py-1.5 rounded-full"
                    >
                        <Loader2 className="w-3 h-3" />
                        Refresh Player
                    </button>
                </div>
                <div className="text-[10px] text-slate-500 italic font-medium mt-2 sm:mt-0">
                    Iklan didalam player adalah dari server video
                </div>
            </div>

            {/* Episode Navigation */}
            {(prevEpisode || nextEpisode || animeSlug) && (
                <div className="flex gap-2 mb-8 flex-wrap justify-center">
                    <Button
                        asChild={!!prevEpisode}
                        disabled={!prevEpisode}
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-1"
                    >
                        {prevEpisode ? (
                            <Link href={`/watch/${prevEpisode}`}>
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </Link>
                        ) : (
                            <>
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </>
                        )}
                    </Button>

                    {animeSlug && (
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                        >
                            <Link href={`/anime/${animeSlug}`}>
                                <List className="w-4 h-4" />
                                Episode List
                            </Link>
                        </Button>
                    )}

                    <Button
                        asChild={!!nextEpisode}
                        disabled={!nextEpisode}
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-1"
                    >
                        {nextEpisode ? (
                            <Link href={`/watch/${nextEpisode}`}>
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        ) : (
                            <>
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </div>
            )}

            <h1 className="text-xl md:text-2xl font-bold text-white mb-6">{title}</h1>

            {/* Streaming Servers */}
            {servers.length > 1 && (
                <Card className="bg-slate-900/50 p-6 border-white/5 mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">Streaming Servers</h3>
                    <div className="flex flex-wrap gap-2">
                        {servers.map((server, index) => (
                            <Button
                                key={index}
                                onClick={() => handleServerChange(index)}
                                variant={currentServer === index ? 'default' : 'secondary'}
                                size="sm"
                                className={currentServer === index ? 'bg-blue-600 hover:bg-blue-700' : ''}
                            >
                                {server.name}
                            </Button>
                        ))}
                    </div>
                </Card>
            )}

            {/* Download Links */}
            <Card className="bg-slate-900/50 p-6 border-white/5">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-green-500" />
                    Download Links
                </h3>

                <div className="space-y-3">
                    {downloads.length > 0 ? (
                        downloads.map((dl, index) => (
                            <div
                                key={index}
                                className="flex flex-col sm:flex-row sm:items-center justify-between bg-black/20 p-4 rounded-lg border border-white/5 hover:border-green-500/30 transition-colors"
                            >
                                <span className="text-sm text-white font-semibold mb-2 sm:mb-0 flex items-center gap-2">
                                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">{dl.quality}</span>
                                </span>
                                <div className="flex gap-2 flex-wrap">
                                    {dl.links.map((link, linkIndex) => (
                                        <Button
                                            key={linkIndex}
                                            asChild
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-500 text-white"
                                        >
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                                <Download className="w-3 h-3" />
                                                {link.provider}
                                            </a>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No download links available.</p>
                    )}
                </div>
            </Card>
        </>
    );
}
