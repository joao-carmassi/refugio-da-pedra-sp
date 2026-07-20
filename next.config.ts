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
].join('; ');

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: true,
  poweredByHeader: false,
  experimental: {
    typedEnv: true,
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
          // Report-Only (not enforcing) so an imperfect policy can't break the
          // site in production — this hasn't been verified against a live browser.
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
