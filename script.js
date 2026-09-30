// E-mail que recebe as mensagens do formulário de contato.
const EMAIL_CONTATO = "contato@fazendadailha.com.br";

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
const logoTopo = document.querySelector(".logo img");
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

// Carrossel do topo
const slides = [...document.querySelectorAll(".slide")];
const pontos = document.querySelector(".hero__pontos");
let atual = 0;
let timer;
const irPara = (i) => {
  slides[atual].classList.remove("ativo");
  pontos.children[atual].setAttribute("aria-selected", "false");
  atual = (i + slides.length) % slides.length;
  slides[atual].classList.add("ativo");
  pontos.children[atual].setAttribute("aria-selected", "true");
};
const reiniciar = () => {
  clearInterval(timer);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    timer = setInterval(() => irPara(atual + 1), 6000);
  }
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
// O carrossel só começa depois da abertura, reiniciando a animação do primeiro slide
const iniciarCarrossel = () => {
  slides[atual].classList.remove("ativo");
  void slides[atual].offsetWidth;
  slides[atual].classList.add("ativo");
  reiniciar();
};
if (document.body.classList.contains("com-abertura")) {
  document.addEventListener("abertura-fim", iniciarCarrossel, { once: true });
} else {
  reiniciar();
}

// Animação ao aparecer na tela
const elementos = document.querySelectorAll(".secao h2, .card, .noticia, .sobre__img, .mapa, .form");
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
