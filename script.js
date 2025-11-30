// AOS
AOS.init({ duration: 700, once: true });

// Header shrink
const header = document.querySelector(".header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 12) header.classList.add("shrink");
  else header.classList.remove("shrink");
});

// Mobile menu
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll("#nav-menu a");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});
navLinks.forEach(a => a.addEventListener("click", () => navMenu.classList.remove("active")));

// Testimonials
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
let current = 0;

function show(i) {
  slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
  dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
}
function next() {
  current = (current + 1) % slides.length;
  show(current);
}

let timer = setInterval(next, 4000);
dots.forEach((d, idx) => {
  d.addEventListener("click", () => {
    current = idx;
    show(current);
    clearInterval(timer);
    timer = setInterval(next, 4000);
  });
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// WhatsApp Form
(function () {
  const waBtn = document.getElementById("waBtn");
  const nameEl = document.getElementById("f_name");
  const emailEl = document.getElementById("f_email");
  const phoneEl = document.getElementById("f_phone");
  const msgEl = document.getElementById("f_message");
  const errorEl = document.getElementById("formError");

  waBtn.addEventListener("click", () => {
    if (!nameEl.value.trim()) return showErr("ادخل الاسم الكامل.");
    if (!emailEl.value.trim()) return showErr("ادخل البريد الإلكتروني.");
    if (!msgEl.value.trim()) return showErr("اكتب فكرة المشروع.");

    errorEl.style.display = "none";

    const phone = "972525272910";
    const message = encodeURIComponent(
      `مرحباً 👋\n\nطلب جديد من موقع MadaByTarek:\n\n` +
      `الاسم: ${nameEl.value}\n` +
      `الإيميل: ${emailEl.value}\n` +
      `رقم الهاتف: ${phoneEl.value}\n` +
      `المشروع: ${msgEl.value}\n\n`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  });

  function showErr(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = "block";
  }
})();
