import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import chales from '@/data/chales.json';
import IChale from '@/interfaces/IChale';
import Link from 'next/link';
import 'slugify';
import slugify from 'slugify';

export const metadata = {
  title: 'Chales - Refúgio da Pedra SP',
  description:
    'Descubra chalés aconchegantes em meio à natureza, perfeitos para relaxar e renovar as energias. Opções para casais e pequenos grupos, algumas pet-friendly. Reserve já sua experiência única!',
};

function PaginaChales() {
  const path = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <main className="min-h-container delay-150 duration-500 animate-in fade-in ease-in-out fill-mode-both">
      <section className="w-full max-w-7xl px-6 md:px-12 py-6 md:pb-12 pt-6 md:gap-8 lg:gap-16 mx-auto">
        <h1 className="block text-center md:mb-8 text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl dark:text-white">
          Acomodações
        </h1>
        <ul className="grid p-5 md:p-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-10 grid-flow-row w-full h-full place-items-center">
          {chales.map((chale: IChale) => (
            <li key={chale.id}>
              <Card className="pt-0 border-0 shadow-xl">
                <CardDescription>
                  <Carousel className="w-full rounded-xl rounded-b-none">
                    <CarouselContent>
                      {chale.fotos_carrosel.map((foto, index) => (
                        <CarouselItem
                          className="rounded-xl rounded-b-none h-72"
                          key={index}
                        >
                          <img
                            className="rounded-xl rounded-b-none h-full w-full object-cover object-center"
                            src={`${path}/assets/refugio/chales/${chale.id}/refugio-${foto}.webp`}
                            alt=""
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </CardDescription>
                <CardContent className="flex flex-col gap-1.5">
                  <h2 className="text-lg font-bold">{chale.nome}</h2>
                  <p className="text-foreground/65 flex gap-1 items-center">
                    <svg
                      className="inline "
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="24"
                      height="24"
                      strokeWidth="2"
                    >
                      <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                      <path d="M6 21v-2a4 4 0 0 1 4 -4h4"></path>
                      <path d="M15 19l2 2l4 -4"></path>
                    </svg>
                    <span className="font-semibold">Capacidade:</span>
                    {chale.capacidade}
                  </p>
                  <p className="text-foreground/65 flex gap-1 items-center">
                    <svg
                      className="inline align-middle"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="24"
                      height="24"
                      strokeWidth="2"
                    >
                      <path d="M5 11m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                      <path d="M10 13h11v-2a3 3 0 0 0 -3 -3h-8v5z"></path>
                      <path d="M3 16h18"></path>
                    </svg>
                    <span className="font-semibold">
                      Cama{chale.camas.quantidade === 1 ? '' : 's'}:
                    </span>
                    {chale.camas.quantidade} {chale.camas.tipo}
                  </p>
                  <p className="text-foreground/65 flex gap-1 items-center">
                    <svg
                      className="inline align-middle"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="24"
                      height="24"
                      strokeWidth="2"
                    >
                      <path d="M6 10m-3 0a3 7 0 1 0 6 0a3 7 0 1 0 -6 0"></path>
                      <path d="M21 10c0 -3.866 -1.343 -7 -3 -7"></path>
                      <path d="M6 3h12"></path>
                      <path d="M21 10v10l-3 -1l-3 2l-3 -3l-3 2v-10"></path>
                      <path d="M6 10h.01"></path>
                    </svg>
                    <span className="font-semibold">
                      Banheiro{Number(chale.banheiros) === 1 ? '' : 's'}:
                    </span>
                    {chale.banheiros}
                  </p>
                  <p className="text-foreground/65 flex gap-1 items-center">
                    <svg
                      className="inline align-middle"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="24"
                      height="24"
                      strokeWidth="2"
                    >
                      <path d="M14.7 13.5c-1.1 -2 -1.441 -2.5 -2.7 -2.5c-1.259 0 -1.736 .755 -2.836 2.747c-.942 1.703 -2.846 1.845 -3.321 3.291c-.097 .265 -.145 .677 -.143 .962c0 1.176 .787 2 1.8 2c1.259 0 3 -1 4.5 -1s3.241 1 4.5 1c1.013 0 1.8 -.823 1.8 -2c0 -.285 -.049 -.697 -.146 -.962c-.475 -1.451 -2.512 -1.835 -3.454 -3.538z"></path>
                      <path d="M20.188 8.082a1.039 1.039 0 0 0 -.406 -.082h-.015c-.735 .012 -1.56 .75 -1.993 1.866c-.519 1.335 -.28 2.7 .538 3.052c.129 .055 .267 .082 .406 .082c.739 0 1.575 -.742 2.011 -1.866c.516 -1.335 .273 -2.7 -.54 -3.052z"></path>
                      <path d="M9.474 9c.055 0 .109 0 .163 -.011c.944 -.128 1.533 -1.346 1.32 -2.722c-.203 -1.297 -1.047 -2.267 -1.932 -2.267c-.055 0 -.109 0 -.163 .011c-.944 .128 -1.533 1.346 -1.32 2.722c.204 1.293 1.048 2.267 1.933 2.267z"></path>
                      <path d="M16.456 6.733c.214 -1.376 -.375 -2.594 -1.32 -2.722a1.164 1.164 0 0 0 -.162 -.011c-.885 0 -1.728 .97 -1.93 2.267c-.214 1.376 .375 2.594 1.32 2.722c.054 .007 .108 .011 .162 .011c.885 0 1.73 -.974 1.93 -2.267z"></path>
                      <path d="M5.69 12.918c.816 -.352 1.054 -1.719 .536 -3.052c-.436 -1.124 -1.271 -1.866 -2.009 -1.866c-.14 0 -.277 .027 -.407 .082c-.816 .352 -1.054 1.719 -.536 3.052c.436 1.124 1.271 1.866 2.009 1.866c.14 0 .277 -.027 .407 -.082z"></path>
                    </svg>
                    <span className="font-semibold">Pet:</span>
                    {chale.politica.pets_permitidos
                      ? 'Aceitamos'
                      : 'Não Aceitamos'}
                  </p>
                  <Button className="w-full" asChild>
                    <Link
                      href={`/chale/${slugify(chale.nome, {
                        strict: true,
                        lower: true,
                      })}`}
                    >
                      Ver mais
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default PaginaChales;
