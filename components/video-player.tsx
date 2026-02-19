'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ChevronLeft, ChevronRight, List, Loader2 } from 'lucide-react';
import type { StreamingServer, DownloadLink } from '@/lib/types';

// List of servers that don't support sandbox (will show errors)
const NO_SANDBOX_SERVERS = ['vidhide', 'uranus hd', 'hd hemat'];

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
    const [playerKey, setPlayerKey] = useState(0);

    // Check if current server supports sandbox
    const currentServerName = servers[currentServer]?.name?.toLowerCase() || '';
    const useSandbox = !NO_SANDBOX_SERVERS.some(name => currentServerName.includes(name.toLowerCase()));

    const handleServerChange = (index: number) => {
        setCurrentServer(index);
        setPlayerKey(prev => prev + 1);
    };

    const reloadPlayer = () => {
        setPlayerKey(prev => prev + 1);
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
            {/* Player Container */}
            <div className="relative w-full aspect-video mb-4">
                <Card className="w-full h-full bg-black rounded-xl overflow-hidden shadow-2xl border-white/10">
                    <iframe
                        key={`${currentServer}-${playerKey}`}
                        src={servers[currentServer].url}
                        className="w-full h-full"
                        allowFullScreen
                        allow="autoplay; fullscreen; encrypted-media"
                        {...(useSandbox && {
                            sandbox: "allow-same-origin allow-scripts allow-forms",
                            referrerPolicy: "no-referrer"
                        })}
                    />
                </Card>
            </div>

            {/* Player Tools */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 px-1 gap-2 sm:gap-0">
                <button
                    onClick={reloadPlayer}
                    className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors bg-white/5 px-3 py-1.5 rounded-full"
                >
                    <Loader2 className="w-3 h-3" />
                    Refresh Player
                </button>
                <div className="text-[10px] text-slate-500 italic font-medium">
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
