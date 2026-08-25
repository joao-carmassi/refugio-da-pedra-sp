'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type Altura = 'minima' | 'media' | 'alta';

/**
 * Fração da altura do mapa ocupada em cada parada.
 *
 * A menor não é zero de propósito: a folha nunca sai de cena. Some por
 * completo e a lista vira um botão que a pessoa precisa lembrar que existe —
 * deixando a faixa com a alça e o título sempre no rodapé, o caminho de volta
 * está à mão e o gesto de puxar fica anunciado o tempo todo. São 18% e não
 * menos porque é o que cabe a alça (44px), o cabeçalho da lista e uma tira do
 * primeiro cartão: cortar o título ao meio deixaria a faixa sem dizer o que
 * ela é, e sem a tira de cartão ela não pareceria ter mais coisa embaixo.
 */
const PARADAS: Record<Altura, number> = {
  minima: 0.18,
  media: 0.5,
  // A mais alta não é 1 para o mapa nunca sumir por completo: a tira que sobra
  // no topo é o que mostra a folha encostando em algo, e não virando tela. É
  // uma tira e não uma faixa — qualquer coisa maior lê como espaço esquecido
  // entre a folha e o cabeçalho do site.
  alta: 0.985,
};

/** Onde a folha para. Base de tudo que flutua acima dela. */
export const FRACOES: Readonly<Record<Altura, number>> = PARADAS;

const ORDEM: Altura[] = ['minima', 'media', 'alta'];

/**
 * Entrada da folha. Ela nasce com a altura final já aplicada, então a
 * transição de altura só serve para mudar de parada com ela em cena — no
 * primeiro quadro não há de onde transicionar.
 */
const ANIMA_ENTRA =
  'animate-in slide-in-from-bottom duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]';

/** Abaixo disto o arrasto foi tremida de dedo, não intenção de trocar de parada. */
const LIMIAR_PX = 20;
/** Acima disto foi peteleco: a direção vale mesmo com pouco caminho andado. */
const LIMIAR_VELOCIDADE = 0.35;
/** A partir daqui o gesto já é arrasto, e o clique da alça não deve disparar. */
const LIMIAR_CLIQUE = 5;

interface Props {
  altura: Altura;
  onAltura: (altura: Altura) => void;
  children: React.ReactNode;
  rotulo: string;
  /**
   * Desce a folha para fora da tela sem trocar de parada.
   *
   * A folha não fecha, mas há um momento em que ela atrapalha: com a busca
   * aberta, a faixa de arrastar disputa a tela curta com o balão de
   * resultados. Sai por baixo e volta na parada onde estava.
   */
  oculta?: boolean;
}

/**
 * Folha inferior do mobile.
 *
 * Feita à mão em vez de com o `Drawer` (vaul) porque esta folha não é um
 * modal: ela divide a tela com o mapa, que continua arrastável atrás dela, e
 * vive dentro do quadro do mapa — não do viewport. Um drawer modal escureceria
 * o mapa, travaria a rolagem da página e cobriria o header do site.
 *
 * A alça responde a arrasto e a clique: arrastar leva à parada pedida, clicar
 * avança para a próxima. As duas coisas porque o clique é o que funciona com
 * teclado e leitor de tela.
 */
function FolhaMobile({
  altura,
  onAltura,
  children,
  rotulo,
  oculta = false,
}: Props) {
  const trilho = useRef<HTMLDivElement>(null);
  const arrasto = useRef<{
    y: number;
    origem: Altura;
    fracao: number;
    ultimoY: number;
    ultimaHora: number;
    penultimoY: number;
    penultimaHora: number;
    andou: boolean;
  } | null>(null);
  /**
   * O `click` da alça nasce do mesmo `pointerup` que encerra o arrasto. Sem
   * esta marca, soltar a folha numa parada a empurraria na hora para a
   * seguinte — `preventDefault` no `pointerup` não impede o clique.
   */
  const arrastou = useRef(false);
  const [fracaoViva, setFracaoViva] = useState<number | null>(null);

  const fracao = fracaoViva ?? PARADAS[altura];

  /**
   * Para onde soltar.
   *
   * A parada mais próxima parecia teimosia: puxar meia tela e ver a folha
   * voltar para onde estava é o que dá a sensação de "vai e volta". Aqui manda
   * a direção do gesto — solta subindo, sobe; solta descendo, desce — e a
   * distância só decide se houve gesto: caminho curto e devagar é tremida, e aí
   * sim ela volta para a parada de origem.
   */
  function destino(
    origem: Altura,
    atual: number,
    deslocamento: number,
    velocidade: number,
  ) {
    const gesto =
      Math.abs(deslocamento) >= LIMIAR_PX ||
      Math.abs(velocidade) >= LIMIAR_VELOCIDADE;

    // A parada de origem é a de quando o dedo encostou, e não a prop de agora:
    // abrir a ficha no meio de um arrasto mudaria a altura por fora, e desistir
    // do gesto devolveria a folha para uma parada que não era a de partida.
    if (!gesto) return origem;

    const subindo = deslocamento > 0;
    const adiante = ORDEM.filter((parada) =>
      subindo ? PARADAS[parada] > atual : PARADAS[parada] < atual,
    );

    // Sem parada adiante o dedo já passou do fim do trilho: fica no extremo.
    if (!adiante.length) return subindo ? 'alta' : 'minima';

    // A primeira parada na direção do gesto, e não a mais próxima do dedo: quem
    // arrastou até o meio do caminho pediu o próximo degrau, não o anterior.
    return adiante.reduce((melhor, parada) =>
      subindo
        ? PARADAS[parada] < PARADAS[melhor]
          ? parada
          : melhor
        : PARADAS[parada] > PARADAS[melhor]
          ? parada
          : melhor,
    );
  }

  function onPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    // Gesto interrompido não deixa clique para consumir a marca; zerar aqui
    // evita que ela engula o próximo toque de verdade.
    arrastou.current = false;
    arrasto.current = {
      y: event.clientY,
      origem: altura,
      fracao: PARADAS[altura],
      ultimoY: event.clientY,
      ultimaHora: event.timeStamp,
      penultimoY: event.clientY,
      penultimaHora: event.timeStamp,
      andou: false,
    };
  }

  function onPointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    const inicio = arrasto.current;
    const caixa = trilho.current?.getBoundingClientRect();
    if (!inicio || !caixa) return;

    // Guardados dois quadros: a velocidade do fim do gesto é o que diz se foi
    // peteleco, e o último ponto sozinho não tem de quando comparar.
    inicio.penultimoY = inicio.ultimoY;
    inicio.penultimaHora = inicio.ultimaHora;
    inicio.ultimoY = event.clientY;
    inicio.ultimaHora = event.timeStamp;
    if (Math.abs(event.clientY - inicio.y) > LIMIAR_CLIQUE) inicio.andou = true;

    const delta = (inicio.y - event.clientY) / caixa.height;
    setFracaoViva(
      Math.min(PARADAS.alta, Math.max(PARADAS.minima, inicio.fracao + delta)),
    );
  }

  function onPointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    const inicio = arrasto.current;
    arrasto.current = null;

    if (inicio && fracaoViva !== null) {
      const deslocamento = inicio.y - inicio.ultimoY;
      const tempo = inicio.ultimaHora - inicio.penultimaHora;
      // Dedo parado antes de soltar não é peteleco: sem esta janela, a
      // velocidade do começo do gesto sobreviveria até o fim dele e mandaria a
      // folha embora depois de quem arrastou já ter escolhido onde parar.
      const parado = event.timeStamp - inicio.ultimaHora > 100;
      const velocidade =
        tempo > 0 && !parado
          ? (inicio.penultimoY - inicio.ultimoY) / tempo
          : 0;

      onAltura(destino(inicio.origem, fracaoViva, deslocamento, velocidade));
    }

    setFracaoViva(null);
    arrastou.current = !!inicio?.andou;
  }

  function proxima() {
    if (arrastou.current) {
      arrastou.current = false;
      return;
    }

    const indice = ORDEM.indexOf(altura);
    onAltura(ORDEM[(indice + 1) % ORDEM.length]);
  }

  return (
    <div
      ref={trilho}
      className='pointer-events-none absolute inset-0 z-40 flex flex-col justify-end'
    >
      <div
        role='region'
        aria-label={rotulo}
        style={{
          height: `${fracao * 100}%`,
          background: 'var(--map-surface)',
          boxShadow: '0 -10px 44px rgb(27 36 32 / 0.26)',
        }}
        inert={oculta}
        className={cn(
          'pointer-events-auto flex flex-col overflow-hidden rounded-t-3xl',
          fracaoViva === null &&
            'transition-[height,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
          oculta && 'pointer-events-none translate-y-full',
          ANIMA_ENTRA,
        )}
      >
        {/* Alça do tamanho do gesto, não do desenho: o risco tem 40px de
            largura, mas quem puxa mira a faixa inteira do topo da folha, e
            errar por 10px não pode significar não acontecer nada. */}
        <button
          type='button'
          onClick={proxima}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-label='Ajustar altura da lista'
          aria-expanded={altura !== 'minima'}
          className='grid h-11 w-full shrink-0 touch-none cursor-grab place-items-center active:cursor-grabbing'
        >
          <span
            aria-hidden='true'
            style={{ background: 'var(--map-line)' }}
            className='h-1 w-10 rounded-full'
          />
        </button>

        <div className='flex min-h-0 flex-1 flex-col'>{children}</div>
      </div>
    </div>
  );
}

export default FolhaMobile;
