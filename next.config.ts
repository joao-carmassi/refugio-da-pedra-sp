import type { NextConfig } from 'next';

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
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

/*
  O mapa turístico saiu deste repositório e ganhou site próprio. Os endereços
  que ele tinha aqui já circulam impressos (QR do adesivo), em favoritos e em
  PWAs instalados, então cada um vira um 308 para o equivalente no site novo.
  `/mapa-turistico/` fica de fora: continua aqui como página de texto que
  apresenta o mapa. `/mapa-sw.js` também: é o service worker que desinstala o
  PWA antigo, e precisa responder deste domínio.

  Sem `NEXT_PUBLIC_MAPA_URL` não há para onde mandar, e nenhum redirecionamento
  é criado — as rotas antigas respondem 404 e o build segue.

  Com `trailingSlash: true` o Next já manda `/mapa` para `/mapa/` antes destas
  regras, e o matcher delas é estrito com a barra final: por isso toda origem
  termina em `/`. A query string passa adiante sozinha (`/mapa/?ponto=<id>`).
*/
const getMapaRedirects = () => {
  const mapaUrl = process.env.NEXT_PUBLIC_MAPA_URL?.trim().replace(/\/+$/, '');

  if (!mapaUrl) return [];

  return [
    // `:caminho*` com a barra depois cobre `/mapa/` e qualquer subcaminho. A
    // query (`?ponto=`, `?categoria=`) segue junto: o Next a repassa ao destino.
    { source: '/mapa/:caminho*/', destination: `${mapaUrl}/mapa/` },
    {
      source: '/mapa-turistico/hot-stone/',
      destination: `${mapaUrl}/lugares/hot-stone/`,
    },
    {
      source: '/mapa-turistico/pedra-do-bau/',
      destination: `${mapaUrl}/lugares/pedra-do-bau/`,
    },
    { source: '/kit/adesivo/', destination: `${mapaUrl}/kit/adesivo/` },
    { source: '/relatorio/', destination: `${mapaUrl}/relatorio/` },
    // Arquivo, então sem barra: o Next tira a barra de caminhos com extensão.
    {
      source: '/mapa.webmanifest',
      destination: `${mapaUrl}/mapa.webmanifest`,
    },
  ].map((redirect) => ({ ...redirect, permanent: true }));
};

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
  async redirects() {
    return getMapaRedirects();
  },
  async headers() {
    return [
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
          //      /reservar/, /blog/, /blog/[post]/, /sobre/, /mapa-turistico/ and
          //      /politica-de-privacidade/, including the Google Maps embed.
          //   3. `script-src 'unsafe-inline'` is either replaced with a nonce/hash
          //      or consciously accepted — as written it neuters most of the policy.
          //   4. Any analytics/third-party script added since this was written is
          //      reflected in script-src/connect-src.
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
