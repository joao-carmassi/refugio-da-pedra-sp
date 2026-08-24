'use client';

import { useCallback, useState } from 'react';

/**
 * Onde a pessoa está, do jeito que o mapa precisa.
 *
 * Cada resposta devolve um objeto novo, inclusive quando ela não saiu do
 * lugar. É essa identidade que faz "pedir de novo" valer como ordem nova para
 * quem depende dela — sem isso, pedir duas vezes parado moveria o mapa uma só.
 */
export interface Coordenada {
  lng: number;
  lat: number;
}

export type ErroLocalizacao =
  | 'sem-suporte'
  | 'inseguro'
  | 'negada'
  | 'indisponivel'
  | 'demorou';

/**
 * Localização de quem visita, pedida sob demanda.
 *
 * Nunca pede sozinho: o navegador abre o aviso de permissão no instante da
 * chamada, e um mapa que pergunta onde você está antes de você pedir é o tipo
 * de coisa que faz negar por reflexo — e negar uma vez vale para sempre.
 *
 * Separa os motivos de falha porque, sem isso, permissão negada, página em
 * `http://` e GPS demorando produzem exatamente o mesmo nada. Foi esse nada
 * que fez o botão de localização parecer quebrado.
 */
export function useGeolocalizacao() {
  const [coordenada, setCoordenada] = useState<Coordenada | null>(null);
  const [erro, setErro] = useState<ErroLocalizacao | null>(null);
  const [buscando, setBuscando] = useState(false);

  const pedir = useCallback(() => {
    setErro(null);

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setErro('sem-suporte');
      return;
    }

    // `navigator.geolocation` existe fora de contexto seguro, mas toda chamada
    // falha ali. Sem este atalho o diagnóstico chegaria como "permissão
    // negada", que manda procurar nas permissões do site um botão que não
    // existe — o que falta é https, não permissão. Acontece de verdade ao
    // abrir o site do celular pelo IP da máquina na rede local.
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      setErro('inseguro');
      return;
    }

    setBuscando(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setBuscando(false);
        setCoordenada({ lng: coords.longitude, lat: coords.latitude });
      },
      (falha) => {
        setBuscando(false);
        setErro(
          falha.code === falha.PERMISSION_DENIED
            ? 'negada'
            : falha.code === falha.TIMEOUT
              ? 'demorou'
              : 'indisponivel',
        );
      },
      {
        enableHighAccuracy: true,
        // 8s não bastava: sem GPS o navegador resolve por Wi-Fi e costuma
        // passar disso, então o pedido morria de timeout a caminho de dar
        // certo. O minuto de cache evita repetir a espera inteira a cada
        // toque no botão.
        timeout: 20000,
        maximumAge: 60000,
      },
    );
  }, []);

  return { coordenada, erro, buscando, pedir };
}
