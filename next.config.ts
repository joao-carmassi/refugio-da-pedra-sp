import type { NextConfig } from 'next';

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  // OpenFreeMap serves the vector basemap for /mapa-turistico/ (style JSON,
  // tiles, glyphs and sprites) over fetch/XHR, so it needs connect-src, not
  // img-src. The MapLibre worker is served from this origin — see
  // scripts/sync-maplibre-worker.mjs — hence 'self' rather than a CDN.
  "connect-src 'self' https://tiles.openfreemap.org",
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
          // `geolocation=(self)` is required by the "use my location" control
          // on /mapa-turistico/ — the browser blocks the Geolocation API
          // outright under `geolocation=()`. Still same-origin only: no
          // embedded third party can ask for the visitor's position.
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
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
          //      /politica-de-privacidade/, including the Google Maps embed and
          //      the MapLibre basemap (worker, style JSON, tiles, glyphs).
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
