'use client';

import { AdScript } from './ad-script';
import Image from 'next/image';

const PRIMARY = '#58d0f6';

export function Footer() {
    return (
        <>
            <AdScript />
            <footer
                className="py-12 mt-12 bg-[#090a0c] dark:bg-[#090a0c] border-t border-[#58d0f6]/10"
            >
                <div className="container mx-auto px-4 text-center">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/header.png"
                            alt="Mizunime"
                            width={160}
                            height={44}
                            className="h-20 w-auto object-contain"
                            unoptimized
                        />
                    </div>

                    {/* Description */}
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
                        Nonton anime subtitle indonesia gratis dengan kualitas terbaik. Update tercepat setiap hari
                        untuk anime on-going dan tamat. Nikmati pengalaman streaming terbaik hanya di Mizunime.
                    </p>



                    {/* Copyright */}
                    <div
                        className="mt-8 pt-8 text-[10px] font-bold uppercase tracking-widest text-slate-500"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                    >
                        © 2026 Mizunime - All Rights Reserved
                    </div>
                </div>
            </footer>

            {/* Histats.com Analytics */}
            <script
                type="text/javascript"
                dangerouslySetInnerHTML={{
                    __html: `
                        var _Hasync= _Hasync|| [];
                        _Hasync.push(['Histats.start', '1,4981556,4,0,0,0,00010000']);
                        _Hasync.push(['Histats.fasi', '1']);
                        _Hasync.push(['Histats.track_hits', '']);
                        (function() {
                            var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
                            hs.src = ('//s10.histats.com/js15_as.js');
                            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
                        })();
                    `
                }}
            />
            <noscript>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="//sstatic1.histats.com/0.gif?4981556&101" alt="" />
            </noscript>
        </>
    );
}
