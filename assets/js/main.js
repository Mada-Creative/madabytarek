// ===== Scroll reveal (lightweight, no external dependency) =====
(function () {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => io.observe(el));

  // Safety net: IntersectionObserver callbacks can be throttled/coalesced by
  // the browser during very fast or programmatic scrolling, which could
  // otherwise leave content permanently invisible (opacity: 0). A light
  // periodic sweep guarantees anything already on screen gets revealed,
  // independent of scroll/resize event timing. It stops once nothing is left.
  const sweep = () => {
    const remaining = document.querySelectorAll(".reveal:not(.in-view)");
    if (!remaining.length) {
      clearInterval(sweepTimer);
      return;
    }
    remaining.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("in-view");
        io.unobserve(el);
      }
    });
  };
  const sweepTimer = setInterval(sweep, 350);
})();

// ===== Header shrink on scroll =====
const header = document.querySelector(".header");
if (header) {
  const onScroll = () => {
    if (window.scrollY > 20) header.classList.add("shrink");
    else header.classList.remove("shrink");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ===== Mobile menu =====
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

if (menuToggle && navMenu) {
  const closeMenu = () => {
    navMenu.classList.remove("active");
    menuToggle.classList.remove("active");
    document.body.style.overflow = "";
  };
  const toggleMenu = () => {
    const isActive = navMenu.classList.toggle("active");
    menuToggle.classList.toggle("active", isActive);
    document.body.style.overflow = isActive ? "hidden" : "";
  };
  menuToggle.addEventListener("click", toggleMenu);
  navMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
}

// ===== FAQ Accordion =====
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  const btn = item.querySelector(".faq-question");
  if (!btn) return;
  btn.addEventListener("click", () => {
    faqItems.forEach((other) => {
      if (other !== item) other.classList.remove("active");
    });
    item.classList.toggle("active");
  });
});

// ===== Footer year =====
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// ===== Generic WhatsApp lead form (home contact section) =====
(function () {
  const waBtn = document.getElementById("waBtn");
  if (!waBtn) return;

  const nameEl = document.getElementById("f_name");
  const emailEl = document.getElementById("f_email");
  const phoneEl = document.getElementById("f_phone");
  const msgEl = document.getElementById("f_message");
  const errorEl = document.getElementById("formError");

  waBtn.addEventListener("click", () => {
    if (!nameEl.value.trim()) return showErr("ادخل الاسم الكامل.");
    if (!emailEl.value.trim()) return showErr("ادخل البريد الإلكتروني.");
    if (!phoneEl.value.trim()) return showErr("ادخل رقم الهاتف.");
    if (!msgEl.value.trim()) return showErr("اكتب نبذة عن المشروع.");

    if (errorEl) errorEl.style.display = "none";

    const phone = "972525272910";
    const message = encodeURIComponent(
      `مرحباً طارق 👋\n\nمهتم بخدماتكم لمشروع جديد:\n\n` +
        `الاسم: ${nameEl.value}\n` +
        `الإيميل: ${emailEl.value}\n` +
        `رقم الهاتف: ${phoneEl.value}\n` +
        `عن المشروع: ${msgEl.value}\n\n`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  });

  function showErr(msg) {
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.style.display = "block";
    }
  }
})();
