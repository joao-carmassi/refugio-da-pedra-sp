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
      {/* Mesmo cabeçalho do resto do site: expandido no topo, compacto ao
          rolar. */}
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default MapaTuristicoLayout;
