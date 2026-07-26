import LinhaFio from './linha-fio';
import { nomeCorrido, type Chale } from './types';

// Comodidades da pousada — valem para as cinco acomodações. Entram no fim da
// lista da unidade, e não em bloco próprio: para quem está escolhendo onde
// dormir, "o que este chalé tem" é uma pergunta só, e dividi-la em duas listas
// obrigava a ler as duas para responder.
const COMODIDADES_DA_POUSADA = [
  'Café da manhã incluso',
  'Wi-Fi gratuito',
  'Estacionamento na propriedade',
];

interface Props {
  chale: Chale;
}

/**
 * Lista única: o que é da unidade primeiro, o que vale para as cinco
 * acomodações em seguida.
 *
 * Sem nota "incluído em todas as hospedagens" por item — a grade de duas
 * colunas preenche por linha, então os três itens da pousada caem em posições
 * salteadas e a mesma nota apareceria três vezes, espalhada. Nada aqui fica
 * falso: café, wi-fi e estacionamento são do hóspede desta unidade também. A
 * distinção continua em /chales/ e no `amenityFeature` do JSON-LD, que segue
 * listando só o que é da unidade.
 */
function Comodidades({ chale }: Props): React.ReactNode {
  const itens = [
    ...chale.comodidades,
    ...COMODIDADES_DA_POUSADA.filter((c) => !chale.comodidades.includes(c)),
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl tracking-tight text-pretty md:text-2xl">
        Comodidades do {nomeCorrido(chale.nome)}
      </h2>
      <ul className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
        {itens.map((comodidade) => (
          <LinhaFio key={comodidade}>{comodidade}</LinhaFio>
        ))}
      </ul>
    </div>
  );
}

export default Comodidades;
