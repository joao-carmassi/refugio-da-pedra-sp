// Both variables are load-bearing for SEO and conversion, and both used to fail
// silently (empty string) when unset. In production — which includes `next build`
// — a missing value now throws so the regression surfaces as a build failure
// instead of shipping relative canonicals and dead WhatsApp links. Development
// stays tolerant so `npm run dev` still works without a .env file.
const requireEnv = (
  name: string,
  value: string | undefined,
  consequence: string,
): string => {
  if (value) return value;

  const message = `${name} is not set — ${consequence}`;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(message);
  }

  console.warn(message);
  return '';
};

export const getInPhoneNumber = () =>
  requireEnv(
    'NEXT_PUBLIC_IN_PHONE_NUMBER',
    process.env.NEXT_PUBLIC_IN_PHONE_NUMBER,
    'every WhatsApp CTA becomes a dead link and `telephone` is dropped from the schema.',
  );

export const getSiteUrl = () =>
  requireEnv(
    'NEXT_PUBLIC_SITE_URL',
    process.env.NEXT_PUBLIC_SITE_URL,
    'canonical URLs, sitemap, and OG tags will be broken.',
  );

// Deliberately optional, so it does not go through `requireEnv`: the tourist
// map lives on its own site, and this pousada site only points to it — the
// text landing at `/mapa-turistico/` links out and `next.config.ts` redirects
// the old map URLs there. With it unset the build still passes: the landing
// keeps its links on itself and no redirect is emitted. Absolute origin, and
// any trailing slash is stripped so callers can append `/mapa/` safely.
export const getMapaUrl = (): string | null => {
  const url = process.env.NEXT_PUBLIC_MAPA_URL?.trim();

  return url ? url.replace(/\/+$/, '') : null;
};
