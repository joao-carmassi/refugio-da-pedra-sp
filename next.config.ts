import type { NextConfig } from 'next';

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  // A base vetorial de /mapa/ (estilo, tiles, glifos e sprite) é servida deste
  // mesmo domínio: `scripts/gerar-base.mjs` congela a região inteira em
  // public/mapa-base/ na build. Foi por causa disso que o OpenFreeMap saiu
  // daqui — o mapa não fala mais com ninguém de fora em runtime. O worker do
  // MapLibre também é nosso, ver scripts/sync-maplibre-worker.mjs.
  "connect-src 'self'",
  "worker-src 'self' blob:",
  // Allows the Google Maps embed used on the homepage (see mapa.tsx / outras-experiencias.tsx).
  "frame-src 'self' https://www.google.com",
  // Clickjacking protection. Also shipped as a standalone enforcing header
  // below, because `frame-ancestors` in a Report-Only policy only reports —
  // it does not block framing.
  "frame-ancestors 'self'",
].join('; ');

// Enforced on its own so the site actually refuses to be framed while the rest
// of the policy stays Report-Only. A policy that lists only `frame-ancestors`
// restricts nothing else, so this cannot break page resources.
const CSP_ENFORCED_DIRECTIVES = "frame-ancestors 'self'";

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: true,
  poweredByHeader: false,
  experimental: {
    typedEnv: true,
  },
  images: {
    // 75 is Next's default quality and the effective default here: <Image>
    // only uses 100 when a component passes `quality={100}` explicitly.
    // Listing [100] alone forced every breakpoint of every image to q=100
    // (a 262 KB source came back as ~1.1 MB at w=1200) and made q=75 a 400.
    // Note: `deviceSizes` is intentionally left at the Next default; it is not
    // declared here, so trimming the 3840w breakpoint would mean introducing
    // the whole list. Revisit only with real srcset measurements.
    qualities: [75, 100],
    formats: ['image/avif', 'image/webp'],
  },
  /*
    A medição de audiência é servida deste domínio, não de `cloud.umami.is`.
    Dois motivos, nesta ordem:

    1. O CSP acima declara `script-src 'self'` e `connect-src 'self'`. Sendo
       same-origin, o analytics não pede exceção nenhuma na política — a tag
       direta da Umami obrigaria a abrir as duas diretivas para um domínio de
       fora.
    2. `cloud.umami.is` está nas listas do uBlock, do Brave e de DNS filtrado.
       Bloqueado, o relatório entregue ao parceiro sai menor que a realidade
       sem ninguém saber quanto — que é o pior tipo de número errado.

    A duplicata de `/stats/api/send` com e sem barra final não é descuido, e
    foi confirmada na prática, não deduzida:

      POST /stats/api/send   -> 308 para /stats/api/send/
      POST /stats/api/send/  -> 400 vindo da Umami (payload vazio do teste)

    O 400 é a boa notícia: significa que a requisição chegou ao servidor deles.
    `trailingSlash: true` redireciona antes de os rewrites serem consultados,
    então o evento sempre entra pelo caminho com barra — e sem a segunda regra
    o destino do próprio redirect seria 404, derrubando toda a medição em
    silêncio.

    O custo é um 308 por evento, já que a Umami monta o endereço como
    `<data-host-url>/api/send`, sem barra. Some-se `skipTrailingSlashRedirect`
    para eliminá-lo e o site inteiro passa a servir 200 em `/sobre` e
    `/sobre/`, o que é trocar um redirect barato por URL duplicada no índice.
    Fica o 308.
  */
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/stats/script.js',
          destination: 'https://cloud.umami.is/script.js',
        },
        {
          source: '/stats/api/send',
          destination: 'https://cloud.umami.is/api/send',
        },
        {
          source: '/stats/api/send/',
          destination: 'https://cloud.umami.is/api/send',
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        /*
         * O pacote da base cartográfica é imutável por endereço: o caminho leva
         * o snapshot do OpenFreeMap, então gerar de novo publica uma pasta
         * nova em vez de trocar o conteúdo destas URLs. Um ano de cache é
         * seguro por construção — e é ele que faz o hóspede não rebaixar tile
         * nenhum ao voltar ao mapa, que é o que sustenta a segunda visita.
         */
        source: '/mapa-base/:caminho*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Only takes effect once the site is confirmed served over HTTPS in
          // production — browsers ignore Strict-Transport-Security on plain HTTP,
          // so sending it pre-launch is harmless.
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: CSP_ENFORCED_DIRECTIVES,
          },
          // Report-Only (not enforcing) so an imperfect policy can't break the
          // site in production — this hasn't been verified against a live browser.
          //
          // TODO: promote CSP_DIRECTIVES to an enforcing `Content-Security-Policy`
          // header only after verifying, in a real browser on the deployed site:
          //   1. A reporting endpoint is wired up (`report-to` + a `Reporting-Endpoints`
          //      header, or `report-uri`) and violations are actually being received —
          //      today the policy neither enforces nor logs anything.
          //   2. Zero violations for a full crawl of /, /chales/, /chales/[slug]/,
          //      /reservar/, /blog/, /blog/[post]/, /sobre/, /mapa/ and
          //      /politica-de-privacidade/, including the Google Maps embed and
          //      the MapLibre basemap (worker, style JSON, tiles, glyphs).
          //   3. `script-src 'unsafe-inline'` is either replaced with a nonce/hash
          //      or consciously accepted — as written it neuters most of the policy.
          //   4. Any analytics/third-party script added since this was written is
          //      reflected in script-src/connect-src. Status: the Umami tag added
          //      in `src/app/layout.tsx` deliberately needs no change here — it is
          //      proxied same-origin through the `/stats/*` rewrites above, so
          //      `script-src 'self'` and `connect-src 'self'` already cover it.
          //      Keep it that way: pointing the tag straight at cloud.umami.is
          //      would reopen this item.
          {
            key: 'Content-Security-Policy-Report-Only',
            value: CSP_DIRECTIVES,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
