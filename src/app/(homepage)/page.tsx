import Hero from '@/app/(homepage)/hero';
import Faq from './faq';
import Cta from './cta';
import OutrasExperiencias from './outras-experiencias';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Faq />
      <Cta />
      <OutrasExperiencias />
      <div className='min-h-container' />
    </main>
  );
}
