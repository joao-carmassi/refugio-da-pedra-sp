import { SCRIPT_CAPTURA_URL } from '@/lib/pwa-instalacao';
import CartaoConvite from './cartao-convite';

/**
 * O convite de instalação do PWA do mapa, inteiro: o script que segura o
 * evento do navegador e o cartão que o usa.
 *
 * São duas peças porque uma delas precisa rodar antes do React. O Chrome
 * dispara `beforeinstallprompt` uma única vez, no fim do carregamento, e o
 * evento evapora se ninguém chamar `preventDefault` nele na hora — esperar a
 * hidratação para escutar é apostar que o React chega primeiro, o que nesta
 * rota é a aposta errada: a tela do mapa é o maior bundle do site. O script
 * guarda o evento numa variável que o hook lê quando montar.
 *
 * `src` + `async`, e não conteúdo inline: script inline escrito por componente
 * React não executa quando a rota é alcançada por navegação client-side. Nesta
 * forma o React 19 iça a tag para o `<head>`, executa e deduplica pelo `src`,
 * então os dois layouts do mapa podem renderizá-la sem se atropelar.
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
      <script src={SCRIPT_CAPTURA_URL} async />
      <CartaoConvite elevado={elevado} />
    </>
  );
}

export default ConviteInstalar;
