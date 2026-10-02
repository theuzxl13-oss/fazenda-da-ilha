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
| Logo oficial | `assets/img/logo-escuro.png` (letras escuras, usado no topo branco), `assets/img/logo.png` (letras brancas, usado na abertura e no rodapé) e `assets/img/logo-quadrado.png` (ícone da aba). |
| Abertura (pôr do sol) | Bloco `abertura` no `index.html` e seção `ABERTURA` no `styles.css` (duração: `4.4s` em `.com-abertura .abertura`). |
| Fotos reais | Salve em `assets/img/`: `slide-1.jpg`, `slide-2.jpg`, `slide-3.jpg` (fundos do banner do topo), `sobre.jpg`, `noticia-1.jpg` … `noticia-3.jpg`. Enquanto não existirem, o site mostra fundos em degradê. |
| E-mail do formulário | `script.js`, constante `EMAIL_CONTATO` |
| Textos, notícias, endereço, telefone | `index.html` |
| Cores e fontes | `styles.css`, variáveis no topo (`--petroleo`, `--verde`, `--sol` …). Títulos em Fraunces, textos em Poppins. |
| Assistente virtual (respostas) | `script.js`, lista `RESPOSTAS` (palavras-chave → resposta) e `SUGESTOES` (botões rápidos). |
| Assistente virtual com IA (opcional) | Publique o Worker `chatbot-proxy/worker.mjs` do repositório da imobiliária (mesma chave do Gemini serve) e cole o endereço em `GEMINI_PROXY_URL` no `script.js`. Sem isso, o chat usa só as respostas prontas. As informações que a IA pode usar ficam em `INSTRUCOES_IA`. |

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```
