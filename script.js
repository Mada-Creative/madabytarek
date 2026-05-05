// AOS Initialization
AOS.init({ duration: 800, once: true, offset: 50 });

// Custom Cursor
const cursorDot = document.getElementById("cursor-dot");
const cursorOutline = document.getElementById("cursor-outline");

if (cursorDot && cursorOutline && !window.matchMedia("(max-width: 768px)").matches) {
  window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Slight delay for the outline
    cursorOutline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 150, fill: "forwards" });
  });

  // Expand outline on hover
  const hoverElements = document.querySelectorAll("a, button, input, textarea");
  hoverElements.forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursorOutline.style.width = "50px";
      cursorOutline.style.height = "50px";
      cursorOutline.style.backgroundColor = "rgba(23, 227, 178, 0.1)";
    });
    el.addEventListener("mouseleave", () => {
      cursorOutline.style.width = "30px";
      cursorOutline.style.height = "30px";
      cursorOutline.style.backgroundColor = "transparent";
    });
  });
}

// Header Shrink
const header = document.querySelector(".header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    header.classList.add("shrink");
  } else {
    header.classList.remove("shrink");
  }
});

// Mobile Menu
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll("#nav-menu a");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  navLinks.forEach(a => {
    a.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });
}

// FAQ Accordion
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach(item => {
  const btn = item.querySelector(".faq-question");
  if (btn) {
    btn.addEventListener("click", () => {
      // Close others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove("active");
        }
      });
      // Toggle current
      item.classList.toggle("active");
    });
  }
});

// Footer Year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// WhatsApp Form
(function () {
  const waBtn = document.getElementById("waBtn");
  const nameEl = document.getElementById("f_name");
  const emailEl = document.getElementById("f_email");
  const phoneEl = document.getElementById("f_phone");
  const msgEl = document.getElementById("f_message");
  const errorEl = document.getElementById("formError");

  if (waBtn) {
    waBtn.addEventListener("click", () => {
      if (!nameEl.value.trim()) return showErr("ادخل الاسم الكامل.");
      if (!emailEl.value.trim()) return showErr("ادخل البريد الإلكتروني.");
      if (!phoneEl.value.trim()) return showErr("ادخل رقم الهاتف.");
      if (!msgEl.value.trim()) return showErr("اكتب نبذة عن المشروع.");

      errorEl.style.display = "none";

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
  }

  function showErr(msg) {
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.style.display = "block";
    }
  }
})();
