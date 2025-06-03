import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const HeroPrincipal = () => {
  const path = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <section className="min-h-container flex items-center justify-center">
      <div className="max-w-7xl w-full place-items-center mx-auto grid lg:grid-cols-2 gap-6 md:gap-12 p-6 md:px-12 pt-0 md:pt-6">
        <div>
          <h1 className="mt-4 md:mt-0 max-w-[17ch] text-4xl md:text-5xl xl:text-6xl font-bold !leading-[1.2]">
            <span className="text-primary">Refúgio da Pedra SP</span> Sua
            jornada de tranquilidade.
          </h1>
          <p className="mt-5 max-w-[60ch] text-foreground/85 text-lg">
            Venha se aventurar em um mundo onde a natureza e o conforto se
            encontram, em meio à grandiosa Serra da Mantiqueira.
          </p>
          <div className="mt-7 flex items-center gap-4">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="shadow-xs text-sm tracking-wide"
            >
              <a href="https://api.whatsapp.com/send?phone=5512996148154&text=Ola, vim pelo site da pousada e gostaria de fazer uma reserva">
                Entre em contato
              </a>
            </Button>
            <Button
              className="text-sm tracking-wide hidden md:flex"
              asChild
              size="lg"
              effect="expandIcon"
              icon={ArrowRightIcon}
              iconPlacement="right"
            >
              <Link href="/reservar">Reservar</Link>
            </Button>
            <Button
              className="text-sm tracking-wide md:hidden"
              asChild
              size="lg"
              effect="ringHover"
            >
              <Link href="/reservar">Reservar</Link>
            </Button>
          </div>
          <div className="mt-5 lg:mt-10 grid grid-cols-2 gap-x-5">
            <div>
              <div className="flex gap-x-1">
                <svg
                  className="size-4 text-gray-800 dark:text-neutral-200"
                  width="51"
                  height="51"
                  viewBox="0 0 51 51"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M27.0352 1.6307L33.9181 16.3633C34.2173 16.6768 34.5166 16.9903 34.8158 16.9903L50.0779 19.1845C50.9757 19.1845 51.275 20.4383 50.6764 21.0652L39.604 32.3498C39.3047 32.6632 39.3047 32.9767 39.3047 33.2901L41.998 49.2766C42.2973 50.217 41.1002 50.8439 40.5017 50.5304L26.4367 43.3208C26.1375 43.3208 25.8382 43.3208 25.539 43.3208L11.7732 50.8439C10.8754 51.1573 9.97763 50.5304 10.2769 49.59L12.9702 33.6036C12.9702 33.2901 12.9702 32.9767 12.671 32.6632L1.29923 21.0652C0.700724 20.4383 0.999979 19.4979 1.89775 19.4979L17.1598 17.3037C17.459 17.3037 17.7583 16.9903 18.0575 16.6768L24.9404 1.6307C25.539 0.69032 26.736 0.69032 27.0352 1.6307Z"
                    fill="currentColor"
                  />
                </svg>
                <svg
                  className="size-4 text-gray-800 dark:text-neutral-200"
                  width="51"
                  height="51"
                  viewBox="0 0 51 51"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M27.0352 1.6307L33.9181 16.3633C34.2173 16.6768 34.5166 16.9903 34.8158 16.9903L50.0779 19.1845C50.9757 19.1845 51.275 20.4383 50.6764 21.0652L39.604 32.3498C39.3047 32.6632 39.3047 32.9767 39.3047 33.2901L41.998 49.2766C42.2973 50.217 41.1002 50.8439 40.5017 50.5304L26.4367 43.3208C26.1375 43.3208 25.8382 43.3208 25.539 43.3208L11.7732 50.8439C10.8754 51.1573 9.97763 50.5304 10.2769 49.59L12.9702 33.6036C12.9702 33.2901 12.9702 32.9767 12.671 32.6632L1.29923 21.0652C0.700724 20.4383 0.999979 19.4979 1.89775 19.4979L17.1598 17.3037C17.459 17.3037 17.7583 16.9903 18.0575 16.6768L24.9404 1.6307C25.539 0.69032 26.736 0.69032 27.0352 1.6307Z"
                    fill="currentColor"
                  />
                </svg>
                <svg
                  className="size-4 text-gray-800 dark:text-neutral-200"
                  width="51"
                  height="51"
                  viewBox="0 0 51 51"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M27.0352 1.6307L33.9181 16.3633C34.2173 16.6768 34.5166 16.9903 34.8158 16.9903L50.0779 19.1845C50.9757 19.1845 51.275 20.4383 50.6764 21.0652L39.604 32.3498C39.3047 32.6632 39.3047 32.9767 39.3047 33.2901L41.998 49.2766C42.2973 50.217 41.1002 50.8439 40.5017 50.5304L26.4367 43.3208C26.1375 43.3208 25.8382 43.3208 25.539 43.3208L11.7732 50.8439C10.8754 51.1573 9.97763 50.5304 10.2769 49.59L12.9702 33.6036C12.9702 33.2901 12.9702 32.9767 12.671 32.6632L1.29923 21.0652C0.700724 20.4383 0.999979 19.4979 1.89775 19.4979L17.1598 17.3037C17.459 17.3037 17.7583 16.9903 18.0575 16.6768L24.9404 1.6307C25.539 0.69032 26.736 0.69032 27.0352 1.6307Z"
                    fill="currentColor"
                  />
                </svg>
                <svg
                  className="size-4 text-gray-800 dark:text-neutral-200"
                  width="51"
                  height="51"
                  viewBox="0 0 51 51"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M27.0352 1.6307L33.9181 16.3633C34.2173 16.6768 34.5166 16.9903 34.8158 16.9903L50.0779 19.1845C50.9757 19.1845 51.275 20.4383 50.6764 21.0652L39.604 32.3498C39.3047 32.6632 39.3047 32.9767 39.3047 33.2901L41.998 49.2766C42.2973 50.217 41.1002 50.8439 40.5017 50.5304L26.4367 43.3208C26.1375 43.3208 25.8382 43.3208 25.539 43.3208L11.7732 50.8439C10.8754 51.1573 9.97763 50.5304 10.2769 49.59L12.9702 33.6036C12.9702 33.2901 12.9702 32.9767 12.671 32.6632L1.29923 21.0652C0.700724 20.4383 0.999979 19.4979 1.89775 19.4979L17.1598 17.3037C17.459 17.3037 17.7583 16.9903 18.0575 16.6768L24.9404 1.6307C25.539 0.69032 26.736 0.69032 27.0352 1.6307Z"
                    fill="currentColor"
                  />
                </svg>
                <svg
                  className="size-4 text-gray-800 dark:text-neutral-200"
                  width="51"
                  height="51"
                  viewBox="0 0 51 51"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M27.0352 1.6307L33.9181 16.3633C34.2173 16.6768 34.5166 16.9903 34.8158 16.9903L50.0779 19.1845C50.9757 19.1845 51.275 20.4383 50.6764 21.0652L39.604 32.3498C39.3047 32.6632 39.3047 32.9767 39.3047 33.2901L41.998 49.2766C42.2973 50.217 41.1002 50.8439 40.5017 50.5304L26.4367 43.3208C26.1375 43.3208 25.8382 43.3208 25.539 43.3208L11.7732 50.8439C10.8754 51.1573 9.97763 50.5304 10.2769 49.59L12.9702 33.6036C12.9702 33.2901 12.9702 32.9767 12.671 32.6632L1.29923 21.0652C0.700724 20.4383 0.999979 19.4979 1.89775 19.4979L17.1598 17.3037C17.459 17.3037 17.7583 16.9903 18.0575 16.6768L24.9404 1.6307C25.539 0.69032 26.736 0.69032 27.0352 1.6307Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <p className="mt-3 text-sm text-gray-800 dark:text-neutral-200">
                <span className="font-bold">9.4</span> /10
              </p>
              <div className="mt-3">
                <img
                  className="h-7"
                  src="https://static.cdnlogo.com/logos/b/94/booking-com.svg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="lg:pl-5 lg:pb-5 rounded-xl"
          style={{
            backgroundImage:
              'conic-gradient(from 60deg at 50% 50%, var(--background), var(--background), var(--background), #e5e7eb, #e5e7eb, var(--background), var(--background), var(--background))',
          }}
        >
          <img
            className="w-full rounded-xl"
            src={`${path}/assets/refugio/geral/refugio-14.webp`}
            alt=""
          />
        </div>
      </div>
    </section>
  );
};

export default HeroPrincipal;
