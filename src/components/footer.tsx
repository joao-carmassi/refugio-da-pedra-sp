import Link from 'next/link';
import { Button } from './ui/button';
import { Instagram } from 'lucide-react';
import chales from '@/data/chales.json';
import Image from 'next/image';
import slugify from 'slugify';
import generateWhatsLink from '@/lib/generate-whats-link';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox='0 0 24 24'
      width='16'
      height='16'
      fill='currentColor'
      aria-hidden='true'
      {...props}
    >
      <path d='M12.24 10.285V14.4h6.806c-.276 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z' />
    </svg>
  );
}

function WhatsappIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox='0 0 24 24'
      width='16'
      height='16'
      fill='currentColor'
      aria-hidden='true'
      {...props}
    >
      <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z' />
      <path d='M12.001 2C6.478 2 2 6.477 2 12c0 1.876.512 3.633 1.402 5.14L2 22l4.98-1.373A9.953 9.953 0 0 0 12.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.032a8.008 8.008 0 0 1-4.086-1.117l-.293-.174-3.02.834.807-2.94-.19-.303A8.005 8.005 0 1 1 20.032 12c0 4.427-3.604 8.032-8.031 8.032z' />
    </svg>
  );
}

const links = [
  {
    title: 'Pousada',
    links: [
      {
        title: 'Home',
        href: '/',
      },
      {
        title: 'Chalés',
        href: '/chales',
      },
      {
        title: 'Reservar',
        href: '/reservar',
      },
    ],
  },
  {
    title: 'Chalés',
    links: chales.map((chale) => ({
      title: chale.id,
      href: `/chales/${slugify(chale.nome, { lower: true, strict: true })}`,
    })),
  },
  {
    title: 'Institucional',
    links: [
      {
        title: 'Blog',
        href: '/blog',
      },
      {
        title: 'Quem Somos',
        href: '/sobre',
      },
      {
        title: 'Política de Privacidade',
        href: '/politica-de-privacidade',
      },
    ],
  },
];

const mediaLinks = [
  {
    title: 'Google',
    Icon: <GoogleIcon />,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Refúgio da Pedra SP')}`,
  },
  {
    title: 'Instagram',
    Icon: <Instagram size={16} />,
    href: 'https://www.instagram.com/refugiodapedrasp/',
  },
  {
    title: 'Whatsapp',
    Icon: <WhatsappIcon />,
    href: generateWhatsLink(),
  },
];

const Footer = () => {
  return (
    <section className='py-6 md:py-12 bg-card dark'>
      <div className='container'>
        <footer>
          <div className='relative mb-6 flex w-full flex-col gap-6 md:flex-row md:justify-between'>
            <Link
              className='text-xl font-semibold text-foreground flex items-start gap-2'
              href='/'
              aria-label='Brand'
            >
              <Image
                src='/logo.png'
                alt='Refúgio da Pedra SP'
                width={30}
                height={30}
              />
              Refúgio da Pedra SP
            </Link>
            <div className='inline-grid w-fit grid-cols-1 gap-x-24 gap-y-6 sm:grid-cols-3'>
              {links.map((section) => (
                <div key={section.title} className='h-fit w-min'>
                  <h2 className='mb-3 text-base font-semibold text-foreground whitespace-nowrap'>
                    {section.title}
                  </h2>
                  <ul className='space-y-1 text-base font-medium text-muted-foreground'>
                    {section.links.map((link) => (
                      <li key={link.title}>
                        <Button
                          variant={'link'}
                          effect={'hoverUnderline'}
                          size={'sm'}
                          className='p-0 after:bottom-1.5 after:w-full capitalize'
                          asChild
                        >
                          <a href={link.href}>{link.title}</a>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col-reverse items-baseline justify-between gap-8 border-t border-border pt-8 md:flex-row md:gap-16'>
            <div className='text-xs text-muted-foreground sm:text-sm'>
              &copy; {new Date().getFullYear()} Refúgio da Pedra SP. Todos os
              direitos reservados.
            </div>
            <div className='flex items-start gap-4 text-xs text-muted-foreground lg:items-center'>
              {mediaLinks.map((link) => (
                <Button
                  key={link.title}
                  variant={'outline'}
                  size={'icon'}
                  className='rounded-full'
                  asChild
                  aria-label={link.title}
                >
                  <a href={link.href} target='_blank' rel='noopener noreferrer'>
                    {link.Icon}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Footer;
