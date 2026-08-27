'use client';

import { ArrowLeft, Clock, MapPin, MessageCircle, Phone, Route } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { REFUGIO, getChegada, type Local } from '@/lib/mapa-turistico';
import { cn } from '@/lib/utils';
import BotaoMapa from './botao-mapa';
import GaleriaLocal from './galeria-local';
import { EtiquetaCategoria, Nota, Rotulo, SeloDestaque } from './etiquetas';

interface Props {
  local: Local;
  onVoltar: () => void;
  onRota: () => void;
  /** `false` dentro da folha do mobile, que já é a moldura. */
  moldura?: boolean;
  className?: string;
}

interface Info {
  icone: typeof Clock;
  rotulo: string;
  valor: string;
}

/**
 * Link de WhatsApp do próprio lugar, quando o telefone cadastrado é celular.
 *
 * Só celular porque fixo de igreja, museu e portaria não tem conta de
 * WhatsApp: o link abriria uma conversa com um número que nunca responde, o
 * que é pior do que não oferecer o botão. O teste é o formato brasileiro de
 * celular — DDD mais nove dígitos começando em 9.
 */
function getWhatsLocal(local: Local) {
  const numero = local.tel?.replace(/\D/g, '');

  if (!numero || !/^\d{2}9\d{8}$/.test(numero)) return null;

  const texto = `Olá! Vi ${local.nome} no mapa turístico do site do ${REFUGIO.nome} e queria saber mais.`;

  return `https://api.whatsapp.com/send?phone=55${numero}&text=${encodeURIComponent(texto)}`;
}

/**
 * Painel completo de um local.
 *
 * Só mostra linha de informação que existe de fato: horário sem confirmação,
 * telefone que não temos e nota não conferida simplesmente não aparecem, em
 * vez de virarem um traço ou um valor de mentira. A caixa "A partir do
 * Refúgio" é o que justifica o mapa existir dentro do site da pousada — é a
 * distância até aqui, não uma distância genérica. E é a distância até onde o
 * carro chega: cume e cachoeira ganham embaixo a linha do que falta a pé, que
 * é a diferença entre uma ficha honesta e um hóspede procurando
 * estacionamento a 4 km de trilha do lugar.
 */
function PainelDetalhes({
  local,
  onVoltar,
  onRota,
  moldura = true,
  className,
}: Props) {
  const infos: Info[] = [
    local.horario && {
      icone: Clock,
      rotulo: 'Horário',
      valor: local.horario,
    },
    { icone: MapPin, rotulo: 'Endereço', valor: local.endereco },
    local.tel && {
      icone: Phone,
      rotulo: 'Telefone',
      valor: local.tel,
    },
  ].filter(Boolean) as Info[];

  const whats = getWhatsLocal(local);
  const chegada = getChegada(local);

  return (
    <div
      role='region'
      aria-label={`Detalhes de ${local.nome}`}
      style={{
        background: 'var(--map-surface)',
        ...(moldura && {
          borderColor: 'var(--map-line)',
          boxShadow: 'var(--map-shadow-panel)',
        }),
      }}
      className={cn(
        'flex flex-col overflow-hidden',
        moldura && 'rounded-2xl border',
        className,
      )}
    >
      <div className='relative h-49 w-full shrink-0 overflow-hidden'>
        <GaleriaLocal local={local} sizes='(max-width: 768px) 100vw, 412px' />

        <button
          type='button'
          onClick={onVoltar}
          aria-label='Voltar'
          style={{
            background: 'var(--map-surface)',
            color: 'var(--map-ink)',
            boxShadow: 'var(--map-shadow-control)',
          }}
          className='absolute top-3.5 left-3.5 grid size-8.5 place-items-center rounded-full'
        >
          <ArrowLeft className='size-5' />
        </button>

      </div>

      <ScrollArea className='min-h-0 flex-1'>
        <div className='p-4.5'>
          <div className='flex flex-wrap items-center gap-2'>
            <EtiquetaCategoria local={local} />
            {local.destaque && <SeloDestaque />}
          </div>

          <h2
            style={{ color: 'var(--map-ink)' }}
            className='font-display mt-2 text-[27px] leading-[1.12] font-semibold'
          >
            {local.nome}
          </h2>

          {local.nota && (
            <p className='mt-2.5 flex flex-wrap items-center gap-2.5 text-[13px]'>
              <Nota local={local} />
              {local.avaliacoes && (
                <span style={{ color: 'var(--map-meta)' }}>
                  {local.avaliacoes.toLocaleString('pt-BR')} avaliações
                </span>
              )}
            </p>
          )}

          <div className='mt-4 flex gap-2.5'>
            <BotaoMapa onClick={onRota} className='flex-1'>
              <Route aria-hidden='true' />
              Como chegar
            </BotaoMapa>

            {/* O WhatsApp é o do próprio lugar: quem pergunta preço, horário
                de hoje ou se tem vaga quer falar com quem atende ali. Sem
                telefone cadastrado o botão some — mandar a conversa para outro
                destino só faria o visitante perguntar para quem não sabe. */}
            {whats && (
              <BotaoMapa tom='contorno' asChild className='flex-1'>
                <a href={whats} target='_blank' rel='noopener noreferrer'>
                  <MessageCircle aria-hidden='true' />
                  WhatsApp
                </a>
              </BotaoMapa>
            )}
          </div>

          {!local.refugio && (
            <div
              style={{
                background: 'var(--map-chip)',
                borderColor: 'var(--map-line)',
              }}
              className='mt-4.5 rounded-2xl border p-3.5'
            >
              <Rotulo>A partir do {REFUGIO.nome}</Rotulo>
              <p
                style={{ color: 'var(--map-green)' }}
                className='font-display mt-1.5 text-2xl font-semibold'
              >
                {chegada.carro}
              </p>

              {/* Cume, laje e setor de escalada não têm estrada até a porta. O
                  número de cima é o trecho de carro, e só ele — esta linha diz
                  onde o carro para e o que falta caminhar. Sem ela a ficha da
                  Pedra do Baú prometia um estacionamento que não existe. */}
              {chegada.aPe && (
                <p
                  style={{ color: 'var(--map-ink)' }}
                  className='mt-1.5 text-[13px] leading-relaxed text-pretty'
                >
                  {chegada.aPe}
                </p>
              )}
            </div>
          )}

          <p
            style={{ color: 'var(--map-body)' }}
            className='mt-4 text-sm leading-relaxed text-pretty'
          >
            {local.descricao ?? local.resumo}
          </p>

          <ul
            style={{ borderColor: 'var(--map-line)' }}
            className='mt-4.5 divide-y overflow-hidden rounded-2xl border'
          >
            {infos.map(({ icone: Icone, rotulo, valor }) => (
              <li
                key={rotulo}
                style={{ borderColor: 'var(--map-line)' }}
                className='flex items-start gap-3 p-3.5'
              >
                <Icone
                  aria-hidden='true'
                  className='mt-0.5 size-4.5 shrink-0'
                  style={{ color: 'var(--map-stone)' }}
                />
                <div className='min-w-0'>
                  <Rotulo>{rotulo}</Rotulo>
                  <p
                    style={{ color: 'var(--map-ink)' }}
                    className='mt-0.5 text-[13px]'
                  >
                    {valor}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {local.aConferir && (
            <p
              style={{ color: 'var(--map-meta)' }}
              className='mt-4 text-[11px] leading-normal'
            >
              Horários e condições de visitação mudam com a estação e o tempo.
              Confirme antes de subir a serra.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default PainelDetalhes;
