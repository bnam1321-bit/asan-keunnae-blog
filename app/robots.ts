import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
            },
            {
                userAgent: ['GPTBot', 'ClaudeBot', 'Google-Extended'],
                allow: '/',
            }
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
