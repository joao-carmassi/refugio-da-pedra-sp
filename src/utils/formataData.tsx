import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

export default function formataData(data: Date) {
  return format(new Date(data), 'dd/MM/yyyy', { locale: ptBR });
}
