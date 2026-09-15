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

// Deliberately optional, so neither goes through `requireEnv`: with either one
// missing, `/api/rastreio/` accepts the click and stores nothing, and the site
// builds and runs unmeasured. Server-only — never prefix them with
// `NEXT_PUBLIC_`, or the secret key (which bypasses RLS) ships in the bundle.
export const getSupabaseUrl = () => process.env.SUPABASE_URL ?? '';

export const getSupabaseSecretKey = () =>
  process.env.SUPABASE_SECRET_KEY ?? '';

// What keeps test clicks out of a partner's report: `/api/rastreio/` only
// counts a click when this is `production`, so `cliques_mapa` holds nothing
// else. Vercel sets `VERCEL_ENV` on its deploys; anything else — `npm run dev`,
// a local `next start` — is development, even with the Supabase key present.
export const getAmbiente = () => {
  const ambiente = process.env.VERCEL_ENV;

  return ambiente === 'production' || ambiente === 'preview'
    ? ambiente
    : 'development';
};

// Credentials for the `/relatorio/` Basic Auth check in `src/proxy.ts`.
// Optional, but closed by default: with either one missing the report answers
// 404, so forgetting them on Vercel never leaves partner numbers open.
// Server-only, like the Supabase pair above.
export const getRelatorioUsuario = () => process.env.RELATORIO_USUARIO ?? '';

export const getRelatorioSenha = () => process.env.RELATORIO_SENHA ?? '';
