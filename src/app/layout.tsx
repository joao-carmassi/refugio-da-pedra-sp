import type { Metadata } from 'next';
import serialize from 'serialize-javascript';
import type { WithContext, LodgingBusiness, WebSite } from 'schema-dts';
import { Archivo, Piazzolla } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getSiteUrl, getInPhoneNumber } from '@/lib/env';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
});

const piazzolla = Piazzolla({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-serif',
});

/**
 * Imagem social padrão (paisagem 3:2, ~366 KB). Serve de fallback para
 * qualquer rota que não declare a própria `openGraph.images`.
 *
 * Atenção: o Next.js substitui (não mescla) o objeto `openGraph` inteiro
 * quando um segmento filho o declara, então cada layout que define
 * `openGraph` precisa repetir `images` explicitamente.
 */
const defaultOgImage = {
  url: '/assets/refugio/geral/refugio-1.webp',
  width: 1620,
  height: 1080,
  alt: 'Chalés do Refúgio da Pedra ao entardecer, com a Pedra do Baú ao fundo, em São Bento do Sapucaí',
};

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
      // `trailingSlash: true` no next.config.ts: a raiz é servida em
      // `${siteUrl}/`. Sem a barra o canonical aponta para um 308.
      canonical: `${siteUrl}/`,
    },
    openGraph: {
      siteName: 'Refúgio da Pedra',
      type: 'website',
      locale: 'pt_BR',
      images: [defaultOgImage],
    },
    twitter: {
      // Sem `images` aqui de propósito: o Next.js herda `twitter.images` de
      // `openGraph.images` por rota, preservando a imagem de cada chalé.
      card: 'summary_large_image',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = getSiteUrl();
  const rawPhone = getInPhoneNumber();

  /**
   * Nó canônico do negócio. Todos os outros nós do site (homepage, /sobre,
   * cada chalé, /reservar) apenas referenciam este `@id` em vez de repetir
   * dados parciais.
   */
  const businessJsonLd: WithContext<LodgingBusiness> = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': `${siteUrl}/#business`,
    name: 'Pousada Refúgio da Pedra',
    alternateName: 'Refúgio da Pedra',
    description:
      'Pousada sustentável com chalés, cabana e domo geodésico ao pé da Pedra do Baú, em São Bento do Sapucaí, na Serra da Mantiqueira.',
    url: `${siteUrl}/`,
    logo: `${siteUrl}/logo.png`,
    image: [
      `${siteUrl}/assets/refugio/geral/refugio-1.webp`,
      `${siteUrl}/assets/refugio/geral/refugio-2.webp`,
      `${siteUrl}/assets/refugio/geral/refugio-15.webp`,
    ],
    foundingDate: '2018',
    ...(rawPhone
      ? { telephone: rawPhone.startsWith('+') ? rawPhone : `+${rawPhone}` }
      : {}),
    founder: [
      { '@type': 'Person', name: 'Daniel' },
      { '@type': 'Person', name: 'Marcia' },
    ],
    address: {
      '@type': 'PostalAddress',
      // Grafia fornecida pelo proprietário, mantida verbatim para bater com o
      // Google Business Profile (consistência de NAP).
      // TODO(proprietário): confirmar grafia + número — deve bater exatamente com o Google Business Profile.
      // TODO(proprietário): informar o CEP para preencher `postalCode`.
      streetAddress: 'Rua Das Araucareas, Paiol Grande',
      addressLocality: 'São Bento do Sapucaí',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -22.67812457941675,
      longitude: -45.66375792387372,
    },
    numberOfRooms: 5,
    checkinTime: '14:00',
    checkoutTime: '12:00',
    petsAllowed: true,
    // TODO(priceRange): adicionar `priceRange` (ex.: 'R$$') assim que houver
    // uma faixa de diária oficial. Não emitir valor estimado/inventado.
    amenityFeature: [
      'Café da manhã incluído',
      'Wi-Fi gratuito',
      'Estacionamento privativo',
      'Aceita pets',
      'Roupas de cama e toalhas',
      'Vista para as montanhas',
      'Deck com vista',
    ].map((name) => ({
      '@type': 'LocationFeatureSpecification' as const,
      name,
      value: true,
    })),
    sameAs: ['https://www.instagram.com/refugiodapedrasp/'],
  };

  const websiteJsonLd: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: 'Pousada Refúgio da Pedra',
    alternateName: 'Refúgio da Pedra',
    url: `${siteUrl}/`,
    inLanguage: 'pt-BR',
    publisher: { '@id': `${siteUrl}/#business` },
  };

  return (
    <html
      lang='pt-BR'
      className={`${archivo.variable} ${piazzolla.variable}`}
      suppressHydrationWarning
    >
      <body className='antialiased'>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: serialize(businessJsonLd) }}
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
