/* Hallmark · F3 folha de especificação · knobs: colunas=1 (só valor), fio em toda linha, tabular-nums */
import { PawPrint } from 'lucide-react';
import { nomeCorrido, type Chale } from './types';

interface Props {
  chale: Chale;
}

/**
 * Faixa de dados da unidade, colada na aresta inferior da fotografia de
 * abertura. Em macroestrutura fotográfica a borda da imagem já é o divisor, por
 * isso a banda não leva regra em cima — só os fios internos das células.
 */
function Ficha({ chale }: Props): React.ReactNode {
  // Só os valores, sem rótulos. Em voz fotográfica a linha é uma anotação de
  // legenda, não uma tabela — e os próprios valores já dizem o que são
  // ("Até 2 pessoas", "1 cama Queen", "30 m²").
  const valores = [
    chale.capacidade,
    chale.camas,
    chale.banheiros,
    chale.tamanho,
    chale.ambientes.join(' · '),
    chale.area_externa.join(' · '),
  ];

  return (
    <section
      aria-label={`Ficha do ${nomeCorrido(chale.nome)}`}
      className="bg-card"
    >
      <div className="container">
        {/* Sete colunas em `lg` — seis valores mais a política de pets. Com
            seis, a célula de pets caía sozinha numa segunda faixa e o fio
            curto embaixo lia como sobra. */}
        <ul className="grid grid-cols-2 gap-x-8 sm:grid-cols-3 lg:grid-cols-7">
          {valores.map((valor) => (
            <li
              key={valor}
              className="border-t border-border py-3 text-sm leading-snug text-muted-foreground tabular-nums"
            >
              {valor}
            </li>
          ))}
          {/* Pets fecha a ficha como sétima célula, não como faixa própria:
              uma linha inteira só para a política de animais desequilibrava a
              banda. Sem risco no texto — riscar a frase que diz "não
              permitido" nega a própria negação. */}
          <li className="flex items-start gap-2 border-t border-border py-3 text-sm leading-snug text-muted-foreground">
            <PawPrint
              aria-hidden="true"
              size={16}
              strokeWidth={2.2}
              className={`mt-0.5 shrink-0 ${chale.politica.pets_permitidos ? '' : 'opacity-50'}`}
            />
            {chale.politica.pets_permitidos
              ? 'Pets permitidos'
              : 'Não permitido neste chalé'}
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Ficha;
