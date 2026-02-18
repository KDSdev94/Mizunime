import { Suspense } from 'react';
import { getSchedule } from '@/lib/api';
import { AnimeCard } from '@/components/anime-card';
import { MainLayout } from '@/components/main-layout';

async function ScheduleContent() {
    const response = await getSchedule();
    const scheduleData = response.data;

    const dayOrder = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const currentDayIndex = new Date().getDay();

    const sortedDays = Object.entries(scheduleData).sort(([dayA], [dayB]) => {
        const indexA = dayOrder.indexOf(dayA);
        const indexB = dayOrder.indexOf(dayB);
        const offsetA = (indexA - currentDayIndex + 7) % 7;
        const offsetB = (indexB - currentDayIndex + 7) % 7;
        return offsetA - offsetB;
    });

    return (
        <MainLayout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-8">
                    Weekly Schedule
                </h1>

                <div className="space-y-8">
                    {sortedDays.map(([day, animeList]) => {
                        if (!animeList || animeList.length === 0) return null;
                        const uniqueAnime = Array.from(
                            new Map(animeList.map(anime => [anime.slug, anime])).values()
                        );
                        const isToday = dayOrder[currentDayIndex] === day;

                        return (
                            <div key={day}>
                                <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-3 flex items-center gap-2">
                                    {day}
                                    {isToday && (
                                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Today</span>
                                    )}
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                                    {uniqueAnime.map((anime, index) => (
                                        <AnimeCard key={`${day}-${anime.slug}-${index}`} anime={anime} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </MainLayout>
    );
}

function ScheduleLoading() {
    return (
        <div className="container mx-auto px-4 pt-16 md:pt-20 pb-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3">
                    <div className="h-8 w-48 bg-slate-900 dark:bg-slate-800 rounded mb-8 animate-pulse" />
                    <div className="space-y-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i}>
                                <div className="h-6 w-32 bg-slate-900 dark:bg-slate-800 rounded mb-4 animate-pulse" />
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Array.from({ length: 4 }).map((_, j) => (
                                        <div key={j} className="aspect-[3/4] bg-slate-900 dark:bg-slate-800 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:w-1/3">
                    <div className="h-64 bg-slate-900 dark:bg-slate-800 rounded-2xl animate-pulse" />
                </div>
            </div>
        </div>
    );
}

export default function SchedulePage() {
    return (
        <Suspense fallback={<ScheduleLoading />}>
            <ScheduleContent />
        </Suspense>
    );
}
