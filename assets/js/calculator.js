/**
 * Mada — generic pricing-calculator engine.
 * Wires up segmented controls, steppers, tier-cards and addon rows inside a
 * `[data-calculator]` root, keeps a plain-object `state`, and re-renders the
 * price breakdown + WhatsApp message whenever it changes.
 *
 * Each service page supplies `computeFn(state) -> {total, breakdown, warning}`
 * and `messageFn(state, result) -> string`.
 */
const MadaCalc = (function () {
  const WHATSAPP_NUMBER = "972525272910";

  function formatMoney(n) {
    return Math.round(n).toLocaleString("en-US");
  }

  function init(root, { computeFn, messageFn, onStateChange, initialState = {} }) {
    if (!root) return null;

    const state = { ...initialState };
    const breakdownEl = root.querySelector('[data-role="breakdown"]');
    const totalEl = root.querySelector('[data-role="total"]');
    const warningEl = root.querySelector('[data-role="warning"]');
    const sendBtn = root.querySelector('[data-role="wa-send"]');

    // ---- Segmented controls & tier cards (single-select groups) ----
    root.querySelectorAll(".segmented[data-field], .tier-cards[data-field]").forEach((group) => {
      const field = group.dataset.field;
      const buttons = Array.from(group.querySelectorAll("[data-value]"));
      const active = buttons.find((b) => b.classList.contains("is-active")) || buttons[0];
      if (active) state[field] = active.dataset.value;

      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          buttons.forEach((b) => b.classList.remove("is-active"));
          btn.classList.add("is-active");
          state[field] = btn.dataset.value;
          recompute();
        });
      });
    });

    // ---- Steppers ----
    root.querySelectorAll(".stepper[data-field]").forEach((stepper) => {
      const field = stepper.dataset.field;
      const min = Number(stepper.dataset.min ?? 0);
      const max = Number(stepper.dataset.max ?? 9999);
      const step = Number(stepper.dataset.step || 1);
      const input = stepper.querySelector(".stepper-input");
      const decBtn = stepper.querySelector('[data-action="dec"]');
      const incBtn = stepper.querySelector('[data-action="inc"]');
      let value = Number(stepper.dataset.default ?? input?.value ?? min);
      state[field] = value;

      const sync = () => {
        value = Math.min(max, Math.max(min, value));
        state[field] = value;
        if (input) input.value = value;
        if (decBtn) decBtn.disabled = value <= min;
        if (incBtn) incBtn.disabled = value >= max;
      };
      sync();

      decBtn?.addEventListener("click", () => { value -= step; sync(); recompute(); });
      incBtn?.addEventListener("click", () => { value += step; sync(); recompute(); });
      input?.addEventListener("input", () => {
        const n = parseInt(input.value, 10);
        value = Number.isNaN(n) ? min : n;
      });
      input?.addEventListener("change", () => { sync(); recompute(); });
    });

    // ---- Addon rows (multi-select toggles) ----
    if (!state.addons) state.addons = {};
    root.querySelectorAll(".addon-row[data-field='addon']").forEach((row) => {
      const key = row.dataset.value;
      const included = row.classList.contains("is-included");
      state.addons[key] = included || row.classList.contains("is-checked");

      if (included) return; // always-on, not clickable

      row.addEventListener("click", () => {
        const checked = !row.classList.contains("is-checked");
        row.classList.toggle("is-checked", checked);
        row.setAttribute("aria-checked", String(checked));
        state.addons[key] = checked;
        recompute();
      });
    });

    // ---- Plain text fields (name/phone — used only in the WA message) ----
    root.querySelectorAll("input[data-field]:not(.stepper-input)").forEach((input) => {
      const field = input.dataset.field;
      state[field] = input.value;
      input.addEventListener("input", () => { state[field] = input.value; });
    });

    function render() {
      const result = computeFn(state) || { total: 0, breakdown: [] };

      if (totalEl) totalEl.textContent = formatMoney(result.total);

      if (breakdownEl) {
        breakdownEl.innerHTML = "";
        (result.breakdown || []).forEach((row) => {
          const li = document.createElement("li");
          li.className = "calc-breakdown-row";
          const label = document.createElement("span");
          label.className = "label";
          label.textContent = row.label;
          const amount = document.createElement("span");
          amount.className = "amount";
          amount.textContent = row.amount;
          li.append(label, amount);
          breakdownEl.appendChild(li);
        });
      }

      if (warningEl) {
        if (result.warning) {
          warningEl.hidden = false;
          const p = warningEl.querySelector("[data-role='warning-text']");
          if (p) p.textContent = result.warning;
        } else {
          warningEl.hidden = true;
        }
      }

      return result;
    }

    function recompute() {
      const result = render();
      onStateChange?.(state, result);
      return result;
    }

    sendBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      const result = computeFn(state) || { total: 0, breakdown: [] };
      const text = messageFn(state, result);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener");
    });

    const initialResult = recompute();
    return { state, recompute, formatMoney, get result() { return initialResult; } };
  }

  return { init, formatMoney, WHATSAPP_NUMBER };
})();
