/* Hallmark · F3 folha de especificação · knobs: ícone+valor, fio em toda linha, display serif, tabular-nums */
import { Bath, BedDouble, PawPrint, Scaling, Users } from 'lucide-react';
import { nomeCorrido, type Chale } from './types';

interface Props {
  chale: Chale;
}

/**
 * Faixa de dados da unidade, colada na aresta inferior da fotografia de
 * abertura. Em macroestrutura fotográfica a borda da imagem já é o divisor, por
 * isso a banda não leva regra em cima — só os fios internos das células e um
 * fio embaixo, que é o que fecha a banda no tema escuro (lá `--card` e
 * `--background` são a mesma cor e a mudança de fundo não aparece).
 */
function Ficha({ chale }: Props): React.ReactNode {
  // Continua sem rótulos: os próprios valores já dizem o que são ("Até 2
  // pessoas", "30 m²"). Quem carrega a identidade do campo é o ícone, que
  // também é o que ancora a leitura — a versão anterior era só texto cinza de
  // 14px em sete colunas, e sem nenhum ponto de fixação a faixa lia como
  // rodapé da foto em vez de ficha da unidade.
  const numeros = [
    { Icone: Users, valor: chale.capacidade },
    { Icone: BedDouble, valor: chale.camas },
    { Icone: Bath, valor: chale.banheiros },
    // `Scaling` (quadrado + seta) e não `Ruler`: a régua diagonal do lucide, a
    // 18px, lê como etiqueta de preço.
    { Icone: Scaling, valor: chale.tamanho },
  ];

  // Segundo nível: o que a unidade tem, não quanto ela tem. São listas de
  // tamanho variável ("Suíte" contra "Suíte · Sala integrada com cozinha ·
  // Mezanino"), então entram numa linha corrida que reflui, e não em células
  // de grade — em sete colunas fixas o item longo quebrava em três linhas ao
  // lado de um "Deck" de uma palavra só.
  const qualificadores = [...chale.ambientes, ...chale.area_externa];

  return (
    <section
      aria-label={`Ficha do ${nomeCorrido(chale.nome)}`}
      className='border-b border-border bg-card'
    >
      <div className='container'>
        {/* Sem `gap-x`: o respiro entre colunas é `pr-6` dentro da célula, para
            que os fios de topo se encostem e formem uma régua contínua de
            ponta a ponta. Com gap a linha saía picotada — que é o oposto do
            que a ficha promete. */}
        <ul className='grid grid-cols-2 lg:grid-cols-4'>
          {numeros.map(({ Icone, valor }) => (
            <li
              key={valor}
              className='flex items-center gap-2.5 py-4 pr-4 md:gap-3 md:py-5 md:pr-6'
            >
              <Icone
                aria-hidden='true'
                size={18}
                strokeWidth={1.5}
                className='shrink-0 text-muted-foreground'
              />
              {/* Serifada e no tom cheio do texto: é o mesmo tipo do H1 logo
                  acima, então a ficha soa como continuação da legenda da foto e
                  não como chrome de aplicativo. Escala em três passos porque em
                  320px a coluna tem ~86px úteis — em `text-base` "Até 2
                  pessoas" já quebra em duas linhas. */}
              <span className='min-w-0 font-display text-sm leading-snug tabular-nums md:text-base lg:text-lg'>
                {valor}
              </span>
            </li>
          ))}
        </ul>

        <div className='flex flex-wrap items-center border-t border-border py-3.5 text-sm leading-snug text-muted-foreground'>
          {qualificadores.map((item) => (
            // O interponto é decoração: vive no `::after` para não entrar no
            // texto lido em voz alta nem virar um nó órfão na quebra de linha.
            <span
              key={item}
              className='after:mx-2 after:opacity-40 after:content-["·"]'
            >
              {item}
            </span>
          ))}
          {/* Pets fecha a linha. Sem risco no texto — riscar a frase que diz
              "não permitido" nega a própria negação; a pata apagada faz esse
              trabalho. */}
          <span className='flex items-center gap-1.5'>
            <PawPrint
              aria-hidden='true'
              size={15}
              strokeWidth={2}
              className={`shrink-0 ${chale.politica.pets_permitidos ? '' : 'opacity-40'}`}
            />
            {chale.politica.pets_permitidos
              ? 'Pets permitidos'
              : 'Pets não permitidos'}
          </span>
        </div>
      </div>
    </section>
  );
}

export default Ficha;
