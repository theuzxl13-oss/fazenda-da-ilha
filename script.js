// E-mail que recebe as mensagens do formulário de contato.
const EMAIL_CONTATO = "contato@fazendadailha.com.br";

// Assistente virtual: deixe vazio para usar só as respostas prontas (funciona sem servidor).
// Para ligar o Gemini, publique o mesmo Worker do site da imobiliária (chatbot-proxy/worker.mjs)
// e cole o endereço dele aqui, ex.: "https://chat-fazenda.SEU-USUARIO.workers.dev"
const GEMINI_PROXY_URL = "";

// Abertura (pôr do sol): libera o site quando termina ou ao clicar em "Pular"
const abertura = document.getElementById("abertura");
const liberarSite = () => {
  if (!document.body.classList.contains("com-abertura")) return;
  document.body.classList.remove("com-abertura");
  abertura.remove();
  document.dispatchEvent(new Event("abertura-fim"));
};
const encerrarAbertura = () => {
  if (abertura.classList.contains("voando")) return;
  abertura.classList.add("saindo");
  setTimeout(liberarSite, 600);
};
// O logo do centro voa até o logo do topo enquanto o céu desaparece
const logoAbertura = abertura.querySelector(".abertura__logo");
const logoTopo = document.querySelector(".logo__claro");
const voarParaOTopo = () => {
  if (!document.body.classList.contains("com-abertura") || abertura.classList.contains("saindo")) return;
  const de = logoAbertura.getBoundingClientRect();
  const para = logoTopo.getBoundingClientRect();
  Object.assign(logoAbertura.style, {
    animation: "none", opacity: "1", transform: "none", transformOrigin: "0 0",
    left: `${de.left}px`, top: `${de.top}px`, width: `${de.width}px`,
  });
  abertura.classList.add("voando");
  const dx = para.left - de.left;
  const dy = para.top - de.top;
  const escala = para.width / de.width;
  logoAbertura.animate(
    [
      { transform: "translate(0, 0) scale(1)" },
      { transform: `translate(${dx}px, ${dy}px) scale(${escala})` },
    ],
    { duration: 1000, easing: "cubic-bezier(.65, 0, .35, 1)", fill: "forwards" }
  ).finished.then(() => {
    // troca suave do logo branco da abertura pelo logo escuro do topo
    document.body.classList.remove("com-abertura");
    logoAbertura.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, fill: "forwards" })
      .finished.then(() => { abertura.remove(); document.dispatchEvent(new Event("abertura-fim")); });
  });
};
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  liberarSite();
} else {
  abertura.addEventListener("animationend", (e) => {
    if (e.target === abertura) liberarSite();
  });
  abertura.addEventListener("click", encerrarAbertura);
  document.addEventListener("keydown", encerrarAbertura, { once: true });
  setTimeout(voarParaOTopo, 4000);
}

// Ano no rodapé
document.getElementById("ano").textContent = new Date().getFullYear();

// Topo: esconde a barra de contatos ao rolar; botão "voltar ao topo"
const topo = document.getElementById("topo");
const subir = document.querySelector(".subir");
const aoRolar = () => {
  topo.classList.toggle("rolado", window.scrollY > 40);
  subir.classList.toggle("visivel", window.scrollY > 500);
};
window.addEventListener("scroll", aoRolar, { passive: true });
aoRolar();

// Menu mobile
const menuBtn = document.querySelector(".menu-btn");
const menu = document.getElementById("menu");
menuBtn.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  menuBtn.setAttribute("aria-expanded", aberto);
});
menu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menu.classList.remove("aberto");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

// Destaca no menu a seção visível
const linksMenu = [...menu.querySelectorAll("a:not(.btn)")];
const secoes = linksMenu.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const obsMenu = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      linksMenu.forEach((a) => a.classList.toggle("ativo", a.getAttribute("href") === `#${e.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  secoes.forEach((s) => obsMenu.observe(s));
}

// Carrossel do topo: troca texto e fundo juntos, com barra de progresso
const slides = [...document.querySelectorAll(".slide")];
const fundos = [...document.querySelectorAll(".fundo")];
const pontos = document.querySelector(".hero__pontos");
const slideNum = document.getElementById("slide-num");
const DURACAO_SLIDE = 6000;
const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
pontos.style.setProperty("--dur", `${DURACAO_SLIDE}ms`);
let atual = 0;
let timer;
const irPara = (i) => {
  slides[atual].classList.remove("ativo");
  fundos[atual].classList.remove("ativo");
  pontos.children[atual].setAttribute("aria-selected", "false");
  atual = (i + slides.length) % slides.length;
  slides[atual].classList.add("ativo");
  fundos[atual].classList.add("ativo");
  pontos.children[atual].setAttribute("aria-selected", "true");
  slideNum.textContent = String(atual + 1).padStart(2, "0");
};
const reiniciar = () => {
  clearInterval(timer);
  pontos.classList.toggle("parado", semMovimento);
  if (!semMovimento) timer = setInterval(() => irPara(atual + 1), DURACAO_SLIDE);
};
slides.forEach((_, i) => {
  const b = document.createElement("button");
  b.setAttribute("role", "tab");
  b.setAttribute("aria-label", `Slide ${i + 1}`);
  b.setAttribute("aria-selected", i === 0 ? "true" : "false");
  b.addEventListener("click", () => { irPara(i); reiniciar(); });
  pontos.appendChild(b);
});
document.querySelector(".hero__seta--ant").addEventListener("click", () => { irPara(atual - 1); reiniciar(); });
document.querySelector(".hero__seta--prox").addEventListener("click", () => { irPara(atual + 1); reiniciar(); });
// O carrossel só começa depois da abertura, reiniciando as animações do primeiro slide
const iniciarCarrossel = () => {
  [slides[atual], fundos[atual]].forEach((el) => {
    el.classList.remove("ativo");
    void el.offsetWidth;
    el.classList.add("ativo");
  });
  reiniciar(); // tira o .parado, o que também reinicia a barra de progresso
};
if (document.body.classList.contains("com-abertura")) {
  pontos.classList.add("parado");
  document.addEventListener("abertura-fim", iniciarCarrossel, { once: true });
} else {
  reiniciar();
}

// Animação ao aparecer na tela
const elementos = document.querySelectorAll(".secao h2, .card, .noticia, .sobre__midia, .mapa, .form, .associado__inner");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visivel");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  elementos.forEach((el) => { el.classList.add("revelar"); observer.observe(el); });
}

// Formulário de contato: abre o app de e-mail com a mensagem preenchida
document.getElementById("form-contato").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const dados = new FormData(ev.target);
  const assunto = `Contato pelo site – ${dados.get("nome")}`;
  const corpo =
    `Nome: ${dados.get("nome")}\n` +
    `E-mail: ${dados.get("email")}\n` +
    `Telefone: ${dados.get("telefone") || "-"}\n\n` +
    `${dados.get("mensagem")}`;
  window.location.href = `mailto:${EMAIL_CONTATO}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
  ev.target.querySelector(".form__status").textContent = "Abrindo seu aplicativo de e-mail…";
});

// ---------- ASSISTENTE VIRTUAL ----------
const LINK_ASSOCIADO = "https://fazendadailha.superlogica.net/clients/areadocondomino/cobranca";
const LINK_MAPA = "https://www.google.com/maps/search/?api=1&query=Fazenda+da+Ilha+Residencial+Condom%C3%ADnio+Embu-Gua%C3%A7u";
const SUGESTOES = ["2ª via de boleto", "Como chegar", "Falar com a administração", "Quero conhecer / comprar", "Portaria e visitantes"];

// Cada resposta pronta: palavras-chave (sem acento) e o texto em HTML
const RESPOSTAS = [
  {
    chaves: ["boleto", "2a via", "segunda via", "cobranca", "pagar", "pagamento", "taxa", "mensalidade", "condominio atrasad", "superlogica", "area do associado", "associado"],
    texto: `<p>Boletos, segunda via e informações de cobrança ficam na <strong>Área do Associado</strong>, na plataforma Superlógica.</p>
            <p><a href="${LINK_ASSOCIADO}" target="_blank" rel="noopener">Acessar Área do Associado →</a></p>
            <p>Se tiver problema com o acesso, fale com a administração: (11) 4662-9900.</p>`,
  },
  {
    chaves: ["endereco", "onde fica", "chegar", "localizacao", "localiza", "mapa", "rua", "gps", "waze", "como vou"],
    texto: `<p>Estamos na <strong>Rua Córsega, 200 – Lot. Chácara Parque Oriente</strong>, Embu-Guaçu – SP, 06900-000.</p>
            <p><a href="${LINK_MAPA}" target="_blank" rel="noopener">Abrir no Google Maps →</a></p>`,
  },
  {
    chaves: ["portaria", "seguranca", "visitante", "entrada", "acesso", "liberar", "entregador", "entrega", "prestador"],
    texto: `<p>O condomínio tem <strong>portaria com controle de acesso</strong> para a segurança de moradores e visitantes.</p>
            <p>Para liberar visitantes ou prestadores de serviço, ou tirar dúvidas sobre as regras de entrada, fale com a administração pelo (11) 4662-9900.</p>`,
  },
  {
    chaves: ["comprar", "vender", "venda", "lote", "terreno", "casa", "imovel", "alugar", "aluguel", "preco", "valor", "quanto custa", "conhecer", "visitar", "visita", "morar"],
    texto: `<p>Que bom que você quer conhecer a Fazenda da Ilha! 🌳 São lotes amplos, ruas arborizadas e muita natureza ao redor.</p>
            <p>Valores, disponibilidade e visitas são tratados direto com a administração:</p>
            <p>📞 <a href="tel:+551146629900">(11) 4662-9900</a><br>✉️ <a href="mailto:contato@fazendadailha.com.br">contato@fazendadailha.com.br</a></p>`,
    acao: "formulario",
  },
  {
    chaves: ["assembleia", "reuniao", "regra", "regimento", "estatuto", "comunicado", "noticia", "obra", "manutencao", "reforma"],
    texto: `<p>Comunicados, datas de assembleia e avisos de obras e manutenção são divulgados pela administração. Dá uma olhada na seção <a href="#noticias">Notícias</a>.</p>
            <p>Para pautas, regimento ou autorização de reforma, fale com a <a href="#administracao">administração</a>.</p>`,
  },
  {
    chaves: ["trilha", "natureza", "verde", "animal", "animais", "fauna", "passaro", "pedalar", "bicicleta", "caminhar", "lazer", "atividade", "evento", "festa"],
    texto: `<p>Aqui a natureza faz parte do dia a dia: trilhas e áreas verdes para caminhar e pedalar, fauna preservada e eventos que reúnem os moradores.</p>
            <p>Lembre de respeitar as áreas de preservação e os animais silvestres. 🐦 Veja mais em <a href="#atividades">Atividades</a>.</p>`,
  },
  {
    chaves: ["avaliacao", "avaliacoes", "nota", "google", "estrela", "opiniao"],
    texto: `<p>A Fazenda da Ilha tem nota <strong>4,6 ★</strong> com mais de 469 avaliações no Google.</p>
            <p><a href="${LINK_MAPA}" target="_blank" rel="noopener">Ver avaliações →</a></p>`,
  },
  {
    chaves: ["telefone", "email", "e-mail", "contato", "falar", "administracao", "sindico", "atendente", "atendimento", "humano", "pessoa", "whats"],
    texto: `<p>Você pode falar com a administração por:</p>
            <p>📞 <a href="tel:+551146629900">(11) 4662-9900</a><br>✉️ <a href="mailto:contato@fazendadailha.com.br">contato@fazendadailha.com.br</a></p>
            <p>Ou deixe uma mensagem pelo formulário do site.</p>`,
    acao: "formulario",
  },
  {
    chaves: ["obrigad", "valeu", "tchau", "ate mais", "show", "perfeito"],
    texto: `<p>Por nada! Se precisar de mais alguma coisa, é só chamar. 🌅</p>`,
  },
  {
    chaves: ["oi", "ola", "bom dia", "boa tarde", "boa noite", "eai", "hey"],
    texto: `<p>Olá! 😊 Como posso ajudar? Escolha uma opção abaixo ou digite sua dúvida.</p>`,
  },
];
const NAO_ENTENDI = `<p>Ainda não tenho essa informação por aqui. 😅</p>
  <p>A administração pode te ajudar: <a href="tel:+551146629900">(11) 4662-9900</a> ou <a href="mailto:contato@fazendadailha.com.br">contato@fazendadailha.com.br</a>.</p>`;

const INSTRUCOES_IA = `Você é o assistente virtual do site da Fazenda da Ilha – Condomínio Residencial, em Embu-Guaçu (SP).
Responda em português do Brasil, de forma curta, simpática e objetiva (no máximo 3 frases).
Use SOMENTE estas informações; se não souber, diga que não tem a informação e indique a administração. Nunca invente valores, horários ou regras.
- Endereço: Rua Córsega, 200 – Lot. Chácara Parque Oriente, Embu-Guaçu – SP, 06900-000.
- Telefone da administração: (11) 4662-9900. E-mail: contato@fazendadailha.com.br.
- Boletos e segunda via: Área do Associado (Superlógica): ${LINK_ASSOCIADO}
- Nota 4,6 no Google, com mais de 469 avaliações.
- Condomínio residencial com lotes amplos, casas, jardins e piscinas, ruas arborizadas, trilhas e áreas verdes, fauna preservada, portaria com controle de acesso e eventos da comunidade.
- Comunicados, assembleias, obras e manutenção são divulgados pela administração.
- Valores de lotes/casas, visitas e liberação de visitantes: falar com a administração.`;

const chat = document.getElementById("chat");
const chatAbrir = chat.querySelector(".chat__abrir");
const chatPainel = document.getElementById("chat-painel");
const chatMsgs = document.getElementById("chat-msgs");
const chatSugestoes = document.getElementById("chat-sugestoes");
const chatForm = document.getElementById("chat-form");
const chatTexto = document.getElementById("chat-texto");
const chatDica = document.getElementById("chat-dica");
const historicoIA = [];
let ultimaPergunta = "";
let iniciado = false;

const semAcento = (t) => t.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const escapar = (t) => t.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
// Texto vindo da IA: escapa tudo e só então transforma links e **negrito**
const formatarIA = (t) => escapar(t)
  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  .replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
  .split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");

const rolarFim = () => { chatMsgs.scrollTop = chatMsgs.scrollHeight; };
const addMsg = (html, quem) => {
  const div = document.createElement("div");
  div.className = `msg msg--${quem}`;
  div.innerHTML = html;
  chatMsgs.appendChild(div);
  rolarFim();
  return div;
};
const mostrarSugestoes = (lista = SUGESTOES) => {
  chatSugestoes.replaceChildren(...lista.map((t) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = t;
    b.addEventListener("click", () => perguntar(t));
    return b;
  }));
};
const botaoFormulario = (msg) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "btn btn--verde";
  b.style.cssText = "margin-top:.6rem;padding:.5rem 1rem;font-size:.82rem";
  b.textContent = "Escrever para a administração";
  b.addEventListener("click", () => {
    const campo = document.querySelector('#form-contato textarea[name="mensagem"]');
    if (ultimaPergunta && !campo.value) campo.value = ultimaPergunta;
    fecharChat();
    document.getElementById("administracao").scrollIntoView({ behavior: semMovimento ? "auto" : "smooth" });
    setTimeout(() => document.querySelector('#form-contato input[name="nome"]').focus({ preventScroll: true }), 700);
  });
  msg.appendChild(b);
};

const respostaPronta = (texto) => {
  const t = ` ${semAcento(texto)} `;
  return RESPOSTAS.find((r) => r.chaves.some((c) => (c.length <= 3 ? new RegExp(`\\b${c}\\b`).test(t) : t.includes(c))));
};

const perguntarIA = async (texto) => {
  historicoIA.push({ role: "user", parts: [{ text: texto }] });
  const res = await fetch(GEMINI_PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: INSTRUCOES_IA }] }, contents: historicoIA }),
  });
  if (!res.ok) throw new Error(`proxy ${res.status}`);
  const dados = await res.json();
  const resposta = dados?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim();
  if (!resposta) throw new Error("resposta vazia");
  historicoIA.push({ role: "model", parts: [{ text: resposta }] });
  return resposta;
};

const perguntar = async (texto) => {
  texto = texto.trim();
  if (!texto) return;
  ultimaPergunta = texto;
  addMsg(`<p>${escapar(texto)}</p>`, "eu");
  chatSugestoes.replaceChildren();
  const digitando = addMsg("<span></span><span></span><span></span>", "bot");
  digitando.classList.add("msg--digitando");
  const pronta = respostaPronta(texto);
  let html = pronta?.texto;
  let acao = pronta?.acao;
  if (!pronta && GEMINI_PROXY_URL) {
    try { html = formatarIA(await perguntarIA(texto)); } catch { historicoIA.pop(); }
  } else {
    await new Promise((r) => setTimeout(r, 650));
  }
  if (!html) { html = NAO_ENTENDI; acao = "formulario"; }
  digitando.remove();
  const msg = addMsg(html, "bot");
  if (acao === "formulario") botaoFormulario(msg);
  mostrarSugestoes();
};

const abrirChat = () => {
  chat.classList.add("aberto", "visto");
  chatPainel.hidden = false;
  chatAbrir.setAttribute("aria-expanded", "true");
  chatAbrir.setAttribute("aria-label", "Fechar assistente virtual");
  if (!iniciado) {
    iniciado = true;
    addMsg("<p>Olá! 👋 Sou o assistente virtual da <strong>Fazenda da Ilha</strong>.</p><p>Posso ajudar com boletos, localização, contato com a administração e mais. O que você precisa?</p>", "bot");
    mostrarSugestoes();
  }
  if (window.matchMedia("(min-width: 561px)").matches) chatTexto.focus();
};
const fecharChat = () => {
  chat.classList.remove("aberto");
  chatPainel.hidden = true;
  chatAbrir.setAttribute("aria-expanded", "false");
  chatAbrir.setAttribute("aria-label", "Abrir assistente virtual");
};
chatAbrir.addEventListener("click", () => (chatPainel.hidden ? abrirChat() : fecharChat()));
chat.querySelector(".chat__fechar").addEventListener("click", fecharChat);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !chatPainel.hidden) fecharChat(); });
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const texto = chatTexto.value;
  chatTexto.value = "";
  perguntar(texto);
});
// Links internos (#secao) dentro do chat fecham o painel para mostrar a seção
chatMsgs.addEventListener("click", (e) => {
  if (e.target.closest('a[href^="#"]')) fecharChat();
});
// Balãozinho de convite alguns segundos depois de o site aparecer
const convidar = () => setTimeout(() => {
  if (chat.classList.contains("visto")) return;
  chatDica.classList.add("visivel");
  setTimeout(() => chatDica.classList.remove("visivel"), 6000);
}, 2500);
if (document.body.classList.contains("com-abertura")) {
  document.addEventListener("abertura-fim", convidar, { once: true });
} else {
  convidar();
}
