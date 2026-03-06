import { getSiteUrl } from '@/lib/env';

interface Props {
  children: React.ReactNode;
}

export function generateMetadata() {
  const siteUrl = getSiteUrl();
  return {
    title: 'Reservar - Refúgio da Pedra',
    description:
      'Reserve sua estadia no Refúgio da Pedra em São Bento do Sapucaí. Chalés, cabanas e domos disponíveis para uma experiência única na natureza da Serra da Mantiqueira.',
    keywords: [
      'reservar',
      'reserva',
      'chalés',
      'São Bento do Sapucaí',
      'hospedagem',
      'Serra da Mantiqueira',
    ],
    openGraph: {
      title: 'Reservar - Refúgio da Pedra',
      description:
        'Reserve sua estadia no Refúgio da Pedra. Chalés, cabanas e domos na Serra da Mantiqueira.',
      type: 'website',
      url: `${siteUrl}/reservar`,
    },
    alternates: {
      canonical: `${siteUrl}/reservar`,
    },
  };
}

function ReservarLayout({ children }: Props): React.ReactNode {
  return <>{children}</>;
}

export default ReservarLayout;
