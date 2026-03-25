import axios from 'axios';

const API_KEY = import.meta.env.VITE_NEWSDATA_API_KEY;
const BASE_URL = 'https://newsdata.io/api/1/news';

export interface NewsArticle {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    source_id: string;
    image_url: string;
    category: string[];
    sentiment?: 'Bullish' | 'Bearish' | 'Neutral';
    impact?: 'High' | 'Medium' | 'Low';
}

export const fetchLiveNews = async (query: string = 'forex,crypto,finance'): Promise<NewsArticle[]> => {
    try {
        const response = await axios.get(`${BASE_URL}`, {
            params: {
                apikey: API_KEY,
                q: query,
                language: 'en',
                category: 'business,technology'
            }
        });
        
        return response.data.results.map((article: any) => ({
            ...article,
            // Mocking sentiment/impact for now (can be enhanced with Gemini)
            sentiment: Math.random() > 0.6 ? 'Bullish' : Math.random() > 0.4 ? 'Bearish' : 'Neutral',
            impact: Math.random() > 0.7 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low'
        }));
    } catch (error) {
        console.error('Error fetching live news:', error);
        // Fallback mock data if API fails or key is invalid
        return [
            {
                title: 'Global Markets Brace for Fed Rate Decision',
                link: '#',
                description: 'Traders worldwide are awaiting the Federal Reserve announcement on interest rates, with high volatility expected in USD pairs.',
                pubDate: new Date().toISOString(),
                source_id: 'reuters',
                image_url: '',
                category: ['finance'],
                sentiment: 'Neutral',
                impact: 'High'
            },
            {
                title: 'Bitcoin Surges Above $90k Amid Institutional Adoption',
                link: '#',
                description: 'Institutional inflow into Bitcoin ETFs reaches record highs as the leading cryptocurrency marks a new milestone.',
                pubDate: new Date().toISOString(),
                source_id: 'coindesk',
                image_url: '',
                category: ['crypto'],
                sentiment: 'Bullish',
                impact: 'Medium'
            }
        ];
    }
};
