/* Hallmark · genre: editorial · macrostructure: Narrative Workflow · design-system: design.md · designed-as-app
 * archetypes: F4 step sequence · C4 sticky bottom bar
 * pre-emit critique: P5 H4 E4 S5 R5 V4
 * contrast: pass (40–41) · honest: pass (46) · chrome: pass (47) · tokens: pass (48)
 * mobile: pass (49, 50–53) · gate 34: overflow-x clipado na rota, não em html/body
 * enrichment: none — página de app; a foto de fundo saiu (ver nota no cabeçalho do Form)
 */
import { Fragment } from 'react';
import Form from './form';

// Mesmo gutter das outras rotas redesenhadas: 20px abaixo de `sm`, 32px acima.
// Não usa a utility `container` (padding-inline: 2rem) no mobile porque 32px de
// cada lado em 320px deixam 256px — largura em que as linhas de acomodação e o
// resumo quebram. O `max-w` existe para o formulário não virar uma coluna de
// 1400px em telas largas.
const SHELL = 'mx-auto w-full max-w-5xl px-5 sm:px-8';

// Fatos operacionais fixos da pousada. Ficam no topo, antes do formulário,
// porque são o que decide se a pessoa continua preenchendo — e não no rodapé
// de letra miúda, onde estavam.
const FATOS: [string, string][] = [
  ['Check-in', 'a partir das 14h'],
  ['Check-out', 'até as 12h'],
  ['Café da manhã', 'incluso'],
];

function ReservarPage(): React.ReactNode {
  return (
    // `overflow-x-clip` e não `hidden`: `clip` não cria scroll port, então a
    // barra `sticky` do rodapé continua ancorada na viewport. Fica na rota, não
    // no `html`/`body`, para não mexer no CSS global das outras páginas.
    <main className='overflow-x-clip lg:pb-10 animate-in fade-in duration-300 fill-mode-both motion-reduce:animate-none lg:pt-8 lg:pb-16'>
      <div className={`${SHELL} pt-6 lg:pt-0`}>
        <h1 className='max-w-[20ch] text-3xl tracking-tight text-balance [overflow-wrap:anywhere] sm:text-4xl lg:text-5xl'>
          Reserve sua estadia
        </h1>

        <p className='mt-4 max-w-[60ch] leading-relaxed text-muted-foreground'>
          Chalés, cabana e domo em São Bento do Sapucaí, na Serra da
          Mantiqueira, a 1,5 km da Pedra do Baú. São quatro passos: escolher a
          acomodação, as datas, quem vem — e enviar. A solicitação chega ao
          nosso WhatsApp já escrita.
        </p>

        {/* Ficha de fatos em fios, na mesma linguagem do spec sheet das páginas
            de chalé. Uma coluna no mobile; a trilha do rótulo é `minmax(0, …)`
            para encolher em 320px em vez de empurrar o valor para fora. */}
        <dl className='mt-8 grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] text-sm sm:text-base'>
          {FATOS.map(([rotulo, valor]) => (
            <Fragment key={rotulo}>
              <dt className='border-t border-border py-2.5 text-foreground'>
                {rotulo}
              </dt>
              <dd className='border-t border-border py-2.5 text-muted-foreground'>
                {valor}
              </dd>
            </Fragment>
          ))}
        </dl>
      </div>

      <Form />
    </main>
  );
}

export default ReservarPage;
