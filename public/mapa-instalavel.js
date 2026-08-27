/*
 * Segura o `beforeinstallprompt` do Chrome antes de o React existir.
 *
 * O evento é disparado uma única vez, no fim do carregamento, e evapora se
 * ninguém chamar `preventDefault` nele na hora — esperar a hidratação para
 * escutar é apostar que o React chega primeiro, o que na rota do mapa é a
 * aposta errada: é o maior bundle do site. `preventDefault` é também o que
 * transfere a oferta para a página; sem ele o Chrome mostra a barra de
 * instalação dele, no lugar e na hora que ele quiser.
 *
 * Arquivo, e não script inline no JSX: um `<script>` inline renderizado por
 * componente React nunca executa quando a rota é alcançada por navegação
 * client-side — o React avisa no console e segue. Já `<script src async>` é
 * elemento içado pelo React 19: ele o move para o `<head>`, executa e
 * deduplica pelo `src`, tanto na primeira carga quanto na navegação interna.
 *
 * As duas strings abaixo são o contrato com `src/lib/pwa-instalacao.ts`
 * (`CHAVE_EVENTO` e `EVENTO_DISPONIVEL`). Mudar uma exige mudar a outra.
 */
(function () {
  var w = window;
  w.__conviteInstalarMapa = null;

  w.addEventListener('beforeinstallprompt', function (evento) {
    evento.preventDefault();
    w.__conviteInstalarMapa = evento;
    w.dispatchEvent(new Event('mapa:instalavel'));
  });
})();
