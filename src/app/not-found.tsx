import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';

// A 404 é renderizada pelo layout raiz, que não monta mais o chrome — cada rota
// passou a montar o seu. Como aqui não há layout de rota intermediário, o
// cabeçalho e o rodapé vêm direto da página, senão ela ficaria sem navegação.
export default function NotFound() {
  return (
    <>
      <Header />
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
      <Footer />
    </>
  );
}
