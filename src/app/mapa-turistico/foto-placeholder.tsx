import { Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Hachura diagonal que ocupa o lugar da foto enquanto ela não existe. É o
 * mesmo gesto do cartão sem foto do mapa (`mapa-turistico/foto-local.tsx`),
 * só que em token de tema em vez de hex fixo — aqui o bloco vive na página
 * editorial, que tem variante escura.
 */
const HACHURA =
  'repeating-linear-gradient(135deg, transparent 0 8px, color-mix(in oklab, var(--border) 70%, transparent) 8px 16px)';

interface Props {
  /**
   * O que a foto vai mostrar. Fica visível como legenda — quem chega à página
   * antes das fotos vê o que está por vir, em vez de um retângulo cinza sem
   * explicação — e vira o `alt` quando a imagem entrar.
   */
  legenda: string;
  /** Proporção, cantos e o que mais o chamador precisar. */
  className?: string;
  /**
   * Versão para quadro pequeno — o cartão da galeria, por exemplo. A legenda
   * continua no documento, só que apenas para leitor de tela: escrita por
   * extenso num retângulo de 200 px ela transbordaria, e o cartão já diz o
   * nome do lugar logo abaixo.
   */
  compacta?: boolean;
}

/**
 * Espaço reservado de fotografia.
 *
 * A página foi escrita para ter foto e quase nenhum lugar tem a sua. Em vez
 * de publicá-la sem as imagens — e deixar o layout inteiro para refazer
 * depois — cada foto que falta entra como este bloco, com a proporção final já
 * ocupando o espaço; quem já tem foto cadastrada mostra a foto, e não passa
 * por aqui (ver `imagem` em `dados.ts`).
 *
 * TODO(proprietário): mandar as fotos. A legenda de cada bloco descreve o
 * enquadramento pedido.
 */
function FotoPlaceholder({
  legenda,
  className,
  compacta,
}: Props): React.ReactNode {
  return (
    <div
      style={{ backgroundImage: HACHURA }}
      className={cn(
        'flex flex-col items-center justify-center gap-2 overflow-hidden bg-muted p-6 text-center',
        className,
      )}
    >
      <Camera aria-hidden='true' className='size-5 text-muted-foreground' />
      <p className='text-[0.6875rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase'>
        Foto em breve
      </p>
      <p
        className={cn(
          'max-w-prose text-sm text-muted-foreground',
          compacta && 'sr-only',
        )}
      >
        {legenda}
      </p>
    </div>
  );
}

export default FotoPlaceholder;
