import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/Navbar';
import Footer from '@/components/Footer/index.tsx';
import chales from '@/data/chales.json';
import slugify from 'slugify';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Refugio da Pedra SP',
  description: 'Sua jornada de tranquilidade',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links = chales.map((chale) => ({
    title: chale.nome,
    href: `/chale/${slugify(chale.nome, { lower: true, strict: true })}`,
  }));

  return (
    <html lang='pt-BR' className='light'>
      <head>
        <meta
          name='google-site-verification'
          content='7z3PuWNKZ3rLPsIWZmDpioElAcG46TFEwpYpRVbaAo8'
        />
        {/* Google Tag Manager */}
        <Script
          id='gtm-script'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){
                w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PNHX9RNR');
            `,
          }}
        />

        {/* Google Analytics */}
        <Script
          id='gtag-script'
          async
          src='https://www.googletagmanager.com/gtag/js?id=G-LBQ9F7S12E'
        />
        <Script
          id='gtag-config-script'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LBQ9F7S12E');
            `,
          }}
        />
      </head>
      <body className='bg-background text-foreground'>
        {/* Google Tag Manager NoScript */}
        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-PNHX9RNR'
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <header>
          <NavBar />
        </header>
        <div className='pt-16'>{children}</div>
        <Footer links={links} />
      </body>
    </html>
  );
}
