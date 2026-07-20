import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import serialize from 'serialize-javascript';
import type { WithContext, Organization, WebSite } from 'schema-dts';
import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getSiteUrl } from '@/lib/env';

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

export function generateMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  return {
    title: {
      default: 'Refúgio da Pedra - Chalés em São Bento do Sapucaí',
      template: '%s | Refúgio da Pedra',
    },
    description:
      'Chalés e experiências em meio à natureza em São Bento do Sapucaí, Serra da Mantiqueira.',
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      siteName: 'Refúgio da Pedra',
      type: 'website',
      locale: 'pt_BR',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = getSiteUrl();

  const organizationJsonLd: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Refúgio da Pedra SP',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: ['https://www.instagram.com/refugiodapedrasp/'],
  };

  const websiteJsonLd: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Refúgio da Pedra SP',
    url: siteUrl,
  };

  return (
    <html lang='pt-BR' className={figtree.variable} suppressHydrationWarning>
      <body className='antialiased'>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: serialize(organizationJsonLd) }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: serialize(websiteJsonLd) }}
        />
        <TooltipProvider>
          <Header />
          {children}
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
