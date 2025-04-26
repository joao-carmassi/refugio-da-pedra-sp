import Link from 'next/link';

function Header() {
  return (
    <header className="relative flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm h-4 items-center dark:bg-neutral-900">
      <nav className="w-full bg-white fixed top-0 dark:bg-neutral-900 left-1/2 -translate-x-1/2 z-50">
        <div className="max-w-[85rem] gap-5 py-2 px-4 sm:flex sm:items-center sm:justify-between mx-auto dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <Link
              className="flex-none text-xl font-semibold dark:text-white focus:outline-hidden focus:opacity-80"
              href="/"
              aria-label="Brand"
            >
              Refúgio da Pedra SP
            </Link>
            <div className="flex gap-3 flex-row items-center">
              <Link
                href="/reservar"
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-hidden focus:bg-yellow-600 disabled:opacity-50 disabled:pointer-events-none md:hidden"
              >
                Reservar
              </Link>
              <div className="sm:hidden">
                <button
                  type="button"
                  className="hs-collapse-toggle relative size-9 flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
                  id="hs-navbar-example-collapse"
                  aria-expanded="false"
                  aria-controls="hs-navbar-example"
                  aria-label="Toggle navigation"
                  data-hs-collapse="#hs-navbar-example"
                >
                  <svg
                    className="hs-collapse-open:hidden shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    // strokeWidt="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="3" x2="21" y1="6" y2="6" />
                    <line x1="3" x2="21" y1="12" y2="12" />
                    <line x1="3" x2="21" y1="18" y2="18" />
                  </svg>
                  <svg
                    className="hs-collapse-open:block hidden shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    // strokeWidt="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                  <span className="sr-only">Toggle navigation</span>
                </button>
              </div>
            </div>
          </div>
          <div
            id="hs-navbar-example"
            className="hidden hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block"
            aria-labelledby="hs-navbar-example-collapse"
          >
            <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
              <Link
                className="font-medium text-gray-600 hover:text-gray-400 focus:outline-hidden focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                href="/"
              >
                Home
              </Link>
              <Link
                className="font-medium text-gray-600 hover:text-gray-400 focus:outline-hidden focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                href="/chales"
              >
                Chalés
              </Link>
            </div>
          </div>
          <Link
            href="/reservar"
            type="button"
            className="py-3 px-4 items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-hidden focus:bg-yellow-600 disabled:opacity-50 disabled:pointer-events-none hidden md:inline-flex"
          >
            Reservar
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
