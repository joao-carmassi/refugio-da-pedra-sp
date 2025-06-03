import CompleteSuaExperiencia from '@/components/CompleteSuaExperiencia';
import ContainerDados from '@/components/ContainerDados';
import Galeria from '@/components/Galeria';
import HeroPrincipal from '@/components/HeroPrincipal';
import Mapa from '@/components/Mapa';
import Reserve from '@/components/Reserve';

export default function Home() {
  return (
    <main className="delay-150 duration-500 animate-in fade-in ease-in-out fill-mode-both">
      <HeroPrincipal />
      <ContainerDados />
      <Reserve />
      <CompleteSuaExperiencia />
      <Mapa />
      <Galeria />
    </main>
  );
}

