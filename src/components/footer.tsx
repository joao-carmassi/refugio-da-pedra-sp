import Link from 'next/link';
import { Button } from './ui/button';
import { getInPhoneNumber } from '@/lib/env';
import { Icon } from '@iconify/react';
import chales from '@/data/chales.json';

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
      href: `/chales/${chale.id}`,
    })),
  },
  {
    title: 'Blog',
    links: [
      {
        title: 'Blog',
        href: '/blog',
      },
    ],
  },
];

const mediaLinks = [
  {
    title: 'Google',
    Icon: <Icon icon='mdi:google' />,
    href: 'https://www.google.com/search?q=Ref%C3%BAgio+da+Pedra+Sp&sca_esv=f8ded6305c32e328&sxsrf=AHTn8zpP39Gg0Bio0OMCl3H5lXrP_85Gqw%3A1741978706336&ei=UnzUZ8acFITb1sQPlZncuQc&hotel_occupancy=&ved=0ahUKEwjGjf2voIqMAxWErZUCHZUMN3cQ4dUDCBA&uact=5&oq=Ref%C3%BAgio+da+Pedra+Sp&gs_lp=Egxnd3Mtd2l6LXNlcnAiFFJlZsO6Z2lvIGRhIFBlZHJhIFNwMhEQLhiABBjHARiYBRiOBRivATIGEAAYFhgeMgYQABgWGB4yBhAAGBYYHjIGEAAYFhgeMgIQJjIIEAAYgAQYogQyCBAAGIAEGKIEMggQABiABBiiBDIIEAAYgAQYogQyIBAuGIAEGMcBGJgFGI4FGK8BGJcFGNwEGN4EGOAE2AEBSMEKUIYFWIYFcAF4AZABAJgBqQGgAakBqgEDMC4xuAEDyAEA-AEC-AEBmAICoALEAcICBxAjGLADGCfCAgoQABiwAxjWBBhHmAMAiAYBkAYDugYGCAEQARgUkgcDMS4xoAfbCQ&sclient=gws-wiz-serp&lqi=ChRSZWbDumdpbyBkYSBQZWRyYSBTcEj1_pGBzruAgAhaMhAAEAEQAhADGAAYARgCGAMiFHJlZsO6Z2lvIGRhIHBlZHJhIHNwKgoIAhAAEAEQAhADkgEDaW5u#rlimm=18135816175245692937',
  },
  {
    title: 'Instagram',
    Icon: <Icon icon='mdi:instagram' />,
    href: 'https://www.instagram.com/refugiodapedrasp/',
  },
  {
    title: 'Whatsapp',
    Icon: <Icon icon='mdi:whatsapp' />,
    href: getInPhoneNumber(),
  },
];

const Footer = () => {
  return (
    <section className='py-6 md:py-12 bg-card border-t border-border'>
      <div className='container'>
        <footer>
          <div className='relative mb-6 flex w-full flex-col gap-6 md:flex-row md:justify-between'>
            <Link
              className='text-xl font-semibold text-foreground'
              href='/'
              aria-label='Brand'
            >
              Refúgio da Pedra SP
            </Link>
            <div className='inline-grid w-fit grid-cols-1 gap-x-24 gap-y-6 sm:grid-cols-3'>
              {links.map((section) => (
                <div key={section.title} className='h-fit w-min'>
                  <h2 className='mb-3 text-base font-semibold whitespace-nowrap'>
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
