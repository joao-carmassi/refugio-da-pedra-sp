import chales from '@/data/chales.json';
import { redirect } from 'next/navigation';
import slugify from 'slugify';

interface Props {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

async function ChaleLayout({
  children,
  params,
}: Props): Promise<React.ReactNode> {
  const { slug } = await params;
  const chale = chales.find(
    (c) => slugify(c.nome, { lower: true, strict: true }) === slug,
  );

  if (!chale) redirect('/chales');

  return <>{children}</>;
}

export default ChaleLayout;
