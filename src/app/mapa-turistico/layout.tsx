import Header from "@/components/header";
import Footer from "@/components/footer";
import ConviteInstalar from "@/components/mapa-turistico/convite-instalar";

/**
 * Só o chrome do ramo `/mapa-turistico/`.
 *
 * Metadata e JSON-LD moraram aqui e voltaram para `page.tsx`: layout no App
 * Router vale para toda rota filha, e as páginas de parceiro do plano Vitrine
 * (`/mapa-turistico/<id>/`) herdavam daqui um `CollectionPage` dos 31 lugares
 * e um `FAQPage` que não está na tela delas. O que descreve a landing é da
 * landing; o que é chrome fica aqui.
 */
interface Props {
  children: React.ReactNode;
}

function MapaTuristicoLayout({ children }: Props): React.ReactNode {
  return (
    <>
      {/* `<Header />` travado em `compact`, como em `/mapa/` — mas por outro
          motivo. Lá o masthead cheio comia a área útil da ferramenta; aqui ele
          coloca o brasão, o nome da pousada e a localidade acima de tudo, e
          quem chega da busca por "mapa turístico de São Bento do Sapucaí"
          encontraria a pousada se apresentando antes do guia que ele veio ler.
          Esta rota trata o Refúgio como quem mantém o projeto, e o lugar disso
          é a assinatura do hero — não o topo da página.

          Travar o estado numa página que rola é seguro: o cabeçalho é `fixed`,
          o spacer no fluxo é medido já no estado travado e a prop desliga o
          listener de scroll, então não há a troca masthead↔barra que o resto
          do site faz ao rolar. O que se perde é justamente essa animação, que
          aqui não teria o que animar. */}
      <Header compact />
      {children}
      <Footer />
      {/* Mesmo convite de `/mapa/`: as duas rotas são o mesmo PWA, e é por
          aqui que chega quem procurou o guia da cidade. */}
      <ConviteInstalar />
    </>
  );
}

export default MapaTuristicoLayout;
