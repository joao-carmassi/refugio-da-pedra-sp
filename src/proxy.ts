import { NextResponse, type NextRequest } from 'next/server';
import chales from '@/data/chales.json';
import slugify from 'slugify';

const BLOG_REDIRECTS: Record<string, string> = {
  '/blog/sao-bento-do-sapucai-a-toscana-brasileira-da-serra-da-mantiqueira/':
    '/blog/toscana-brasileira-sao-bento-do-sapucai/',
  '/blog/o-que-fazer-em-sao-bento-do-sapucai-em-1-dia-roteiro-completo/':
    '/blog/o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos/',
  '/blog/o-que-fazer-em-sao-bento-do-sapucai-a-noite-programas-noturnos-na-serra/':
    '/blog/o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos/',
  '/blog/campos-do-jordao-por-que-e-chamada-de-suica-brasileira/':
    '/blog/suica-brasileira-campos-do-jordao/',
  '/blog/sao-bento-do-sapucai-a-campos-do-jordao-distancia-rota-e-dicas/':
    '/blog/distancia-sao-bento-do-sapucai-campos-do-jordao/',
  '/blog/sao-bento-do-sapucai-e-a-revolucao-de-1932-historia-trincheiras-e-museu/':
    '/blog/revolucao-de-1932-sao-bento-do-sapucai/',
  '/blog/serra-da-mantiqueira-extensao-cidades-e-picos-mais-altos/':
    '/blog/extensao-da-serra-da-mantiqueira-cidades-e-picos/',
  '/blog/serra-da-mantiqueira-historia-origem-e-a-lenda-da-montanha-que-chora/':
    '/blog/historia-da-serra-da-mantiqueira-origem-e-lenda/',
  '/blog/serra-da-mantiqueira-hospedagem-no-refugio-da-pedra-em-sao-bento-do-sapucai/':
    '/blog/pousada-perto-da-pedra-do-bau-refugio-da-pedra/',
  '/blog/serra-da-mantiqueira-quantos-habitantes-e-quais-as-principais-cidades/':
    '/blog/habitantes-da-serra-da-mantiqueira-cidades-principais/',
  '/blog/refugio-da-pedra-a-pousada-mais-proxima-da-pedra-do-bau/':
    '/blog/pousada-perto-da-pedra-do-bau-refugio-da-pedra/',
  '/blog/quantos-quilometros-tem-de-sao-paulo-a-sao-bento-do-sapucai-rotas-e-dicas/':
    '/blog/distancia-sao-paulo-sao-bento-do-sapucai-rotas-e-dicas/',
  '/blog/artesanato-em-sao-bento-do-sapucai-guia-completo-ditinho-joana-arte-no-quilombo-arteben-e-mais/':
    '/blog/artesanato-em-sao-bento-do-sapucai-guia-completo/',
};

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const url = request.nextUrl.clone();

  // Blog slug redirects (SEO consolidation)
  if (pathname in BLOG_REDIRECTS) {
    url.pathname = BLOG_REDIRECTS[pathname];
    return NextResponse.redirect(url, { status: 301 });
  }

  // Chalé ID → slug redirects
  const chale = chales.find((chale) => pathname === `/chales/${chale.id}/`);
  if (chale) {
    url.pathname = `/chales/${slugify(chale.nome, { lower: true, strict: true })}/`;
    return NextResponse.redirect(url, { status: 301 });
  }
}

export const config = {
  matcher: ['/chales/:path*', '/blog/:path*'],
};
