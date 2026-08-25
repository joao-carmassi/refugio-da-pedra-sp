import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Props {
  href: string;
  children: React.ReactNode;
}

/**
 * O link tipográfico da casa (design.md, micro-ação C3): palavra, sublinhado
 * de 1px e seta. Fica num componente porque esta página o usa em quatro
 * seções — categorias, zonas, perguntas e fecho — e a alternativa era repetir
 * a mesma fila de classes oito vezes.
 *
 * `href` sempre com barra final: `trailingSlash: true` no next.config.ts faz
 * o Next responder 308 antes de servir a página.
 */
function LinkLeitura({ href, children }: Props): React.ReactNode {
  return (
    <Link
      href={href}
      className='inline-flex items-center gap-1.5 rounded-xs text-sm font-medium text-accent-deep underline decoration-1 underline-offset-4 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50'
    >
      {children}
      <ArrowRight aria-hidden='true' className='size-4' />
    </Link>
  );
}

export default LinkLeitura;
