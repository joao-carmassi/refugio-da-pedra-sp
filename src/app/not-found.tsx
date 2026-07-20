import Link from 'next/link';

export default function NotFound() {
  return (
    <main className='min-h-container grid place-items-center py-6 md:py-12'>
      <div className='container flex flex-col items-center gap-4 text-center'>
        <h1 className='text-2xl tracking-tight md:text-4xl'>
          Página não encontrada
        </h1>
        <p className='text-muted-foreground'>
          A página que você procura não existe ou foi movida.
        </p>
        <Link href='/' className='underline underline-offset-4'>
          Voltar para a página inicial
        </Link>
      </div>
    </main>
  );
}
