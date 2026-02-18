import { Suspense } from 'react';
import { search } from '@/lib/api';
import { InfiniteSearchGrid } from '@/components/infinite-search-grid';
import { MainLayout } from '@/components/main-layout';

export const metadata = {
    title: 'Hasil Pencarian | Mizunime',
};

async function SearchResults({ query }: { query: string }) {
    if (!query) return <div className="text-center text-slate-500 py-20">Masukkan kata kunci untuk mencari anime.</div>;

    try {
        const response = await search(query, 1);
        const results = response.data.anime || [];

        return (
            <MainLayout>
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-7 rounded-full bg-[#58d0f6]" />
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                            Hasil Pencarian: <span className="text-[#58d0f6]">{query}</span>
                        </h1>
                    </div>

                    {results.length > 0 ? (
                        <InfiniteSearchGrid initialAnime={results} initialPage={1} query={query} />
                    ) : (
                        <div className="text-center py-20 bg-black/5 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/10">
                            <p className="text-slate-400 font-bold italic">Anime tidak ditemukan.</p>
                        </div>
                    )}
                </div>
            </MainLayout>
        );
    } catch (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-400 font-bold">Terjadi kesalahan saat mencari anime.</p>
            </div>
        );
    }
}

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const params = await searchParams;
    const query = params.q || '';

    return (
        <Suspense fallback={<div className="text-center py-20 text-white font-bold">Mencari...</div>}>
            <SearchResults query={query} />
        </Suspense>
    );
}
