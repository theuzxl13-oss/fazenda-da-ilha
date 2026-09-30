// E-mail que receberá as mensagens do formulário de contato.
// Troque pelo e-mail real da administração.
const EMAIL_CONTATO = "contato@fazendadailha.com.br";

// Ano no rodapé
document.getElementById("ano").textContent = new Date().getFullYear();

// Topo muda de cor ao rolar
const topo = document.getElementById("topo");
const atualizarTopo = () => topo.classList.toggle("rolado", window.scrollY > 40);
window.addEventListener("scroll", atualizarTopo, { passive: true });
atualizarTopo();

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

// Animação ao aparecer na tela
const elementos = document.querySelectorAll(".secao h2, .card, .galeria__item, .sobre__img, .nota, .mapa, .form");
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
