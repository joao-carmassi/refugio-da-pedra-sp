/* Hallmark · genre: editorial · chrome: N6 masthead + Ft1 footer · design-system: design.md · designed-as-app */
import Link from 'next/link';
import { Button } from './ui/button';
import { Instagram } from 'lucide-react';
import Image from 'next/image';
import generateWhatsLink from '@/lib/generate-whats-link';
import { getInPhoneNumber } from '@/lib/env';

// Endereço informado pelo proprietário. Os campos vazios são renderizados
// condicionalmente — nunca inventar logradouro, número ou CEP: um NAP
// inconsistente derruba o ranqueamento local e a correspondência com o
// Google Business Profile.
const NAP = {
  name: 'Refúgio da Pedra SP',
  // TODO(proprietário): confirmar grafia — "Araucárias"? Deve bater exatamente
  // com o GBP. Grafia mantida verbatim como enviada, sem correção silenciosa.
  // Falta também o número do imóvel — acrescentar aqui quando informado.
  streetAddress: 'Rua Das Araucareas',
  neighborhood: 'Paiol Grande',
  // TODO(proprietário): preencher o CEP. Vazio = linha some do rodapé.
  postalCode: '12490-000', // ex.: '12490-000'
  addressLocality: 'São Bento do Sapucaí',
  addressRegion: 'SP',
  addressCountry: 'BR', // código ISO, espelha o PostalAddress do JSON-LD
  addressCountryName: 'Brasil', // rótulo exibido ao usuário
} as const;

// Exibe o número no formato brasileiro quando reconhecível; caso contrário
// devolve o valor cru do env sem tentar adivinhar.
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  const match = /^55(\d{2})(\d{4,5})(\d{4})$/.exec(digits);
  if (!match) return raw;
  return `+55 (${match[1]}) ${match[2]}-${match[3]}`;
}

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

// `trailingSlash: true` (next.config.ts) — todo href interno precisa terminar
// com barra, senão o Next responde 308 antes de servir a página.
// Ft1 pede UMA fila curta de links, não um índice em colunas: o sitemap já
// cobre a árvore completa, e cada chalé é alcançado por /chales/.
const links = [
  { title: 'Chalés', href: '/chales/' },
  { title: 'Blog', href: '/blog/' },
  { title: 'Mapa turístico', href: '/mapa-turistico/' },
  { title: 'Sobre', href: '/sobre/' },
  { title: 'Reservar', href: '/reservar/' },
  { title: 'Privacidade', href: '/politica-de-privacidade/' },
];

// CID decimal do perfil no Google (0xfbaf5cb9454d9009), extraído do par
// `0x94cc7de7a1085cab:0xfbaf5cb9454d9009` do embed em (homepage)/mapa.tsx.
// Link por CID resolve sempre a mesma ficha; busca por texto pode cair em outro
// resultado ou em uma página de resultados.
const GOOGLE_MAPS_CID = '18135816175245692937';

const mediaLinks = [
  {
    title: 'Google',
    Icon: <GoogleIcon />,
    href: `https://www.google.com/maps?cid=${GOOGLE_MAPS_CID}`,
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

// Anel de foco da casa (design.md § Microinteractions), aplicado à mão nos
// links que não passam pelo `buttonVariants`.
const focusRing =
  'outline-none rounded-xs focus-visible:ring-3 focus-visible:ring-ring/50';

const Footer = () => {
  const phone = getInPhoneNumber();
  const phoneHref = phone.startsWith('+') ? `tel:${phone}` : `tel:+${phone}`;
  const streetLine = [NAP.streetAddress, NAP.neighborhood]
    .filter(Boolean)
    .join(' — ');
  const cityLine = `${NAP.addressLocality} — ${NAP.addressRegion}, ${NAP.addressCountryName}`;

  return (
    // Ft1 mast-headed: uma única faixa horizontal aberta por uma hairline.
    // `bg-card dark` é a cor do rodapé que já estava no site — no redisign esta
    // faixa é clara; aqui veio só a estrutura, a paleta continua a de casa.
    <footer className='w-full border-t border-border bg-card dark'>
      <div className='container py-10 md:py-16'>
        <div className='flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-16'>
          {/* Mastro: wordmark + uma linha de posicionamento. */}
          <div className='max-w-sm'>
            <Link
              className={`flex items-center gap-2.5 font-display text-2xl font-semibold tracking-tight text-foreground ${focusRing}`}
              href='/'
              aria-label='Refúgio da Pedra SP — página inicial'
            >
              <Image
                src='/logo.png'
                alt=''
                aria-hidden='true'
                width={30}
                height={30}
              />
              Refúgio da Pedra SP
            </Link>
            <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>
              Cinco acomodações ao pé da Pedra do Baú, na Serra da Mantiqueira,
              com café da manhã incluso.
            </p>
          </div>

          {/* NAP (Nome, Endereço, Telefone) visível — sinal de confiança
              para busca local e espelho do LodgingBusiness em (homepage)/layout.tsx. */}
          <address className='not-italic text-sm leading-relaxed text-muted-foreground'>
            <span className='block font-medium text-foreground'>
              {NAP.name}
            </span>
            {streetLine ? <span className='block'>{streetLine}</span> : null}
            <span className='block'>
              {NAP.postalCode ? `${NAP.postalCode} · ` : ''}
              {cityLine}
            </span>
            {phone ? (
              <a
                className={`block w-fit py-1 hover:text-accent-deep hover:underline ${focusRing}`}
                href={phoneHref}
              >
                {formatPhone(phone)}
              </a>
            ) : null}
          </address>
        </div>

        {/* Fila única de links, separada por pontos médios. */}
        <nav aria-label='Rodapé' className='mt-8'>
          <ul className='flex flex-wrap items-center gap-x-3 gap-y-1 text-sm'>
            {links.map((link, index) => (
              <li key={link.href} className='flex items-center gap-3'>
                {index > 0 ? (
                  <span aria-hidden='true' className='text-muted-foreground/50'>
                    ·
                  </span>
                ) : null}
                <Link
                  href={link.href}
                  className={`inline-flex min-h-11 items-center font-medium text-foreground transition-colors hover:text-accent-deep ${focusRing}`}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hairline acima da linha de copyright. */}
        <div className='mt-6 flex flex-col-reverse items-baseline justify-between gap-6 border-t border-border pt-6 md:flex-row md:gap-16'>
          <div className='text-xs text-muted-foreground sm:text-sm'>
            &copy; {new Date().getFullYear()} Refúgio da Pedra SP. Todos os
            direitos reservados.
          </div>
          {/* `text-muted-foreground` é o que o rodapé antigo tinha e aqui é
              obrigatório: o `outline` do Button não define cor de texto, então
              o ícone herdaria o preto já resolvido do `<body>` (tema claro) e
              sumiria no fundo escuro — a classe `dark` troca as variáveis, mas
              herança de `color` carrega o valor computado, não a variável. */}
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
      </div>
    </footer>
  );
};

export default Footer;
