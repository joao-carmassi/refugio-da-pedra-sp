import Header from '@/components/header';
import Footer from '@/components/footer';

interface Props {
  children: React.ReactNode;
}

/**
 * Layout só de chrome. A rota não declara `generateMetadata` aqui porque a
 * própria página já resolve título, descrição, canonical e openGraph — duplicar
 * no layout só criaria dois lugares para manter em sincronia.
 */
function PoliticaDePrivacidadeLayout({ children }: Props): React.ReactNode {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default PoliticaDePrivacidadeLayout;
