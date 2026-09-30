// E-mail que recebe as mensagens do formulário de contato.
const EMAIL_CONTATO = "contato@fazendadailha.com.br";

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
reiniciar();

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
