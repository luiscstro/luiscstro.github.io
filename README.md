# Portfólio Luis Castro

Portfólio de Luis Felipe Castro, publicado em https://luiscstro.github.io. É um site estático feito com HTML, CSS e JavaScript. Não precisa de build.

## Rodar no computador

```bash
python -m http.server 8080
```

Depois abra http://localhost:8080. As fontes e as animações vêm da internet, então é preciso estar conectado.

## Como o site é publicado

O GitHub Pages publica o conteúdo deste repositório sozinho. Para atualizar o site, edite os arquivos e envie para o GitHub. Em um ou dois minutos a mudança aparece no endereço acima.

## Onde editar

| O quê | Arquivo |
|---|---|
| Textos, projetos, sites, sobre e contatos | `index.html` |
| Cores, fontes e layout | `assets/css/style.css` (as cores ficam no topo, em `:root`) |
| Animações, azulejos e demonstrações | `assets/js/main.js` |
| Licitações usadas pelo robô de demonstração | `assets/js/data.js` |
| Imagens dos projetos | `assets/img` |

## Fontes e bibliotecas

As fontes são a Fraunces, nos títulos, e a Literata, nos textos, ambas do Google Fonts. As animações usam o GSAP com ScrollTrigger e a rolagem suave usa o Lenis.

Quem pede menos movimento nas configurações do sistema vê o conteúdo completo, sem animação.
