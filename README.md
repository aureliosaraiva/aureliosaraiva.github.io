# aureliosaraiva.github.io

Site pessoal de Aurélio Saraiva — <https://aureliosaraiva.github.io>

Feito com [Jekyll](https://jekyllrb.com/) (nativo do GitHub Pages), HTML e CSS próprios, sem frameworks. O único JavaScript é o botão de tema e o "copiar" dos blocos de código. Fontes (Inter e JetBrains Mono, licença OFL) são servidas pelo próprio site.

## Publicar um post

Crie um arquivo em `_posts/` no formato `AAAA-MM-DD-titulo-do-post.md`:

```markdown
---
title: "Título do post"
tags: [arquitetura, ia]
---

Conteúdo em Markdown.
```

Faça commit na `main` e o GitHub Pages publica sozinho em cerca de um minuto.
Dá para criar o arquivo direto pela interface do GitHub (**Add file → Create new file**).

Rascunhos ficam em `_drafts/` (sem data no nome) e não são publicados. Para publicar, mova para `_posts/` adicionando a data.

Tags viram links automaticamente para `/blog/tags/`. Para usar uma imagem de prévia específica no post, adicione `image: /caminho/da/imagem.png` no cabeçalho (o padrão é `assets/og.png`).

## Editar a trajetória e publicações

- Linha do tempo de `/trajetoria/`: [`_data/trajetoria.yml`](_data/trajetoria.yml)
- Open source e comunidade: [`_data/comunidade.yml`](_data/comunidade.yml)
- Artigos, palestras e podcasts: [`_data/publicacoes.yml`](_data/publicacoes.yml)
- Nome, e-mail e redes sociais: [`_config.yml`](_config.yml)

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Página inicial |
| `trajetoria.html` | Trajetória profissional |
| `blog/index.html` | Lista de posts |
| `blog/tags/index.html` | Posts por tag |
| `_posts/` | Posts em Markdown |
| `privacidade.html`, `termos.html` | Política de Privacidade e Termos de Uso |
| `_layouts/`, `_includes/` | Templates |
| `assets/css/style.css` | Estilo |
| `assets/js/site.js` | Tema claro/escuro e botão copiar |
| `assets/fonts/` | Fontes auto-hospedadas |
| `assets/og.png` | Imagem de prévia para redes sociais |

## Rodar localmente

```bash
bundle install
bundle exec jekyll serve
```
