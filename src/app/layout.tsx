import type { Metadata } from 'next';
import { Geist, Geist_Mono, Figtree } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getSiteUrl } from '@/lib/env';

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
  return (
    <html lang='pt-BR' className={figtree.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
          <Header />
          {children}
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
