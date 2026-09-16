import serialize from 'serialize-javascript';
import type { Graph, Thing, WithContext } from 'schema-dts';

interface Props {
  data: WithContext<Thing> | Graph;
}

/**
 * Único ponto do site que escreve `<script type="application/ld+json">`.
 *
 * `isJSON: true` diz ao `serialize-javascript` que o objeto é JSON puro: ele
 * pula a detecção de funções, `Date`, `RegExp`, `undefined` etc. (que gerariam
 * JavaScript, não JSON) e mantém só o escape de `<`, `>`, `/`, U+2028 e U+2029
 * — o que impede um texto vindo do markdown de fechar o `<script>` antes da hora.
 */
function JsonLd({ data }: Props): React.ReactNode {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: serialize(data, { isJSON: true }) }}
    />
  );
}

export default JsonLd;
