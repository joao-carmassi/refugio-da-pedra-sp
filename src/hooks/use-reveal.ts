'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealOptions = {
  /** Seletor dos elementos a revelar, relativo ao container retornado. */
  selector?: string;
  /** Sem ScrollTrigger: revela na montagem (heros acima da dobra). */
  onMount?: boolean;
  stagger?: number;
  delay?: number;
};

/**
 * Reveal único do site (design.md § Motion). Regras:
 * - Estado inicial aplicado via JS (`gsap.set`) — nunca `opacity-0` no markup,
 *   para a página continuar visível sem JS.
 * - `prefers-reduced-motion: reduce` → sem deslocamento em Y, só opacity ≤150ms.
 * - No máximo um grupo de reveal por seção.
 */
export function useReveal<T extends HTMLElement = HTMLElement>({
  selector = '[data-reveal]',
  onMount = false,
  stagger = 0.08,
  delay = 0,
}: RevealOptions = {}) {
  const scope = useRef<T>(null);

  useGSAP(
    () => {
      // Escopado ao container do hook — `gsap.utils.toArray(selector)` puro
      // pegaria todos os [data-reveal] do documento, não só os desta seção.
      const targets = Array.from(
        scope.current?.querySelectorAll<HTMLElement>(selector) ?? [],
      );
      if (!targets.length) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(targets, { opacity: 0 });
        gsap.to(targets, {
          opacity: 1,
          duration: 0.15,
          delay,
          ...(onMount
            ? {}
            : {
                scrollTrigger: {
                  trigger: scope.current,
                  start: 'top 85%',
                },
              }),
        });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(targets, { opacity: 0, y: 24 });
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger,
          delay,
          ...(onMount
            ? {}
            : {
                scrollTrigger: {
                  trigger: scope.current,
                  start: 'top 85%',
                },
              }),
        });
      });
    },
    { scope },
  );

  return scope;
}
