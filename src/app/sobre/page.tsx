import { getSiteUrl } from '@/lib/env';
import SobreContent from './content';

export function generateMetadata() {
  const siteUrl = getSiteUrl();
  return {
    title: 'Quem Somos - Refúgio da Pedra',
    description:
      'Conheça a história por trás do Refúgio da Pedra, em São Bento do Sapucaí: uma pousada de família na Serra da Mantiqueira feita para quem busca descanso de verdade.',
    keywords: [
      'quem somos',
      'sobre',
      'pousada de família',
      'São Bento do Sapucaí',
      'Serra da Mantiqueira',
    ],
    openGraph: {
      title: 'Quem Somos - Refúgio da Pedra',
      description:
        'A história por trás do Refúgio da Pedra, uma pousada de família na Serra da Mantiqueira.',
      type: 'website',
      url: `${siteUrl}/sobre`,
    },
    alternates: {
      canonical: `${siteUrl}/sobre`,
    },
  };
}

function SobrePage(): React.ReactNode {
  return <SobreContent />;
}

export default SobrePage;
