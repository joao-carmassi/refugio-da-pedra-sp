/* Hallmark · genre: editorial · macrostructure: Photographic · chrome: N6 masthead + Ft1 footer · design-system: design.md */

import Hero from './hero';
import Categorias from './categorias';
import Pontos from './pontos';
import ComoUsar from './como-usar';
import Faq from './faq';
import Cta from './cta';

/*
  Página de conteúdo sobre o mapa turístico de São Bento do Sapucaí.

  Não confundir com `/mapa/`: lá fica a ferramenta — tela cheia, sem rodapé,
  desenhada em WebGL e portanto opaca para buscador e leitor de tela. Esta
  rota é o texto que aquela tela não tem: responde em HTML o que o visitante
  digitou na busca, e leva ao mapa e à reserva no mesmo scroll.

  A composição segue a homepage: uma seção por arquivo, montadas aqui na
  ordem em que aparecem. Sem `min-h-container` — a página é longa por
  construção e a altura mínima só existe para rotas que podem ficar curtas.
*/
function MapaTuristicoPage(): React.ReactNode {
  return (
    /*
      `data-mapa-tema` liga a identidade própria do mapa (globals.css) — verde
      mata na ação, areia no fundo, verde profundo nos blocos fechados.

      O escopo para no `<main>` de propósito: cabeçalho e rodapé são a marca do
      Refúgio e continuam em âmbar, como no resto do site. O mapa é um projeto
      com identidade separada, não uma troca de tema do site inteiro — e o
      encontro das duas marcas acontece uma vez só, na assinatura do hero.
    */
    <main data-mapa-tema className='bg-background'>
      <Hero />
      <Categorias />
      <Pontos />
      <ComoUsar />
      <Cta />
      <Faq />
    </main>
  );
}

export default MapaTuristicoPage;
