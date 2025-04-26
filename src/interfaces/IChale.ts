export default interface IChale {
  nome: string;
  id: string;
  banner: number;
  fotos: number;
  fotos_carrosel: number[];
  capacidade: string;
  camas: {
    quantidade: number;
    tipo: string;
  };
  banheiros: number;
  tamanho: string;
  ambientes: string[];
  comodidades: string[];
  area_externa: string[];
  politica: {
    idade_minima: string;
    pets_permitidos: boolean;
  };
}
