import { searchJamendo } from './jamendo';
import { searchSoundCloud } from './soundcloud';
import { searchYouTube } from './youtube';
import { searchInternetArchive } from './internet-archive';
import { searchMixcloud } from './mixcloud';

export interface MusicSearchParams {
  query: string;
  sortBy?: 'relevance' | 'newest' | 'popularity' | 'publicDomain';
  platformFilter?: string;
  aiMode?: boolean;
}

export async function searchMusic(params: MusicSearchParams) {
  const { query, sortBy = 'relevance', platformFilter = 'all', aiMode = false } = params;

  if (!query || !query.trim()) {
    throw new Error('Missing or invalid query');
  }

  const [jamendo, soundcloud, youtube, internetArchive, mixcloud] = await Promise.all([
    searchJamendo(query, 12).catch((err) => { console.error('Jamendo error:', err.message); return []; }),
    searchSoundCloud(query, 12).catch((err) => { console.error('SoundCloud error:', err.message); return []; }),
    searchYouTube(query, 12).catch((err) => { console.error('YouTube error:', err.message); return []; }),
    searchInternetArchive(query, 12).catch((err) => { console.error('Internet Archive error:', err.message); return []; }),
    searchMixcloud(query, 12).catch((err) => { console.error('Mixcloud error:', err.message); return []; }),
  ]);

  let results = [
    ...jamendo,
    ...soundcloud,
    ...youtube,
    ...internetArchive,
    ...mixcloud,
  ].map(r => {
    const rec: any = r;
    return {
      ...r,
      platform: rec.platform || rec.source || 'unknown',
      description: rec.description || '',
      aiScore: rec.aiScore || 0,
    };
  });

  console.log(`[SEARCH] Query: "${query}", Results before filtering: ${results.length}, AI Mode: ${aiMode}`);

  let filtered = results.filter((r: any) => {
    const url = (r.url || '').toLowerCase();
    const isMusicSite = url.includes('jamendo.com') || url.includes('youtube.com') || url.includes('youtu.be') || url.includes('soundcloud.com') || url.includes('archive.org') || url.includes('mixcloud.com');
    const isPublic = isMusicSite && !url.includes('login') && !url.includes('signin');
    return isPublic;
  });

  if (platformFilter !== 'all') {
    filtered = filtered.filter((r: any) => r.platform === platformFilter);
  }

  console.log(`[SEARCH] After filtering: ${filtered.length} results, Platform: ${platformFilter}, SortBy: ${sortBy}`);

  if (aiMode) {
    filtered.sort((a: any, b: any) => (b.aiScore || 0) - (a.aiScore || 0));
    filtered = filtered.slice(0, 3);
    filtered = filtered.sort(() => Math.random() - 0.5);
    console.log(`[SEARCH] AI Mode: Returning top 3 results in random order with AI scores:`, filtered.map((r: any) => ({ title: r.title, score: r.aiScore })));
  } else {
    if (sortBy === 'newest') {
      filtered.sort((a: any, b: any) => {
        const dateA = new Date(a.publishedAt || 0).getTime();
        const dateB = new Date(b.publishedAt || 0).getTime();
        return dateB - dateA;
      });
    } else if (sortBy === 'popularity') {
      filtered.sort((a: any, b: any) => {
        const viewsA = a.viewCount || 0;
        const viewsB = b.viewCount || 0;
        return viewsB - viewsA;
      });
    } else if (sortBy === 'publicDomain') {
      filtered = filtered.filter((r: any) => r.platform === 'jamendo');
    } else {
      filtered.sort((a: any, b: any) => (b.aiScore || 0) - (a.aiScore || 0));
    }
  }

  return filtered;
}

export async function webSearch(query: string) {
  if (!query || !query.trim()) {
    throw new Error('Missing or invalid query');
  }

  const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query + ' music')}&format=json&no_html=1&skip_disambig=1`;

  try {
    const response = await fetch(searchUrl);
    const data = await response.json();

    const results = [];

    if (data.Abstract && data.AbstractURL) {
      results.push({
        title: data.Heading || query,
        url: data.AbstractURL,
        description: data.Abstract
      });
    }

    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      for (const topic of data.RelatedTopics.slice(0, 5)) {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(' - ')[0] || topic.Text,
            url: topic.FirstURL,
            description: topic.Text
          });
        }
      }
    }

    if (results.length === 0) {
      results.push({
        title: `${query} - Music Search`,
        url: `https://www.google.com/search?q=${encodeURIComponent(query + ' music')}`,
        description: `Search for music-related information about "${query}"`
      });
    }

    return results;
  } catch (apiError) {
    console.error('[WEB-SEARCH] API Error:', apiError);
    return [{
      title: `${query} - Music Search`,
      url: `https://www.google.com/search?q=${encodeURIComponent(query + ' music')}`,
      description: `Search for music-related information about "${query}"`
    }];
  }
}
