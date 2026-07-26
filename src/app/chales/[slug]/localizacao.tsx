import { MapPin } from 'lucide-react';
import { nomeCorrido, type Chale } from './types';

interface Props {
  chale: Chale;
}

/**
 * Fecha a coluna de texto situando a unidade. Não é um mapa — a homepage já
 * tem o embed; aqui basta a distância até a Pedra do Baú, que é o dado pelo
 * qual quem reserva escolhe a região.
 */
function Localizacao({ chale }: Props): React.ReactNode {
  return (
    <p className="flex max-w-[62ch] items-start gap-2 leading-relaxed text-muted-foreground">
      <MapPin aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" />
      <span>
        {nomeCorrido(chale.nome)} fica em São Bento do Sapucaí (SP), na Serra da
        Mantiqueira, a 1,5 km da Pedra do Baú — ponto de partida das trilhas e
        das vias de escalada da região.
      </span>
    </p>
  );
}

export default Localizacao;
