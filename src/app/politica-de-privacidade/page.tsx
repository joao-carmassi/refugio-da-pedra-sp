import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getInPhoneNumber, getSiteUrl } from '@/lib/env';
import { Home } from 'lucide-react';

// TODO (pendente com o proprietário): número real do Cadastur. Enquanto vier
// vazio, a linha inteira deixa de ser renderizada — nada de placeholder entre
// colchetes na página publicada. Preencher via NEXT_PUBLIC_CADASTUR ou, se
// preferir, trocando o fallback abaixo pelo número real.
const CADASTUR = process.env.NEXT_PUBLIC_CADASTUR ?? '';

export function generateMetadata() {
  const siteUrl = getSiteUrl();
  return {
    // Sem a marca no título: o template do layout raiz já a acrescenta.
    title: 'Política de Privacidade',
    description:
      'Política de Privacidade do Refúgio da Pedra SP: como coletamos, usamos e protegemos os dados pessoais de hóspedes, em conformidade com a LGPD (Lei 13.709/2018).',
    keywords: [
      'política de privacidade',
      'LGPD',
      'proteção de dados',
      'Refúgio da Pedra SP',
    ],
    robots: {
      index: true,
    },
    // `openGraph` de um segmento substitui inteiramente o do layout raiz (não
    // faz deep merge), então `images` e `siteName` precisam ser repetidos aqui.
    openGraph: {
      title: 'Política de Privacidade - Refúgio da Pedra SP',
      description:
        'Como o Refúgio da Pedra SP coleta, usa e protege dados pessoais, em conformidade com a LGPD.',
      type: 'website',
      url: `${siteUrl}/politica-de-privacidade/`,
      siteName: 'Refúgio da Pedra SP',
      images: [
        {
          url: `${siteUrl}/assets/refugio/geral/refugio-1.webp`,
          width: 1620,
          height: 1080,
          alt: 'Pousada Refúgio da Pedra SP, em São Bento do Sapucaí, na Serra da Mantiqueira',
        },
      ],
    },
    alternates: {
      canonical: `${siteUrl}/politica-de-privacidade/`,
    },
  };
}

function PoliticaDePrivacidadePage(): React.ReactNode {
  const phoneNumber = getInPhoneNumber();

  return (
    <main className='min-h-container bg-card py-6 md:py-12 grid place-items-center animate-in fade-in duration-300 fill-mode-both'>
      <section className='container space-y-6 md:space-y-8'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink aria-label='Homepage' href='/'>
                <Home className='h-4 w-4' />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Política de Privacidade</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className='space-y-3'>
          <h1 className='text-2xl tracking-tight md:text-4xl lg:text-5xl'>
            Política de Privacidade
          </h1>
          <p className='text-sm text-muted-foreground'>
            Última atualização: julho de 2026
          </p>
        </div>

        <div className='prose dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed'>
          <div className='space-y-6'>
            <p>
              Esta Política de Privacidade descreve como a{' '}
              <strong>Pousada Refúgio da Pedra SP</strong> (CNPJ
              37.224.704/0001-58), localizada no bairro Paiol Grande, em São
              Bento do Sapucaí, na Serra da Mantiqueira, coleta,
              utiliza, armazena e protege os dados pessoais de seus hóspedes e
              visitantes deste site, em conformidade com a Lei Geral de Proteção
              de Dados Pessoais (Lei nº 13.709/2018 — LGPD).
            </p>
            {CADASTUR && (
              <p className='text-sm'>Cadastro no Cadastur: {CADASTUR}</p>
            )}
          </div>

          <section className='space-y-2'>
            <h2 className='text-foreground text-xl font-semibold md:text-2xl'>
              1. Quais dados coletamos
            </h2>
            <p>
              Ao utilizar o formulário de reserva ou entrar em contato pelo
              WhatsApp, podemos coletar: nome completo, telefone, e-mail (quando
              informado), datas de check-in e check-out, número de hóspedes,
              chalé de interesse e outras informações que você opte por nos
              enviar para viabilizar sua estadia (por exemplo, preferências ou
              necessidades especiais).
            </p>
          </section>

          <section className='space-y-2'>
            <h2 className='text-foreground text-xl font-semibold md:text-2xl'>
              2. Para que usamos esses dados
            </h2>
            <p>
              Usamos os dados exclusivamente para viabilizar e confirmar sua
              reserva, tirar dúvidas sobre a hospedagem, organizar a logística
              da sua estadia (chegada, saída, comodidades) e, quando autorizado
              por você, enviar comunicações sobre promoções ou novidades do
              Refúgio da Pedra SP. Não vendemos nem compartilhamos seus dados com
              terceiros para fins de publicidade.
            </p>
          </section>

          <section className='space-y-2'>
            <h2 className='text-foreground text-xl font-semibold md:text-2xl'>
              3. Como os dados são armazenados e compartilhados
            </h2>
            <p>
              O contato inicial e boa parte da comunicação sobre sua reserva
              acontece pelo WhatsApp, canal principal de atendimento do Refúgio
              da Pedra. Os dados enviados por meio do site ou do WhatsApp ficam
              sob nossa responsabilidade e são acessados apenas pela equipe
              responsável pela operação da pousada, pelo tempo necessário para
              cumprir a finalidade da reserva e eventuais obrigações legais ou
              fiscais.
            </p>
          </section>

          <section className='space-y-2'>
            <h2 className='text-foreground text-xl font-semibold md:text-2xl'>
              4. Seus direitos como titular dos dados
            </h2>
            <p>
              Nos termos da LGPD (Lei nº 13.709/2018), você tem direito a
              confirmar a existência de tratamento dos seus dados, acessar,
              corrigir, solicitar a anonimização, bloqueio ou eliminação de
              dados desnecessários, solicitar a portabilidade dos dados a outro
              fornecedor de serviço, revogar seu consentimento a qualquer
              momento e ser informado sobre com quem compartilhamos seus dados.
            </p>
          </section>

          <section className='space-y-2'>
            <h2 className='text-foreground text-xl font-semibold md:text-2xl'>
              5. Como exercer seus direitos ou tirar dúvidas
            </h2>
            {/* TODO (pendente com o proprietário): e-mail dedicado de
                privacidade. Sem o telefone configurado, a frase cai para a
                versão sem número — nunca para um placeholder visível. */}
            {phoneNumber ? (
              <p>
                Para exercer qualquer um dos direitos acima, esclarecer dúvidas
                sobre esta política ou solicitar a exclusão dos seus dados, fale
                com a equipe do Refúgio da Pedra SP pelo WhatsApp{' '}
                <a
                  className='text-primary hover:underline'
                  href={`https://api.whatsapp.com/send?phone=${phoneNumber}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {phoneNumber}
                </a>
                .
              </p>
            ) : (
              <p>
                Para exercer qualquer um dos direitos acima, esclarecer dúvidas
                sobre esta política ou solicitar a exclusão dos seus dados, fale
                com a equipe do Refúgio da Pedra SP pelo WhatsApp, usando o botão
                de contato disponível em todas as páginas deste site.
              </p>
            )}
          </section>

          <section className='space-y-2'>
            <h2 className='text-foreground text-xl font-semibold md:text-2xl'>
              6. Alterações a esta política
            </h2>
            <p>
              Esta Política de Privacidade pode ser atualizada periodicamente
              para refletir melhorias em nossos processos ou mudanças legais.
              Recomendamos revisitar esta página de tempos em tempos.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

export default PoliticaDePrivacidadePage;
