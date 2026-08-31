/* Hallmark · genre: editorial · macrostructure: Photographic · chrome: N6 masthead + Ft1 footer · design-system: design.md */

import { Suspense } from 'react';
import { ProvedorOrigem } from '@/components/mapa-turistico/origem';
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
      {/*
        Só esta seção conhece a origem — é ela que descreve o que a ficha do
        mapa mostra —, e por isso só ela entra no limite de suspensão que
        `useSearchParams()` exige numa rota estática.

        O `fallback` é a própria seção, sem provedor: fora dele o contexto
        entrega o Centro, que é o padrão. Assim o HTML gerado no build sai com
        a prosa inteira, redigida para o mapa da cidade — um esqueleto no lugar
        dela tiraria do índice o texto que esta página existe para publicar. O
        cliente só troca a seção quando há `?refugio=1` para trocar.
      */}
      <Suspense fallback={<ComoUsar />}>
        <ProvedorOrigem>
          <ComoUsar />
        </ProvedorOrigem>
      </Suspense>
      <Cta />
      <Faq />
    </main>
  );
}

export default MapaTuristicoPage;
