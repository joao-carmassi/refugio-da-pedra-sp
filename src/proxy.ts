import { NextResponse, type NextRequest } from 'next/server';
import chales from '@/data/chales.json';
import slugify from 'slugify';

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const chale = chales.find((chale) => pathname === `/chales/${chale.id}/`);
  const url = request.nextUrl.clone();

  if (chale) {
    url.pathname = `/chales/${slugify(chale.nome, { lower: true, strict: true })}/`;
    return NextResponse.redirect(url, { status: 301 });
  }
}

export const config = {
  matcher: '/chales/:path*',
};
