import Hero from '@/app/(homepage)/hero';
import Faq from './faq';
import Cta from './cta';
import OutrasExperiencias from './outras-experiencias';
import Mapa from './mapa';
import Galeria from './galeria';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Faq />
      <Mapa />
      <OutrasExperiencias />
      <Cta />
      <Galeria />
    </main>
  );
}
