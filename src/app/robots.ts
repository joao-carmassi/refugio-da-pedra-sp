import { getSiteUrl } from '@/lib/env';
import type { MetadataRoute } from 'next';

// AI crawlers are listed explicitly — all ALLOWED, same as the `*` rule — so the
// stance is documented rather than implicit, and blocking any single bot later is
// a one-line change instead of a research task.
//
// Search/answer bots (blocking these costs citations in AI answers):
//   GPTBot        - OpenAI, powers ChatGPT browsing + training
//   OAI-SearchBot - OpenAI, search index only (no training)
//   PerplexityBot - Perplexity, cites sources with links
//   ClaudeBot     - Anthropic
// Training/dataset-only bots (no traffic back; safest ones to flip to disallow):
//   CCBot             - Common Crawl
//   Google-Extended   - Gemini/Vertex training opt-out token
//   Applebot-Extended - Apple Intelligence training opt-out token
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'PerplexityBot',
  'ClaudeBot',
  'CCBot',
  'Google-Extended',
  'Applebot-Extended',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: '/',
      })),
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
