import Hero from '@/app/(homepage)/hero';
import Faq from './faq';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Faq />
      <div className='min-h-container' />
    </main>
  );
}
