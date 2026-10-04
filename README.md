# aureliosaraiva.github.io

Site pessoal de Aurélio Saraiva — <https://aureliosaraiva.github.io>

Feito com [Jekyll](https://jekyllrb.com/) (nativo do GitHub Pages), HTML e CSS próprios. Sem frameworks e sem JavaScript.

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

## Editar a trajetória

A linha do tempo da página `/trajetoria/` vem de [`_data/trajetoria.yml`](_data/trajetoria.yml).

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Página inicial |
| `trajetoria.html` | Trajetória profissional |
| `blog/index.html` | Lista de posts |
| `_posts/` | Posts em Markdown |
| `privacidade.html`, `termos.html` | Política de Privacidade e Termos de Uso |
| `_layouts/`, `_includes/` | Templates |
| `assets/css/style.css` | Estilo |

## Rodar localmente

```bash
bundle install
bundle exec jekyll serve
```
