import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Baby,
  Bed,
  Calendar,
  Car,
  Coffee,
  MountainSnow,
  PawPrint,
  Wifi,
} from 'lucide-react';

const items = [
  {
    title: 'Café da manhã',
    icon: Coffee,
    content:
      'O nosso café utiliza produtos típicos da região, como pães caseiros, bolos, pão de queijo, geleias, manteiga, leite, café, sucos e frutas. O hóspede pode consumi-lo no deck principal, desfrutando de uma bela vista das montanhas.',
  },
  {
    title: 'Check-in e check-out',
    icon: Calendar,
    content:
      'O seu descanso começa às 14h (check-in), e se estende até o meio-dia (check-out), para que você possa aproveitar cada minuto da estadia.',
  },
  {
    title: 'Wifi Gratuito',
    icon: Wifi,
    content:
      'Fique sempre conectado! Nossos chalés oferecem Wi-Fi gratuito para que você possa compartilhar os melhores momentos da sua estadia, sem perder o contato com o mundo',
  },
  {
    title: 'Pet Friendly',
    icon: PawPrint,
    content:
      'Entendemos que os animais de estimação são parte da família. Por isso, somos pet-friendly e ficaremos felizes em receber o seu amigo peludo durante a sua estadia.',
  },
  {
    title: 'Crianças',
    icon: Baby,
    content:
      'Valorizamos a presença das famílias em nosso espaço. Para tornar a experiência ainda mais acessível, permitimos a estadia de crianças a partir dos 13 anos. É nossa maneira de compartilhar momentos especiais com todos, oferecendo conforto e praticidade para a família.',
  },
  {
    title: 'Estacionamento privativo',
    icon: Car,
    content:
      'Cada chalé possui seu próprio estacionamento individual, oferecendo segurança e praticidade durante toda a sua hospedagem.',
  },
  {
    title: 'Roupas de cama e toalhas',
    icon: Bed,
    content:
      'Roupas de cama macias, toalhas de banho e rosto estão incluidas na reserva sempre prontas para o seu conforto.',
  },
  {
    title: 'Pedra do Baú',
    icon: MountainSnow,
    content:
      'A apenas 1,5 km da Pedra do Baú, nossa pousada esta localizada no local perfeito para quem gosta de explorar a natureza.',
  },
];

export default function AccordionDados() {
  return (
    <Accordion
      defaultValue="item-0"
      type="single"
      collapsible
      className="w-full"
    >
      {items.map(({ title, content, icon: Icon }, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="data-[state=open]:border-b-2 data-[state=open]:border-primary"
        >
          <AccordionTrigger className="text-lg data-[state=open]:text-primary">
            <div className="flex items-center gap-2">
              <Icon />
              {title}
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-[17px] leading-relaxed text-muted-foreground">
            {content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
