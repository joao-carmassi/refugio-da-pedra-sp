# Arquivos de origem da identidade visual

O que o designer entregou, guardado como veio. Nada aqui é servido pelo site:
a pasta fica fora de `public/`, então não entra no deploy da Vercel e não é
baixável por ninguém em produção. Os arquivos que o site realmente usa são
outros — `public/logo.png`, os favicons e os ícones de PWA —, exportados a
partir destes.

O motivo de versionar os originais é o de sempre com arquivo de designer: o
PNG exportado não volta a ser vetor. No dia em que a logo precisar de um
tamanho novo, de outra cor de fundo ou de um recorte diferente, é destes
arquivos que a exportação sai. Perder o `.cdr` é ter de refazer a arte.

| Arquivo | O que é |
| --- | --- |
| `logo-refugio-da-pedra-ago26.pdf` | Logo da pousada em vetor, versão de agosto de 2026. É a leitura rápida — abre em qualquer lugar, sem CorelDRAW. |
| `logo-refugio-da-pedra-ago26.cdr.zip` | O mesmo arranjo, mas no `.cdr` editável do CorelDRAW. É o original de verdade, com as camadas separadas. |
| `logo-mapa-turistico.zip` | Logo do mapa turístico, entregue já em várias saídas: SVG vetorizado, PDF com fundo branco e com fundo verde, PNG sem fundo e os dois JPG. |

O `.zip` do mapa veio de um Mac e traz `.DS_Store` e `__MACOSX/` dentro. Ficou
como chegou de propósito: reempacotar para limpar significa que o arquivo no
repositório deixa de ser exatamente aquilo que o designer mandou, e a sujeira
não custa nada onde não é descompactada.

Os ícones de PWA que saem daqui são apontados em `src/lib/pwa-mapa.ts` (mapa) e
em `src/app/layout.tsx` (pousada); os dois comentam por que os binários moram
em `public/` e não nas pastas de convenção do Next.
