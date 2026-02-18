import type {
    HomeResponse,
    DetailResponse,
    WatchResponse,
    ScheduleResponse,
    SearchResponse,
    BatchResponse,
} from './types';

const BASE_URL = 'https://rgsordertracking.com/animekompi/endpoints';

async function fetchAPI<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }

    try {
        const res = await fetch(url.toString(), {
            next: { revalidate: 60 },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            }
        });

        if (!res.ok) {
            console.error(`API Error for ${url.toString()}: ${res.status} ${res.statusText}`);
            throw new Error(`API Error: ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error(`Fetch failed for ${url.toString()}:`, error);
        throw error;
    }
}

export async function getHome(page: number = 1): Promise<HomeResponse> {
    return fetchAPI<HomeResponse>('/home.php', { page: page.toString() });
}

export async function getDetail(slug: string): Promise<DetailResponse> {
    return fetchAPI<DetailResponse>('/detail.php', { slug });
}

export async function getWatch(slug: string): Promise<WatchResponse> {
    return fetchAPI<WatchResponse>('/watch.php', { slug });
}

export async function getSchedule(): Promise<ScheduleResponse> {
    return fetchAPI<ScheduleResponse>('/schedule.php');
}

export async function search(query: string, page: number = 1): Promise<SearchResponse> {
    return fetchAPI<SearchResponse>('/search.php', { q: query, page: page.toString() });
}

export async function getBatch(page: number = 1): Promise<BatchResponse> {
    return fetchAPI<BatchResponse>('/batch.php', { page: page.toString() });
}
