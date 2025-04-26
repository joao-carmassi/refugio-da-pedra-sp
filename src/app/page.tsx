import Comodidades from './components/Home/Comodidades';
import Galeria from './components/Home/Galeria';
import Hero from './components/Home/Hero';
import Mapa from './components/Home/Mapa';
import Reserve from './components/Home/Reserve';

export default function Home() {
  return (
    <main className="mt-12 min-h-svh">
      <Hero />
      <Comodidades />
      <Reserve />
      <Mapa />
      <Galeria />
    </main>
  );
}
