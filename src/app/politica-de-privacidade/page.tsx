import { getSiteUrl } from '@/lib/env';

import PoliticaContent from './content';

export function generateMetadata() {
  const siteUrl = getSiteUrl();
  return {
    title: 'Política de Privacidade - Refúgio da Pedra',
    description:
      'Política de Privacidade do Refúgio da Pedra: como coletamos, usamos e protegemos os dados pessoais de hóspedes, em conformidade com a LGPD (Lei 13.709/2018).',
    keywords: [
      'política de privacidade',
      'LGPD',
      'proteção de dados',
      'Refúgio da Pedra',
    ],
    robots: {
      index: true,
    },
    openGraph: {
      title: 'Política de Privacidade - Refúgio da Pedra',
      description:
        'Como o Refúgio da Pedra coleta, usa e protege dados pessoais, em conformidade com a LGPD.',
      type: 'website',
      url: `${siteUrl}/politica-de-privacidade`,
    },
    alternates: {
      canonical: `${siteUrl}/politica-de-privacidade`,
    },
  };
}

function PoliticaDePrivacidadePage(): React.ReactNode {
  return <PoliticaContent />;
}

export default PoliticaDePrivacidadePage;
