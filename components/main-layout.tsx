import { getHome } from '@/lib/api';
import { HomeSidebar } from './home-sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
}

export async function MainLayout({ children }: MainLayoutProps) {
    const homeData = await getHome(1);
    const animeList = homeData.data.anime;
    const sidebarTrending = animeList.slice(0, 10);
    const newSeries = animeList.slice(10, 15);

    return (
        <div className="container mx-auto px-4 pt-16 md:pt-20 pb-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="lg:w-2/3 min-w-0">
                    {children}
                </div>

                {/* Sidebar */}
                <aside className="lg:w-1/3 flex-shrink-0">
                    <HomeSidebar
                        trendingAnime={sidebarTrending}
                        newSeries={newSeries}
                    />
                </aside>
            </div>
        </div>
    );
}
