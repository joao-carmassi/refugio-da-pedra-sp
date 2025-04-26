function Comodidades() {
  return (
    <section className="items-center px-4 flex-col-reverse gap-5 lg:px-28 md:flex-row flex">
      <div className="w-full grid place-items-center">
        <img
          className="w-[35rem] rounded-2xl shadow-md"
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/pousada/fogueira/refugio-7.webp`}
          alt=""
        />
      </div>
      <div className="w-full flex flex-col gap-3">
        <h2 className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white">
          Comodidades:
        </h2>
        <p className="mt-3 text-lg text-gray-800 dark:text-neutral-400">
          Nos importamos com o seu conforto, por isso sua reserva inclui uma
          série de comodidades para tornar sua estadia ainda mais especial:
        </p>
        <div className="hs-accordion-group">
          <div className="hs-accordion active" id="hs-basic-heading-one">
            <button
              className="hs-accordion-toggle hs-accordion-active:text-yellow-600 py-3 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 hover:text-gray-500 focus:outline-hidden focus:text-gray-500 rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-yellow-600 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
              aria-expanded="true"
              aria-controls="hs-basic-collapse-one"
            >
              <svg
                className="hs-accordion-active:hidden block size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              <svg
                className="hs-accordion-active:block hidden size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
              </svg>
              Estacionamento privativo
            </button>
            <div
              id="hs-basic-collapse-one"
              className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
              role="region"
              aria-labelledby="hs-basic-heading-one"
            >
              <p className="text-gray-800 dark:text-neutral-200">
                Cada chalé possui seu próprio estacionamento individual,
                oferecendo segurança e praticidade durante toda a sua
                hospedagem.
              </p>
            </div>
          </div>

          <div className="hs-accordion" id="hs-basic-heading-two">
            <button
              className="hs-accordion-toggle hs-accordion-active:text-yellow-600 py-3 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 hover:text-gray-500 focus:outline-hidden focus:text-gray-500 rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-yellow-600 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
              aria-expanded="false"
              aria-controls="hs-basic-collapse-two"
            >
              <svg
                className="hs-accordion-active:hidden block size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              <svg
                className="hs-accordion-active:block hidden size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
              </svg>
              Wifi Gratuito
            </button>
            <div
              id="hs-basic-collapse-two"
              className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
              role="region"
              aria-labelledby="hs-basic-heading-two"
            >
              <p className="text-gray-800 dark:text-neutral-200">
                Fique sempre conectado! Nossos chalés oferecem Wi-Fi gratuito
                para que você possa compartilhar os melhores momentos da sua
                estadia, sem perder o contato com o mundo.
              </p>
            </div>
          </div>

          <div className="hs-accordion" id="hs-basic-heading-three">
            <button
              className="hs-accordion-toggle hs-accordion-active:text-yellow-600 py-3 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 hover:text-gray-500 focus:outline-hidden focus:text-gray-500 rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-yellow-600 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
              aria-expanded="false"
              aria-controls="hs-basic-collapse-three"
            >
              <svg
                className="hs-accordion-active:hidden block size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              <svg
                className="hs-accordion-active:block hidden size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
              </svg>
              Pet Friendly
            </button>
            <div
              id="hs-basic-collapse-three"
              className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
              role="region"
              aria-labelledby="hs-basic-heading-three"
            >
              <p className="text-gray-800 dark:text-neutral-200">
                Entendemos que os animais de estimação são parte da família. Por
                isso, somos pet-friendly e ficaremos felizes em receber o seu
                amigo peludo durante a sua estadia.
              </p>
            </div>
          </div>
          <div className="hs-accordion" id="hs-basic-heading-three">
            <button
              className="hs-accordion-toggle hs-accordion-active:text-yellow-600 py-3 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 hover:text-gray-500 focus:outline-hidden focus:text-gray-500 rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-yellow-600 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
              aria-expanded="false"
              aria-controls="hs-basic-collapse-three"
            >
              <svg
                className="hs-accordion-active:hidden block size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              <svg
                className="hs-accordion-active:block hidden size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
              </svg>
              Crianças
            </button>
            <div
              id="hs-basic-collapse-three"
              className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
              role="region"
              aria-labelledby="hs-basic-heading-three"
            >
              <p className="text-gray-800 dark:text-neutral-200">
                Valorizamos a presença das famílias em nosso espaço. Para tornar
                a experiência ainda mais acessível, permitimos a estadia de
                crianças a partir dos 13 anos. É nossa maneira de compartilhar
                momentos especiais com todos, oferecendo conforto e praticidade
                para a família.
              </p>
            </div>
          </div>
          <div className="hs-accordion" id="hs-basic-heading-three">
            <button
              className="hs-accordion-toggle hs-accordion-active:text-yellow-600 py-3 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 hover:text-gray-500 focus:outline-hidden focus:text-gray-500 rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-yellow-600 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
              aria-expanded="false"
              aria-controls="hs-basic-collapse-three"
            >
              <svg
                className="hs-accordion-active:hidden block size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              <svg
                className="hs-accordion-active:block hidden size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
              </svg>
              Café da manhã
            </button>
            <div
              id="hs-basic-collapse-three"
              className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
              role="region"
              aria-labelledby="hs-basic-heading-three"
            >
              <p className="text-gray-800 dark:text-neutral-200">
                O nosso café utiliza produtos típicos da região, como pães
                caseiros, bolos, pão de queijo, geleias, manteiga, leite, café,
                sucos e frutas. O hóspede pode consumi-lo no deck principal,
                desfrutando de uma bela vista das montanhas.
              </p>
            </div>
          </div>
          <div className="hs-accordion" id="hs-basic-heading-three">
            <button
              className="hs-accordion-toggle hs-accordion-active:text-yellow-600 py-3 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 hover:text-gray-500 focus:outline-hidden focus:text-gray-500 rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-yellow-600 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
              aria-expanded="false"
              aria-controls="hs-basic-collapse-three"
            >
              <svg
                className="hs-accordion-active:hidden block size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              <svg
                className="hs-accordion-active:block hidden size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
              </svg>
              Check-in e check-out
            </button>
            <div
              id="hs-basic-collapse-three"
              className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
              role="region"
              aria-labelledby="hs-basic-heading-three"
            >
              <p className="text-gray-800 dark:text-neutral-200">
                O seu descanso começa às 14h (check-in), e se estende até o
                meio-dia (check-out), para que você possa aproveitar cada minuto
                da estadia.
              </p>
            </div>
          </div>
          <div className="hs-accordion" id="hs-basic-heading-three">
            <button
              className="hs-accordion-toggle hs-accordion-active:text-yellow-600 py-3 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 hover:text-gray-500 focus:outline-hidden focus:text-gray-500 rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-yellow-600 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
              aria-expanded="false"
              aria-controls="hs-basic-collapse-three"
            >
              <svg
                className="hs-accordion-active:hidden block size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              <svg
                className="hs-accordion-active:block hidden size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
              </svg>
              Roupas de cama e toalhas
            </button>
            <div
              id="hs-basic-collapse-three"
              className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
              role="region"
              aria-labelledby="hs-basic-heading-three"
            >
              <p className="text-gray-800 dark:text-neutral-200">
                Roupas de cama macias, toalhas de banho e rosto estão incluidas
                na reserva sempre prontas para o seu conforto.
              </p>
            </div>
          </div>
          <div className="hs-accordion" id="hs-basic-heading-three">
            <button
              className="hs-accordion-toggle hs-accordion-active:text-yellow-600 py-3 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 hover:text-gray-500 focus:outline-hidden focus:text-gray-500 rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:text-yellow-600 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
              aria-expanded="false"
              aria-controls="hs-basic-collapse-three"
            >
              <svg
                className="hs-accordion-active:hidden block size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
              <svg
                className="hs-accordion-active:block hidden size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
              </svg>
              Pedra do Baú
            </button>
            <div
              id="hs-basic-collapse-three"
              className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
              role="region"
              aria-labelledby="hs-basic-heading-three"
            >
              <p className="text-gray-800 dark:text-neutral-200">
                A apenas 1,5 km da Pedra do Baú, nossa pousada esta localizada
                no local perfeito para quem gosta de explorar a natureza.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Comodidades;
