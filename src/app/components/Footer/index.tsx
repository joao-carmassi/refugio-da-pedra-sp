import Link from 'next/link';

function Footer() {
  return (
    <footer className="mt-auto w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto dark:bg-neutral-900">
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-5">
        <div>
          <Link
            className="flex-none text-xl font-semibold text-black focus:outline-hidden dark:text-white"
            href="/"
            aria-label="Brand"
          >
            Refúgio da Pedra SP
          </Link>
        </div>
        <ul className="text-center">
          <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 dark:before:text-neutral-600">
            <Link
              className="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
              href="/"
            >
              Home
            </Link>
          </li>
          <li className="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 dark:before:text-neutral-600">
            <Link
              className="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
              href="/chales"
            >
              Chalés
            </Link>
          </li>
        </ul>
        <div className="md:text-end space-x-2">
          <a
            aria-label="Pagina do Refugio da Pedra SP do google"
            className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            href="https://www.google.com/search?q=Ref%C3%BAgio+da+Pedra+Sp&sca_esv=f8ded6305c32e328&sxsrf=AHTn8zpP39Gg0Bio0OMCl3H5lXrP_85Gqw%3A1741978706336&ei=UnzUZ8acFITb1sQPlZncuQc&hotel_occupancy=&ved=0ahUKEwjGjf2voIqMAxWErZUCHZUMN3cQ4dUDCBA&uact=5&oq=Ref%C3%BAgio+da+Pedra+Sp&gs_lp=Egxnd3Mtd2l6LXNlcnAiFFJlZsO6Z2lvIGRhIFBlZHJhIFNwMhEQLhiABBjHARiYBRiOBRivATIGEAAYFhgeMgYQABgWGB4yBhAAGBYYHjIGEAAYFhgeMgIQJjIIEAAYgAQYogQyCBAAGIAEGKIEMggQABiABBiiBDIIEAAYgAQYogQyIBAuGIAEGMcBGJgFGI4FGK8BGJcFGNwEGN4EGOAE2AEBSMEKUIYFWIYFcAF4AZABAJgBqQGgAakBqgEDMC4xuAEDyAEA-AEC-AEBmAICoALEAcICBxAjGLADGCfCAgoQABiwAxjWBBhHmAMAiAYBkAYDugYGCAEQARgUkgcDMS4xoAfbCQ&sclient=gws-wiz-serp"
            target="_blank"
          >
            <svg
              className="shrink-0 size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
            </svg>
          </a>
          <a
            aria-label="Link para o whatsapp do Refugio da Pedra SP"
            className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            target="_blank"
            href="https://api.whatsapp.com/send?phone=5512996148154&text=Ola, vim pelo site da pousada e gostaria de fazer uma reserva"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="16"
              height="16"
              strokeWidth="2.5"
            >
              <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path>
              <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path>
            </svg>
          </a>
          <a
            aria-label="Link para instagram do Refugio da Pedra SP"
            className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            href="https://www.instagram.com/refugiodapedrasp/"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="16"
              height="16"
              strokeWidth="2.5"
            >
              <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z"></path>
              <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
              <path d="M16.5 7.5l0 .01"></path>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
