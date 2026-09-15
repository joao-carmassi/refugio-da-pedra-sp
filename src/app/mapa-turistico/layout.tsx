import Header from "@/components/header";
import Footer from "@/components/footer";

/**
 * Só o chrome do ramo `/mapa-turistico/`. Metadata e JSON-LD moram em
 * `page.tsx`: o que descreve a landing é da landing; o que é chrome fica aqui.
 */
interface Props {
  children: React.ReactNode;
}

function MapaTuristicoLayout({ children }: Props): React.ReactNode {
  return (
    <>
      {/* `<Header />` travado em `compact`. O masthead cheio coloca o brasão,
          o nome da pousada e a localidade acima de tudo, e quem chega da busca
          por "mapa turístico de São Bento do Sapucaí" encontraria a pousada se
          apresentando antes do guia que ele veio ler. Esta rota trata o
          Refúgio como quem mantém o projeto, e o lugar disso é a assinatura do
          hero — não o topo da página.

          Travar o estado numa página que rola é seguro: o cabeçalho é `fixed`,
          o spacer no fluxo é medido já no estado travado e a prop desliga o
          listener de scroll, então não há a troca masthead↔barra que o resto
          do site faz ao rolar. */}
      <Header compact />
      {children}
      <Footer />
    </>
  );
}

export default MapaTuristicoLayout;
