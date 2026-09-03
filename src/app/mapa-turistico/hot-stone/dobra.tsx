/* Origem: @shadcnblocks/hero157 · vitrine hot-stone · adaptado */
'use client';

import { Button } from '@/components/ui/button';
import { useReveal } from '@/hooks/use-reveal';
import { getAlt } from '@/lib/image-alt';
import { getLocal, getWhatsLocal, ZONAS } from '@/lib/mapa-turistico';
import { MessageCircle, Pizza } from 'lucide-react';
import Image from 'next/image';
import Rotulo from '../rotulo';

/**
 * Foto de abertura, em constante porque o caminho é usado duas vezes: na
 * `src` e na consulta ao mapa de alt text, que é chaveado por ele. É também a
 * imagem do cartão social, declarada de novo em `page.tsx` — o validador
 * compara as duas.
 *
 * Não é a fachada, que é a capa do cadastro e já é o que o cartão do mapa
 * mostra: quem chega aqui pelo mapa acabou de ver a fachada, e repetir a
 * mesma imagem faz a página parecer a ficha que ele já leu. É a mesa com seis
 * mãos tirando fatia ao mesmo tempo — o argumento inteiro de uma pizzaria numa
 * cidade onde se viaja em grupo, e a foto certa para o cartão do WhatsApp, que
 * é por onde o link vai circular.
 */
const FOTO = '/assets/mapa/hot-stone/hot-stone-7.webp';

/**
 * Dobra da página do parceiro.
 *
 * A foto é o conteúdo, não o pano de fundo: o bloco original a punha como
 * imagem de fundo da seção, por utilitária de background com URL literal — o
 * que a esconde do leitor de tela e a tira do otimizador do Next. Aqui ela é
 * um `next/image` com `priority` e com o alt que `image-alt.json` guarda.
 *
 * (E é utilitária que não pode nem ser citada em comentário: o Tailwind varre
 * o arquivo inteiro, gera a classe a partir do texto do comentário e o build
 * quebra tentando resolver a URL de exemplo.)
 *
 * A linha de baixo mantém o desenho do bloco — parágrafo com fio à esquerda de
 * um lado, botão do outro —, que é o que distingue esta dobra da dobra da
 * Pedra do Baú. O que mudou é o eixo: tudo nasce no `.container`, na mesma
 * margem esquerda em que nascem os `<h2>` das seções de baixo.
 *
 * `onMount` porque o bloco está acima da dobra: esperar o ScrollTrigger aqui
 * abriria a página com o título invisível.
 */
function Dobra(): React.ReactNode {
  const scope = useReveal<HTMLElement>({ onMount: true, delay: 0.15 });
  const local = getLocal('hot-stone');

  if (!local) return null;

  const whats = getWhatsLocal(local);

  return (
    <section
      ref={scope}
      /* `dark` inverte os tokens desta faixa, e é por isso que `tema.css`
         declara o bloco escuro do parceiro: sem ele a faixa herdaria o marrom
         do Refúgio por baixo de uma foto que é vermelha e preta. */
      className='dark relative flex min-h-[calc(100svh-var(--header-height,5rem))] w-full overflow-hidden'
    >
      <Image
        src={FOTO}
        alt={getAlt(FOTO, 'Pizza sendo dividida na mesa da Hot Stone')}
        fill
        sizes='100vw'
        priority
        className='z-0 object-cover object-center'
      />
      {/* Véu em gradiente e não a lâmina uniforme (`after:bg-black/65`) do
          bloco original: a foto tem madeira clara em cima e sombra embaixo, e
          um preto plano sobre ela apagava a pizza, que é o que a página tem de
          melhor. O escuro se concentra onde o texto está. */}
      <div
        aria-hidden
        className='absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/45 to-black/15'
      />
      <div className='relative z-30 container mt-auto mb-16 flex w-full flex-col gap-10 md:mb-24'>
        <div className='flex flex-col items-start gap-4'>
          <div data-reveal>
            <Rotulo icone={Pizza} className='text-[var(--primary-forte)]'>
              {ZONAS[local.zona]} · São Bento do Sapucaí
            </Rotulo>
          </div>
          <h1
            data-reveal
            className='max-w-4xl text-4xl tracking-tight text-pretty text-foreground md:text-6xl'
          >
            {local.nome}
          </h1>
        </div>

        <div className='flex w-full flex-col justify-between gap-6 sm:flex-row sm:items-end'>
          <p
            data-reveal
            className='max-w-prose border-l border-muted-foreground pl-6 text-pretty text-foreground md:text-lg'
          >
            {local.resumo}
          </p>
          {/* Um botão só na dobra, e é o WhatsApp: quem abre esta página está
              na cidade, à noite, decidindo onde jantar, e a pergunta dele é se
              tem mesa. A rota fica no fecho, onde ela é o próximo passo.

              O pedido online não virou botão: o link de delivery que a casa
              publica aponta para a loja antiga (registrado em
              `vitrines/hot-stone/formulario.md`), e botão que leva ao lugar
              errado é pior que botão nenhum. */}
          {whats && (
            <Button
              data-reveal
              size='lg'
              className='h-fit w-fit shrink-0 px-7 py-4'
              asChild
            >
              <a href={whats} target='_blank' rel='noopener noreferrer'>
                <MessageCircle aria-hidden='true' />
                Chamar no WhatsApp
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export default Dobra;
