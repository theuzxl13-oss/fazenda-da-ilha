# Fazenda da Ilha – Residencial Condomínio

Site institucional da **Fazenda da Ilha – Residencial Condomínio** (Embu-Guaçu, SP).

Site estático (HTML, CSS e JavaScript puros), hospedado na nuvem gratuitamente pelo **GitHub Pages** — não precisa de servidor.

## Como colocar no ar

1. Junte (merge) este código na branch `main`.
2. No GitHub, vá em **Settings → Pages** e em **Source** escolha **GitHub Actions**.
3. A cada push na `main`, o workflow `.github/workflows/deploy.yml` publica o site automaticamente em
   `https://theuzxl13-oss.github.io/fazenda-da-ilha/`.

## Como personalizar

| O quê | Onde |
|---|---|
| Fotos reais | Salve em `assets/img/` com os nomes `hero.jpg`, `sobre.jpg`, `galeria-1.jpg` … `galeria-4.jpg` (enquanto não existirem, o site mostra fundos em degradê verde). |
| E-mail do formulário | `script.js`, constante `EMAIL_CONTATO` |
| Textos, endereço, nota | `index.html` |
| Cores | `styles.css`, variáveis no topo (`--verde`, `--dourado` …) |

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```
