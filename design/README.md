# Arquivos de origem da identidade visual

O que o designer entregou, guardado como veio. Nada aqui é servido pelo site:
a pasta fica fora de `public/`, então não entra no deploy da Vercel e não é
baixável por ninguém em produção. Os arquivos que o site realmente usa são
outros — `public/logo.png`, os favicons e os ícones de PWA —, exportados a
partir destes.

O motivo de versionar os originais é o de sempre com arquivo de designer: o
PNG exportado não volta a ser vetor. No dia em que a logo precisar de um
tamanho novo, de outra cor de fundo ou de um recorte diferente, é destes
arquivos que a exportação sai.

| Arquivo | O que é |
| --- | --- |
| `logo-refugio-da-pedra-ago26.pdf` | Logo da pousada em vetor, versão de agosto de 2026. Abre em qualquer lugar, sem CorelDRAW, e é o que sobrou no repositório do arranjo da pousada. |

## O que não está aqui, e por quê

Os empacotados do designer saíram do Git e estão ignorados por `.gitignore`
(`/design/*.zip`, `/design/*.cdr`):

| Arquivo | Onde está |
| --- | --- |
| `logo-refugio-da-pedra-ago26.cdr.zip` | O `.cdr` editável do CorelDRAW, com as camadas separadas. É o original de verdade da logo da pousada. |

O `.cdr` da pousada tem 103 MB e o GitHub recusa qualquer arquivo acima de
100 MB — com ele versionado, o push do repositório inteiro travava. Extrair não
resolve: um `.cdr` moderno já é um zip, e o `content/data/Bitmaps.dat` de dentro
tem 137 MB sozinho. O peso é de bitmap embutido numa arte que deveria ser
vetorial; enquanto isso não for enxugado no CorelDRAW, o arquivo não cabe no
Git sem LFS.

**Quem for mexer na logo precisa pedir o original a quem o guarda — não
adianta procurar no histórico do repositório, ele não está lá.** A regra da
pasta é uma só: empacotado do designer não mora no Git.

Os ícones de PWA que saem daqui são apontados em `src/app/layout.tsx`, que
comenta por que os binários moram em `public/` e não nas pastas de convenção
do Next.

A identidade do mapa turístico — a logo e os ícones dele — não mora mais
aqui: foi junto com o mapa para o repositório próprio dele (`mapa-turistico`).
