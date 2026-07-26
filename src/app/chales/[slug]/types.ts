import chales from '@/data/chales.json';

/** Uma unidade do inventário, exatamente como sai de `chales.json`. */
export type Chale = (typeof chales)[number];

/**
 * Texto editorial de cada unidade. Mora em `page.tsx`, não nos dados: são
 * parágrafos escritos à mão, um por chalé, e não campos de catálogo.
 */
export interface ChaleDescription {
  title: string;
  paragraphs: string[];
  /** Diferenciais só desta unidade, exibidos em lista. */
  destaques?: string[];
  /** Para quem esta acomodação foi pensada. */
  idealPara: string;
  /** Política de pets escrita para esta unidade específica. */
  politicaPet: string;
}

/** `Domo · Colmeia` → `Domo Colmeia`, para uso dentro de frase corrida. */
export function nomeCorrido(nome: string): string {
  return nome.replace(' · ', ' ');
}
