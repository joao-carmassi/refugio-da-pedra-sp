import { SCRIPT_CAPTURA } from '@/lib/pwa-instalacao';
import CartaoConvite from './cartao-convite';

/**
 * O convite de instalação do PWA do mapa, inteiro: o script que segura o
 * evento do navegador e o cartão que o usa.
 *
 * São duas peças porque uma delas precisa rodar antes do React. O Chrome
 * dispara `beforeinstallprompt` uma única vez, no fim do carregamento, e o
 * evento evapora se ninguém chamar `preventDefault` nele na hora — esperar a
 * hidratação para escutar é apostar que o React chega primeiro, o que nesta
 * rota é a aposta errada: a tela do mapa é o maior bundle do site. Este script
 * vai no HTML, roda na análise da página e guarda o evento numa variável que o
 * hook lê quando montar.
 *
 * Renderizar as duas juntas mantém os dois layouts do mapa com uma linha só,
 * e impede que um deles receba o cartão sem a captura.
 */
interface Props {
  /**
   * Sobe o cartão acima da pilha de controles do mapa no desktop. Ligado em
   * `/mapa/`, onde ela ocupa o mesmo canto; desligado em `/mapa-turistico/`,
   * que não tem controle nenhum ali.
   */
  elevado?: boolean;
}

function ConviteInstalar({ elevado = false }: Props): React.ReactNode {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_CAPTURA }} />
      <CartaoConvite elevado={elevado} />
    </>
  );
}

export default ConviteInstalar;
