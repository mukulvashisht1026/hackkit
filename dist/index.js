"use client";
import { jsx as e, jsxs as h, Fragment as he } from "react/jsx-runtime";
import { createContext as $e, useContext as xe, useState as I, useEffect as ee, useRef as Z, useId as Ke, useCallback as we, useMemo as de, useLayoutEffect as Ze } from "react";
import { createPortal as dt } from "react-dom";
const ut = $e("dreamy"), ie = () => xe(ut), _e = $e(void 0), ht = (t) => t === !0 ? "is-motion" : t === !1 ? "is-still" : void 0, F = (...t) => t.filter(Boolean).join(" "), Oe = () => Math.random().toString(36).slice(2, 10), mt = () => {
  var t;
  return typeof window < "u" && !!((t = window.matchMedia) != null && t.call(window, "(prefers-reduced-motion: reduce)").matches);
}, ye = () => {
  const t = xe(_e);
  return t === void 0 ? mt() : !t;
};
function Qe(t = 10) {
  const n = Z(null), a = ye();
  return ee(() => {
    const r = n.current;
    if (!r) return;
    const i = (s) => {
      const d = r.getBoundingClientRect(), m = (s.clientX - d.left) / d.width - 0.5, u = (s.clientY - d.top) / d.height - 0.5;
      r.style.setProperty("--mx", `${(m + 0.5) * 100}%`), r.style.setProperty("--my", `${(u + 0.5) * 100}%`), t > 0 && !a && (r.style.setProperty("--rx", `${-u * t}deg`), r.style.setProperty("--ry", `${m * t}deg`));
    }, l = () => {
      r.style.setProperty("--rx", "0deg"), r.style.setProperty("--ry", "0deg");
    };
    return r.addEventListener("pointermove", i), r.addEventListener("pointerleave", l), () => {
      r.removeEventListener("pointermove", i), r.removeEventListener("pointerleave", l);
    };
  }, [t, a]), n;
}
function Ae(t = !0) {
  const n = Z(null), [a, r] = I(!1);
  return ee(() => {
    const i = n.current;
    if (!i) return;
    if (!("IntersectionObserver" in window)) {
      r(!0);
      return;
    }
    const l = new IntersectionObserver(([s]) => {
      s.isIntersecting ? (r(!0), t && l.disconnect()) : t || r(!1);
    }, { threshold: 0.12 });
    return l.observe(i), () => l.disconnect();
  }, [t]), [n, a];
}
function pt(t, n, a = 1400) {
  const [r, i] = I(0), l = ye();
  return ee(() => {
    if (!n) return;
    if (l) {
      i(t);
      return;
    }
    let s = 0;
    const d = performance.now(), m = (u) => {
      const p = Math.min(1, (u - d) / a);
      i(t * (1 - Math.pow(1 - p, 3))), p < 1 && (s = requestAnimationFrame(m));
    };
    return s = requestAnimationFrame(m), () => cancelAnimationFrame(s);
  }, [t, n, a, l]), r;
}
function Je({ children: t }) {
  const n = ie(), a = xe(_e), [r, i] = I(!1);
  return ee(() => i(!0), []), r ? dt(/* @__PURE__ */ e("div", { className: F("ui-portal", `ui-${n}`, ht(a)), children: t }), document.body) : null;
}
function He({ children: t, delay: n = 0, className: a }) {
  const [r, i] = Ae();
  return /* @__PURE__ */ e("div", { ref: r, className: F("ui-reveal", i && "is-in", a), style: { transitionDelay: `${n}ms` }, children: t });
}
const X = (t) => (n) => /* @__PURE__ */ e(
  "svg",
  {
    viewBox: "0 0 24 24",
    width: "1em",
    height: "1em",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    ...n,
    children: /* @__PURE__ */ e("path", { d: t })
  }
), _ = {
  search: X("M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM21 21l-4.3-4.3"),
  send: X("M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"),
  sparkle: X("M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"),
  menu: X("M4 6h16M4 12h16M4 18h16"),
  x: X("M18 6 6 18M6 6l12 12"),
  check: X("M20 6 9 17l-5-5"),
  bell: X("M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"),
  arrow: X("M5 12h14M13 5l7 7-7 7"),
  upload: X("M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"),
  bot: X("M12 8V4H8M4 12a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM9 13v2M15 13v2"),
  plus: X("M12 5v14M5 12h14"),
  chevron: X("M6 9l6 6 6-6"),
  heart: X("M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.8z"),
  zap: X("M13 2 3 14h9l-1 8 10-12h-9l1-8z"),
  user: X("M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8z"),
  mail: X("M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6"),
  cube: X("M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7zM3.3 7 12 12l8.7-5M12 22V12"),
  chart: X("M3 3v18h18M7 15l4-4 3 3 5-6"),
  info: X("M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 16v-4M12 8h.01"),
  alert: X("M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"),
  layers: X("M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"),
  gamepad: X("M6 11h4M8 9v4M15 12h.01M18 10h.01M17.3 5H6.7a4 4 0 0 0-3.95 3.4L2 14.5A2.5 2.5 0 0 0 6.4 16l1.6-2h8l1.6 2a2.5 2.5 0 0 0 4.4-1.5l-.75-6.1A4 4 0 0 0 17.3 5z"),
  back: X("M19 12H5M12 19l-7-7 7-7")
};
function Zt({
  variant: t = "primary",
  size: n = "md",
  loading: a,
  icon: r,
  iconRight: i,
  pill: l,
  square: s,
  block: d,
  magnetic: m,
  ripple: u = !0,
  className: p,
  children: f,
  disabled: W,
  onClick: C,
  onPointerMove: k,
  onPointerLeave: N,
  ...w
}) {
  const [T, g] = I([]), o = (A) => {
    if (u) {
      const S = A.currentTarget.getBoundingClientRect(), P = Date.now() + Math.random();
      g((M) => [...M, { id: P, x: A.clientX - S.left, y: A.clientY - S.top }]), setTimeout(() => g((M) => M.filter((c) => c.id !== P)), 650);
    }
    C == null || C(A);
  }, v = (A) => {
    if (m) {
      const S = A.currentTarget, P = S.getBoundingClientRect();
      S.style.setProperty("--tx", `${(A.clientX - P.left - P.width / 2) * 0.25}px`), S.style.setProperty("--ty", `${(A.clientY - P.top - P.height / 2) * 0.35}px`);
    }
    k == null || k(A);
  }, $ = (A) => {
    m && (A.currentTarget.style.setProperty("--tx", "0px"), A.currentTarget.style.setProperty("--ty", "0px")), N == null || N(A);
  };
  return /* @__PURE__ */ h(
    "button",
    {
      type: "button",
      ...w,
      className: F(
        "ui-btn",
        `ui-btn-${t}`,
        `ui-btn-${n}`,
        l && "is-pill",
        s && "is-square",
        d && "is-block",
        a && "is-loading",
        p
      ),
      disabled: W || a,
      "aria-busy": a || void 0,
      onClick: o,
      onPointerMove: v,
      onPointerLeave: $,
      children: [
        a && /* @__PURE__ */ e("span", { className: "ui-btn-spin", "aria-hidden": !0 }),
        /* @__PURE__ */ h("span", { className: "ui-btn-label", children: [
          r,
          f,
          i
        ] }),
        T.map((A) => /* @__PURE__ */ e("span", { className: "ui-ripple", style: { left: A.x, top: A.y } }, A.id))
      ]
    }
  );
}
function _t({ brand: t, items: n, actions: a, sticky: r = !0 }) {
  const [i, l] = I(!1), [s, d] = I(!1);
  ee(() => {
    if (!r) return;
    const u = () => d(window.scrollY > 12);
    return u(), window.addEventListener("scroll", u, { passive: !0 }), () => window.removeEventListener("scroll", u);
  }, [r]);
  const m = (u) => {
    const p = F("ui-nav-link", u.active && "is-active"), f = () => {
      var W;
      l(!1), (W = u.onClick) == null || W.call(u);
    };
    return u.href ? /* @__PURE__ */ e("a", { className: p, href: u.href, onClick: f, children: u.label }, u.label) : /* @__PURE__ */ e("button", { className: p, type: "button", onClick: f, children: u.label }, u.label);
  };
  return /* @__PURE__ */ h("header", { className: F("ui-nav", r && "is-sticky", s && "is-scrolled", i && "is-open"), children: [
    /* @__PURE__ */ h("div", { className: "ui-nav-bar", children: [
      /* @__PURE__ */ e("div", { className: "ui-nav-brand", children: t }),
      /* @__PURE__ */ e("nav", { className: "ui-nav-links", children: n.map(m) }),
      a && /* @__PURE__ */ e("div", { className: "ui-nav-actions", children: a }),
      /* @__PURE__ */ h("button", { type: "button", className: "ui-nav-burger", "aria-label": "Menu", "aria-expanded": i, onClick: () => l((u) => !u), children: [
        /* @__PURE__ */ e("span", {}),
        /* @__PURE__ */ e("span", {}),
        /* @__PURE__ */ e("span", {})
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "ui-nav-drawer", children: /* @__PURE__ */ e("div", { children: /* @__PURE__ */ h("div", { className: "ui-nav-sheet", children: [
      n.map(m),
      a && /* @__PURE__ */ e("div", { className: "ui-nav-sheet-actions", children: a })
    ] }) }) })
  ] });
}
const ft = ({ size: t = 28 }) => /* @__PURE__ */ e("span", { className: "ui-spinner", style: { "--s": `${t}px` }, role: "status", "aria-label": "Loading" }), Fe = () => /* @__PURE__ */ h("span", { className: "ui-typing", "aria-label": "Loading", children: [
  /* @__PURE__ */ e("i", {}),
  /* @__PURE__ */ e("i", {}),
  /* @__PURE__ */ e("i", {})
] }), Qt = ({ w: t = "100%", h: n = 12, circle: a }) => /* @__PURE__ */ e("span", { className: F("ui-skel", a && "is-circle"), style: { width: a ? n : t, height: n } });
function Jt({ value: t = 0, indeterminate: n }) {
  return /* @__PURE__ */ e(
    "div",
    {
      className: F("ui-progress", n && "is-indeterminate"),
      role: "progressbar",
      "aria-valuenow": n ? void 0 : Math.round(t),
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      children: /* @__PURE__ */ e("span", { style: { width: n ? void 0 : `${Math.max(0, Math.min(100, t))}%` } })
    }
  );
}
function en({ value: t, size: n = 84, stroke: a = 8 }) {
  const r = "g" + Ke().replace(/:/g, ""), i = (n - a) / 2, l = 2 * Math.PI * i;
  return /* @__PURE__ */ h("div", { className: "ui-ring-wrap", style: { width: n, height: n }, children: [
    /* @__PURE__ */ h("svg", { width: n, height: n, children: [
      /* @__PURE__ */ e("defs", { children: /* @__PURE__ */ h("linearGradient", { id: r, x1: "0", x2: "1", y1: "0", y2: "1", children: [
        /* @__PURE__ */ e("stop", { offset: "0%", style: { stopColor: "var(--a1)" } }),
        /* @__PURE__ */ e("stop", { offset: "100%", style: { stopColor: "var(--a2)" } })
      ] }) }),
      /* @__PURE__ */ e("circle", { cx: n / 2, cy: n / 2, r: i, fill: "none", stroke: "var(--hl)", strokeWidth: a }),
      /* @__PURE__ */ e(
        "circle",
        {
          cx: n / 2,
          cy: n / 2,
          r: i,
          fill: "none",
          stroke: `url(#${r})`,
          strokeWidth: a,
          strokeLinecap: "round",
          strokeDasharray: l,
          strokeDashoffset: l * (1 - t / 100),
          transform: `rotate(-90 ${n / 2} ${n / 2})`,
          style: { transition: "stroke-dashoffset .8s cubic-bezier(.22,1,.36,1)" }
        }
      )
    ] }),
    /* @__PURE__ */ h("span", { children: [
      Math.round(t),
      "%"
    ] })
  ] });
}
function vt({ open: t, onClose: n, title: a, children: r, footer: i, bare: l }) {
  return ee(() => {
    if (!t) return;
    const s = (m) => {
      m.key === "Escape" && n();
    };
    window.addEventListener("keydown", s);
    const d = document.body.style.overflow;
    return document.body.style.overflow = "hidden", () => {
      window.removeEventListener("keydown", s), document.body.style.overflow = d;
    };
  }, [t, n]), t ? /* @__PURE__ */ e(Je, { children: /* @__PURE__ */ e("div", { className: "ui-modal-backdrop", onMouseDown: n, children: /* @__PURE__ */ h("div", { className: F("ui-modal", l && "is-bare"), role: "dialog", "aria-modal": "true", onMouseDown: (s) => s.stopPropagation(), children: [
    !l && /* @__PURE__ */ h("div", { className: "ui-modal-head", children: [
      /* @__PURE__ */ e("h3", { children: a }),
      /* @__PURE__ */ e("button", { type: "button", className: "ui-icon-btn", "aria-label": "Close", onClick: n, children: /* @__PURE__ */ e(_.x, {}) })
    ] }),
    r,
    i && /* @__PURE__ */ e("div", { className: "ui-modal-foot", children: i })
  ] }) }) }) : null;
}
const et = $e(() => {
}), xt = () => xe(et), yt = { info: _.info, success: _.check, error: _.x, warn: _.alert };
function tn({ children: t, duration: n = 3800 }) {
  const [a, r] = I([]), i = we((s) => r((d) => d.filter((m) => m.id !== s)), []), l = we((s) => {
    const d = Date.now() + Math.random();
    r((m) => [...m.slice(-3), { tone: "info", ...s, id: d }]), setTimeout(() => i(d), n);
  }, [n, i]);
  return /* @__PURE__ */ h(et.Provider, { value: l, children: [
    t,
    /* @__PURE__ */ e(Je, { children: /* @__PURE__ */ e("div", { className: "ui-toasts", "aria-live": "polite", children: a.map((s) => {
      const d = yt[s.tone];
      return /* @__PURE__ */ h("div", { className: `ui-toast is-${s.tone}`, style: { "--dur": `${n}ms` }, children: [
        /* @__PURE__ */ e("span", { className: "ui-toast-icon", children: /* @__PURE__ */ e(d, {}) }),
        /* @__PURE__ */ h("div", { className: "ui-toast-text", children: [
          /* @__PURE__ */ e("strong", { children: s.title }),
          s.desc && /* @__PURE__ */ e("p", { children: s.desc })
        ] }),
        /* @__PURE__ */ e("button", { type: "button", className: "ui-icon-btn", "aria-label": "Dismiss", onClick: () => i(s.id), children: /* @__PURE__ */ e(_.x, {}) })
      ] }, s.id);
    }) }) })
  ] });
}
function gt({ text: t, q: n }) {
  const a = n ? t.toLowerCase().indexOf(n.toLowerCase()) : -1;
  return a < 0 ? /* @__PURE__ */ e(he, { children: t }) : /* @__PURE__ */ h(he, { children: [
    t.slice(0, a),
    /* @__PURE__ */ e("mark", { children: t.slice(a, a + n.length) }),
    t.slice(a + n.length)
  ] });
}
const bt = (t) => t instanceof HTMLElement && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
function Mt({ items: t = [], placeholder: n = "Search…", onSearch: a, onSelect: r, loading: i, shortcut: l, autoFocus: s, inline: d }) {
  const [m, u] = I(""), [p, f] = I(!1), [W, C] = I(0), k = Z(null), N = de(() => {
    const o = m.trim().toLowerCase();
    return (o ? t.filter((v) => {
      var $;
      return v.label.toLowerCase().includes(o) || (($ = v.hint) == null ? void 0 : $.toLowerCase().includes(o));
    }) : t).slice(0, 8);
  }, [m, t]);
  ee(() => C(0), [m]), ee(() => {
    if (!l) return;
    const o = (v) => {
      var $;
      v.key === l && !bt(v.target) && (v.preventDefault(), ($ = k.current) == null || $.focus());
    };
    return window.addEventListener("keydown", o), () => window.removeEventListener("keydown", o);
  }, [l]);
  const w = (o) => {
    var v;
    u(""), f(!1), (v = k.current) == null || v.blur(), r == null || r(o);
  }, T = (o) => {
    var v;
    o.key === "ArrowDown" ? (o.preventDefault(), f(!0), C(($) => Math.min(N.length - 1, $ + 1))) : o.key === "ArrowUp" ? (o.preventDefault(), C(($) => Math.max(0, $ - 1))) : o.key === "Enter" ? (p || d) && N[W] ? w(N[W]) : a == null || a(m) : o.key === "Escape" && !d && (f(!1), (v = k.current) == null || v.blur());
  }, g = d || p && N.length > 0;
  return /* @__PURE__ */ h("div", { className: F("ui-search", d && "is-inline"), children: [
    /* @__PURE__ */ h("div", { className: "ui-search-box", children: [
      /* @__PURE__ */ e(_.search, {}),
      /* @__PURE__ */ e(
        "input",
        {
          ref: k,
          type: "text",
          className: "ui-search-input",
          value: m,
          placeholder: n,
          autoFocus: s,
          onChange: (o) => {
            u(o.target.value), f(!0);
          },
          onFocus: () => f(!0),
          onBlur: () => f(!1),
          onKeyDown: T,
          role: "combobox",
          "aria-expanded": g,
          "aria-autocomplete": "list"
        }
      ),
      i && /* @__PURE__ */ e(ft, { size: 18 }),
      m && !i && /* @__PURE__ */ e("button", { type: "button", className: "ui-icon-btn", "aria-label": "Clear", onMouseDown: (o) => o.preventDefault(), onClick: () => u(""), children: /* @__PURE__ */ e(_.x, {}) }),
      l && !m && /* @__PURE__ */ e("kbd", { className: "ui-kbd", children: l })
    ] }),
    g && /* @__PURE__ */ h("ul", { className: "ui-search-menu", role: "listbox", children: [
      N.length === 0 && /* @__PURE__ */ h("li", { className: "ui-search-empty", children: [
        "No results for “",
        m,
        "”"
      ] }),
      N.map((o, v) => /* @__PURE__ */ h(
        "li",
        {
          role: "option",
          "aria-selected": v === W,
          className: F("ui-search-item", v === W && "is-active"),
          onMouseEnter: () => C(v),
          onMouseDown: ($) => $.preventDefault(),
          onClick: () => w(o),
          children: [
            /* @__PURE__ */ e("span", { className: "ui-search-ic", children: o.icon ?? /* @__PURE__ */ e(_.sparkle, {}) }),
            /* @__PURE__ */ e("span", { className: "ui-search-lbl", children: /* @__PURE__ */ e(gt, { text: o.label, q: m.trim() }) }),
            o.hint && /* @__PURE__ */ e("span", { className: "ui-search-hint", children: o.hint })
          ]
        },
        o.label
      ))
    ] })
  ] });
}
function nn({ items: t, open: n, onOpenChange: a, onSelect: r }) {
  return ee(() => {
    const i = (l) => {
      l.key.toLowerCase() === "k" && (l.metaKey || l.ctrlKey) && (l.preventDefault(), a(!n));
    };
    return window.addEventListener("keydown", i), () => window.removeEventListener("keydown", i);
  }, [n, a]), /* @__PURE__ */ h(vt, { open: n, onClose: () => a(!1), bare: !0, children: [
    /* @__PURE__ */ e(
      Mt,
      {
        inline: !0,
        autoFocus: !0,
        items: t,
        placeholder: "Type a command or search…",
        onSelect: (i) => {
          a(!1), r == null || r(i);
        }
      }
    ),
    /* @__PURE__ */ h("div", { className: "ui-palette-foot", children: [
      /* @__PURE__ */ h("span", { children: [
        /* @__PURE__ */ e("kbd", { className: "ui-kbd", children: "↑↓" }),
        " navigate"
      ] }),
      /* @__PURE__ */ h("span", { children: [
        /* @__PURE__ */ e("kbd", { className: "ui-kbd", children: "↵" }),
        " select"
      ] }),
      /* @__PURE__ */ h("span", { children: [
        /* @__PURE__ */ e("kbd", { className: "ui-kbd", children: "esc" }),
        " close"
      ] })
    ] })
  ] });
}
function an({
  onSend: t,
  title: n = "Assistant",
  subtitle: a = "Online",
  suggestions: r = [],
  initial: i = [],
  placeholder: l = "Message…",
  typewriter: s = !0
}) {
  const [d, m] = I(i), [u, p] = I(""), [f, W] = I(!1), C = Z(null), k = Z(null), N = Z();
  ee(() => () => window.clearInterval(N.current), []), ee(() => {
    const o = C.current;
    o && (o.scrollTop = o.scrollHeight);
  }, [d, f]);
  const w = () => {
    const o = k.current;
    o && (o.style.height = "auto", o.style.height = Math.min(o.scrollHeight, 140) + "px");
  }, T = (o, v) => {
    window.clearInterval(N.current);
    const $ = Math.max(1, Math.ceil(v.length / 120));
    let A = 0;
    N.current = window.setInterval(() => {
      A = Math.min(v.length, A + $), m((S) => S.map((P) => P.id === o ? { ...P, text: v.slice(0, A) } : P)), A >= v.length && window.clearInterval(N.current);
    }, 18);
  }, g = async (o = u) => {
    const v = o.trim();
    if (!v || f) return;
    const $ = [...d, { id: Oe(), role: "user", text: v }];
    m($), p(""), k.current && (k.current.style.height = "auto"), W(!0);
    let A;
    try {
      A = await t(v, $);
    } catch (P) {
      A = "⚠️ " + ((P == null ? void 0 : P.message) || "Something went wrong");
    }
    W(!1);
    const S = Oe();
    m((P) => [...P, { id: S, role: "assistant", text: s ? "" : A }]), s && T(S, A);
  };
  return /* @__PURE__ */ h("div", { className: "ui-chat", children: [
    /* @__PURE__ */ h("div", { className: "ui-chat-head", children: [
      /* @__PURE__ */ e("span", { className: "ui-avatar ui-chat-bot", children: /* @__PURE__ */ e(_.bot, {}) }),
      /* @__PURE__ */ h("div", { children: [
        /* @__PURE__ */ e("div", { className: "ui-chat-title", children: n }),
        /* @__PURE__ */ h("div", { className: "ui-chat-sub", children: [
          /* @__PURE__ */ e("i", { className: "ui-dot-live" }),
          f ? "typing…" : a
        ] })
      ] })
    ] }),
    /* @__PURE__ */ h("div", { className: "ui-chat-body", ref: C, children: [
      d.length === 0 && /* @__PURE__ */ h("div", { className: "ui-chat-empty", children: [
        /* @__PURE__ */ e("span", { className: "ui-icon-tile", children: /* @__PURE__ */ e(_.sparkle, {}) }),
        /* @__PURE__ */ e("strong", { children: "How can I help?" }),
        /* @__PURE__ */ e("span", { children: "Ask anything, or start with a suggestion." })
      ] }),
      d.map((o) => /* @__PURE__ */ h("div", { className: F("ui-msg", o.role === "user" && "is-user"), children: [
        o.role === "assistant" && /* @__PURE__ */ e("span", { className: "ui-avatar ui-chat-bot is-sm", children: /* @__PURE__ */ e(_.bot, {}) }),
        /* @__PURE__ */ e("div", { className: "ui-bubble", children: o.text || /* @__PURE__ */ e(Fe, {}) })
      ] }, o.id)),
      f && /* @__PURE__ */ h("div", { className: "ui-msg", children: [
        /* @__PURE__ */ e("span", { className: "ui-avatar ui-chat-bot is-sm", children: /* @__PURE__ */ e(_.bot, {}) }),
        /* @__PURE__ */ e("div", { className: "ui-bubble", children: /* @__PURE__ */ e(Fe, {}) })
      ] })
    ] }),
    d.length === 0 && r.length > 0 && /* @__PURE__ */ e("div", { className: "ui-chat-suggest", children: r.map((o) => /* @__PURE__ */ e("button", { type: "button", className: "ui-chip", onClick: () => g(o), children: o }, o)) }),
    /* @__PURE__ */ h("form", { className: "ui-chat-compose", onSubmit: (o) => {
      o.preventDefault(), g();
    }, children: [
      /* @__PURE__ */ e(
        "textarea",
        {
          ref: k,
          rows: 1,
          className: "ui-chat-input",
          value: u,
          placeholder: l,
          onChange: (o) => {
            p(o.target.value), w();
          },
          onKeyDown: (o) => {
            o.key === "Enter" && !o.shiftKey && (o.preventDefault(), g());
          }
        }
      ),
      /* @__PURE__ */ e("button", { type: "submit", className: "ui-btn ui-btn-primary ui-btn-md is-square ui-chat-send", disabled: !u.trim() || f, "aria-label": "Send", children: /* @__PURE__ */ e("span", { className: "ui-btn-label", children: /* @__PURE__ */ e(_.send, {}) }) })
    ] })
  ] });
}
function rn({ label: t, icon: n, hint: a, error: r, className: i, ...l }) {
  const s = Ke();
  return /* @__PURE__ */ h("div", { className: F("ui-field", n && "has-icon", r && "is-error", i), children: [
    n && /* @__PURE__ */ e("span", { className: "ui-field-icon", children: n }),
    /* @__PURE__ */ e("input", { id: s, className: "ui-input", ...l, placeholder: " ", "aria-invalid": !!r || void 0 }),
    /* @__PURE__ */ e("label", { htmlFor: s, children: t }),
    (r || a) && /* @__PURE__ */ e("small", { children: r || a })
  ] });
}
function sn({ label: t, hint: n, className: a, ...r }) {
  const i = Ke();
  return /* @__PURE__ */ h("div", { className: F("ui-field", a), children: [
    /* @__PURE__ */ e("textarea", { id: i, className: "ui-input", ...r, placeholder: " " }),
    /* @__PURE__ */ e("label", { htmlFor: i, children: t }),
    n && /* @__PURE__ */ e("small", { children: n })
  ] });
}
function ln({ children: t, className: n, ...a }) {
  return /* @__PURE__ */ h("div", { className: F("ui-select-wrap", n), children: [
    /* @__PURE__ */ e("select", { className: "ui-select", ...a, children: t }),
    /* @__PURE__ */ e(_.chevron, {})
  ] });
}
function cn({ label: t, checked: n, onChange: a }) {
  return /* @__PURE__ */ h("label", { className: "ui-toggle", children: [
    /* @__PURE__ */ e("input", { type: "checkbox", className: "ui-sr", checked: n, onChange: (r) => a(r.target.checked) }),
    /* @__PURE__ */ e("span", { className: "ui-toggle-track", children: /* @__PURE__ */ e("span", { className: "ui-toggle-thumb" }) }),
    t && /* @__PURE__ */ e("span", { children: t })
  ] });
}
function on({ label: t, checked: n, onChange: a }) {
  return /* @__PURE__ */ h("label", { className: "ui-check", children: [
    /* @__PURE__ */ e("input", { type: "checkbox", className: "ui-sr", checked: n, onChange: (r) => a(r.target.checked) }),
    /* @__PURE__ */ e("span", { className: "ui-check-box", children: /* @__PURE__ */ e("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ e("path", { d: "M5 12.5l4.5 4.5L19 7.5", pathLength: 1 }) }) }),
    /* @__PURE__ */ e("span", { children: t })
  ] });
}
function dn({ value: t, onChange: n, min: a = 0, max: r = 100, step: i = 1, label: l }) {
  const s = (t - a) / (r - a) * 100;
  return /* @__PURE__ */ h("label", { className: "ui-slider-wrap", children: [
    l && /* @__PURE__ */ h("span", { className: "ui-slider-top", children: [
      /* @__PURE__ */ e("span", { children: l }),
      /* @__PURE__ */ e("b", { children: t })
    ] }),
    /* @__PURE__ */ e(
      "input",
      {
        type: "range",
        className: "ui-slider",
        min: a,
        max: r,
        step: i,
        value: t,
        style: { "--pct": `${s}%` },
        onChange: (d) => n(Number(d.target.value))
      }
    )
  ] });
}
const Nt = (t) => t > 1e6 ? `${(t / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(t / 1e3))} KB`;
function un({ onFiles: t, accept: n, multiple: a = !0, label: r = "Drop files or click to browse", hint: i }) {
  const [l, s] = I(!1), [d, m] = I([]), u = Z(null), p = (f) => {
    if (!(f != null && f.length)) return;
    const W = Array.from(f);
    m(W), t == null || t(W);
  };
  return /* @__PURE__ */ h(
    "div",
    {
      className: F("ui-drop", l && "is-over"),
      role: "button",
      tabIndex: 0,
      onClick: () => {
        var f;
        return (f = u.current) == null ? void 0 : f.click();
      },
      onKeyDown: (f) => {
        var W;
        (f.key === "Enter" || f.key === " ") && (f.preventDefault(), (W = u.current) == null || W.click());
      },
      onDragOver: (f) => {
        f.preventDefault(), s(!0);
      },
      onDragLeave: () => s(!1),
      onDrop: (f) => {
        f.preventDefault(), s(!1), p(f.dataTransfer.files);
      },
      children: [
        /* @__PURE__ */ e("input", { ref: u, type: "file", hidden: !0, accept: n, multiple: a, onChange: (f) => p(f.target.files) }),
        /* @__PURE__ */ e("span", { className: "ui-drop-icon", children: /* @__PURE__ */ e(_.upload, {}) }),
        /* @__PURE__ */ e("strong", { children: r }),
        i && /* @__PURE__ */ e("small", { children: i }),
        d.length > 0 && /* @__PURE__ */ e("div", { className: "ui-drop-files", children: d.map((f) => /* @__PURE__ */ h("span", { className: "ui-badge", children: [
          f.name,
          " · ",
          Nt(f.size)
        ] }, f.name)) })
      ]
    }
  );
}
function tt({ tilt: t, className: n, children: a, ...r }) {
  const i = ie(), l = t === !0 ? 14 : t === !1 ? 0 : t ?? (i === "depth" ? 6 : 0), s = Qe(l);
  return /* @__PURE__ */ e("div", { ref: s, className: F("ui-card", l > 0 ? "is-tilt" : "is-hover", n), ...r, children: a });
}
const wt = ({ tone: t = "accent", dot: n, children: a }) => /* @__PURE__ */ e("span", { className: F("ui-badge", `is-${t}`, n && "has-dot"), children: a }), $t = (t) => [...t].reduce((n, a) => (n * 31 + a.charCodeAt(0)) % 360, 7);
function kt({ name: t, src: n, size: a = 36, status: r }) {
  const i = $t(t), l = t.split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  return /* @__PURE__ */ h(
    "span",
    {
      className: "ui-avatar",
      title: t,
      style: { "--s": `${a}px`, background: `linear-gradient(135deg, hsl(${i} 85% 72%), hsl(${(i + 50) % 360} 85% 62%))` },
      children: [
        n ? /* @__PURE__ */ e("img", { src: n, alt: t }) : l,
        r && /* @__PURE__ */ e("i", { className: `ui-avatar-status is-${r}` })
      ]
    }
  );
}
function hn({ names: t, max: n = 4, size: a = 38 }) {
  const r = t.length - n;
  return /* @__PURE__ */ h("div", { className: "ui-avatars", children: [
    t.slice(0, n).map((i) => /* @__PURE__ */ e(kt, { name: i, size: a }, i)),
    r > 0 && /* @__PURE__ */ h("span", { className: "ui-avatar is-more", style: { "--s": `${a}px` }, children: [
      "+",
      r
    ] })
  ] });
}
const mn = ({ tip: t, children: n }) => /* @__PURE__ */ e("span", { className: "ui-tip", "data-tip": t, children: n });
function Wt({ data: t, height: n = 44 }) {
  const r = Math.min(...t), i = Math.max(...t), l = i - r || 1, d = t.map((m, u) => [u / (t.length - 1) * 160, n - 4 - (m - r) / l * (n - 8)]).map((m, u) => `${u ? "L" : "M"}${m[0].toFixed(1)},${m[1].toFixed(1)}`).join(" ");
  return /* @__PURE__ */ h("svg", { className: "ui-spark", viewBox: `0 0 160 ${n}`, preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ e("path", { d: `${d} L160,${n} L0,${n} Z`, className: "ui-spark-area" }),
    /* @__PURE__ */ e("path", { d, className: "ui-spark-line", pathLength: 1 })
  ] });
}
function pn({ label: t, value: n, prefix: a = "", suffix: r = "", decimals: i = 0, delta: l, spark: s, icon: d }) {
  const [m, u] = Ae(), p = pt(n, u);
  return /* @__PURE__ */ e(tt, { tilt: !0, children: /* @__PURE__ */ h("div", { ref: m, className: F("ui-stat", u && "is-in"), children: [
    /* @__PURE__ */ h("div", { className: "ui-stat-top", children: [
      /* @__PURE__ */ e("span", { className: "ui-stat-label", children: t }),
      d && /* @__PURE__ */ e("span", { className: "ui-stat-icon", children: d })
    ] }),
    /* @__PURE__ */ h("div", { className: "ui-stat-value", children: [
      a,
      p.toLocaleString(void 0, { minimumFractionDigits: i, maximumFractionDigits: i }),
      r
    ] }),
    l !== void 0 && /* @__PURE__ */ h(wt, { tone: l >= 0 ? "ok" : "bad", children: [
      l >= 0 ? "▲" : "▼",
      " ",
      Math.abs(l),
      "%"
    ] }),
    s && /* @__PURE__ */ e(Wt, { data: s })
  ] }) });
}
function fn({ tabs: t, value: n, onChange: a, variant: r = "pill" }) {
  const i = Z(null), [l, s] = I({ left: 0, width: 0 });
  return Ze(() => {
    const d = i.current;
    if (!d) return;
    const m = () => {
      const p = d.querySelector(`[data-tab="${CSS.escape(n)}"]`);
      p && s({ left: p.offsetLeft, width: p.offsetWidth });
    };
    m();
    const u = new ResizeObserver(m);
    return u.observe(d), () => u.disconnect();
  }, [n, t.length]), /* @__PURE__ */ h("div", { ref: i, className: F("ui-tabs", `is-${r}`), role: "tablist", children: [
    /* @__PURE__ */ e("span", { className: "ui-tabs-ind", style: { width: l.width, transform: `translateX(${l.left}px)` } }),
    t.map((d) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        role: "tab",
        "data-tab": d.id,
        "aria-selected": d.id === n,
        className: F("ui-tab", d.id === n && "is-active"),
        onClick: () => a(d.id),
        children: d.label
      },
      d.id
    ))
  ] });
}
function vn({ items: t, defaultOpen: n = 0 }) {
  const [a, r] = I(n);
  return /* @__PURE__ */ e("div", { className: "ui-acc", children: t.map((i, l) => /* @__PURE__ */ h("div", { className: F("ui-acc-item", a === l && "is-open"), children: [
    /* @__PURE__ */ h("button", { type: "button", className: "ui-acc-head", "aria-expanded": a === l, onClick: () => r(a === l ? -1 : l), children: [
      i.title,
      /* @__PURE__ */ e(_.chevron, {})
    ] }),
    /* @__PURE__ */ e("div", { className: "ui-acc-body", children: /* @__PURE__ */ e("div", { children: /* @__PURE__ */ e("div", { className: "ui-acc-content", children: i.content }) }) })
  ] }, l)) });
}
function xn({ steps: t, current: n }) {
  return /* @__PURE__ */ e("ol", { className: "ui-steps", children: t.map((a, r) => /* @__PURE__ */ h("li", { className: F("ui-step", r < n && "is-done", r === n && "is-current"), children: [
    /* @__PURE__ */ e("span", { className: "ui-step-dot", children: r < n ? /* @__PURE__ */ e(_.check, {}) : r + 1 }),
    /* @__PURE__ */ e("span", { children: a })
  ] }, a)) });
}
const Lt = {
  K: "#1a1c2c",
  B: "#41a6f6",
  L: "#73eff7",
  D: "#29366f",
  V: "#1a1c2c",
  E: "#73eff7",
  Y: "#ffcd75",
  O: "#ef7d57",
  W: "#f4f4f4",
  R: "#b13e53",
  G: "#38b764",
  M: "#94b0c2",
  P: "#5d275d"
}, nt = [
  ".....YY.....",
  ".....KK.....",
  "..KKKKKKKK..",
  ".KBBBBBBBBK.",
  ".KBVVVVVVBK.",
  ".KBVEVVEVBK.",
  ".KBVVVVVVBK.",
  ".KBBBBBBBBK.",
  "..KKKKKKKK..",
  ".KDBBBBBBDK.",
  "KDKBLLLLBKDK",
  "KK.BBBBBB.KK",
  "...KK..KK...",
  "...KK..KK..."
], at = ["..KKKK..", ".KYYYYK.", "KYYWYYOK", "KYYWYYOK", "KYYWYYOK", "KYYYYYOK", ".KOOOOK.", "..KKKK.."], Ee = [".RR.RR.", "RWRRRRR", "RRRRRRR", ".RRRRR.", "..RRR..", "...R..."], yn = ["...Y...", "...Y...", "YYYYYYY", ".YYYYY.", "..YYY..", ".YY.YY.", "Y.....Y"], Ct = [".....WWWW.......", "...WWWWWWWW.....", ".WWWWWWWWWWWWW..", "WWWWWWWWWWWWWWWW", ".MMMMMMMMMMMMMM."], Et = ["..WWWW..", ".WWWWMW.", "WWWWWWWW", "WWMWWWWW", "WWWWWWMW", "WWWWWWWW", ".WWMWWW.", "..WWWW.."];
function se({ art: t, scale: n = 4, colors: a, title: r, className: i, style: l }) {
  const s = { ...Lt, ...a }, d = de(() => {
    const p = [];
    return t.forEach((f, W) => {
      for (let C = 0; C < f.length; ) {
        const k = f[C];
        if (k === ".") {
          C++;
          continue;
        }
        let N = C;
        for (; f[N] === k; ) N++;
        p.push(/* @__PURE__ */ e("rect", { x: C, y: W, width: N - C, height: 1, fill: s[k] ?? k }, `${C}-${W}`)), C = N;
      }
    }), p;
  }, [t, a]), m = Math.max(...t.map((p) => p.length)), u = t.length;
  return /* @__PURE__ */ e(
    "svg",
    {
      className: F("ui-sprite", i),
      style: l,
      width: m * n,
      height: u * n,
      viewBox: `0 0 ${m} ${u}`,
      shapeRendering: "crispEdges",
      role: r ? "img" : void 0,
      "aria-label": r,
      "aria-hidden": r ? void 0 : !0,
      children: d
    }
  );
}
const rt = $e(null), it = () => xe(rt), Kt = [[100, "First 100 coins"], [300, "Button masher"], [600, "Speed runner"], [1e3, "Hackathon legend"]], qe = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"], ue = 200;
function At(t) {
  const n = Z(null);
  return we((a) => {
    if (t)
      try {
        n.current ?? (n.current = new AudioContext());
        const r = n.current, i = r.currentTime;
        a.forEach((l, s) => {
          const d = r.createOscillator(), m = r.createGain();
          d.type = "square", d.frequency.value = l, m.gain.setValueAtTime(0.06, i + s * 0.07), m.gain.exponentialRampToValueAtTime(1e-4, i + s * 0.07 + 0.09), d.connect(m).connect(r.destination), d.start(i + s * 0.07), d.stop(i + s * 0.07 + 0.1);
        });
      } catch {
      }
  }, [t]);
}
const je = (t, n) => {
  try {
    return localStorage.getItem(t) ?? n;
  } catch {
    return n;
  }
}, Ue = (t, n) => {
  try {
    localStorage.setItem(t, n);
  } catch {
  }
};
function gn({ enabled: t, children: n }) {
  const a = xt(), r = ye(), [i, l] = I(() => Number(je("ui-px-score", "0")) || 0), [s, d] = I(() => je("ui-px-sound", "off") === "on"), [m, u] = I([]), p = At(s), f = Z(i), W = we((k, N) => {
    const w = f.current, T = w + k;
    if (f.current = T, l(T), Ue("ui-px-score", String(T)), p(k >= 50 ? [988, 1319] : [1319]), N && !r) {
      const g = Date.now() + Math.random();
      u((o) => [...o.slice(-12), { id: g, x: N.x, y: N.y, text: `+${k}` }]), setTimeout(() => u((o) => o.filter((v) => v.id !== g)), 900);
    }
    Kt.forEach(([g, o]) => {
      w < g && T >= g && (a({ title: "ACHIEVEMENT UNLOCKED", desc: o, tone: "success" }), p([659, 784, 1047, 1319]));
    }), Math.floor(T / ue) > Math.floor(w / ue) && a({ title: `LEVEL UP! LV ${Math.floor(T / ue) + 1}`, tone: "warn" });
  }, [p, r, a]);
  ee(() => {
    if (!t) return;
    const k = (T) => {
      const g = T.target;
      !(g != null && g.closest) || g.closest("[data-coin]") || g.closest(".ui button, .ui a, .ui [role=button], .ui-portal button") && W(10, { x: T.clientX, y: T.clientY });
    };
    let N = [];
    const w = (T) => {
      N = [...N, T.key].slice(-qe.length), N.join() === qe.join() && (N = [], a({ title: "CHEAT CODE ACCEPTED", desc: "+999 coins", tone: "warn" }), W(999));
    };
    return document.addEventListener("click", k, !0), window.addEventListener("keydown", w), () => {
      document.removeEventListener("click", k, !0), window.removeEventListener("keydown", w);
    };
  }, [t, W, a]);
  const C = de(() => ({
    score: i,
    level: Math.floor(i / ue) + 1,
    xp: i % ue / ue,
    sound: s,
    setSound: (k) => {
      d(k), Ue("ui-px-sound", k ? "on" : "off");
    },
    add: W
  }), [i, s, W]);
  return /* @__PURE__ */ h(rt.Provider, { value: C, children: [
    n,
    t && m.map((k) => /* @__PURE__ */ e("span", { className: "ui-px-pop", style: { left: k.x, top: k.y }, "aria-hidden": !0, children: k.text }, k.id))
  ] });
}
function bn() {
  const t = it();
  return t ? /* @__PURE__ */ h("div", { className: "ui-px-hud", role: "status", "aria-label": `Score ${t.score}, level ${t.level}`, children: [
    /* @__PURE__ */ h("span", { className: "ui-px-hud-coin", children: [
      /* @__PURE__ */ e(se, { art: at, scale: 2 }),
      " ",
      String(t.score).padStart(6, "0")
    ] }),
    /* @__PURE__ */ h("span", { children: [
      "LV ",
      t.level
    ] }),
    /* @__PURE__ */ e("span", { className: "ui-px-xp", "aria-hidden": !0, children: /* @__PURE__ */ e("i", { style: { width: `${t.xp * 100}%` } }) }),
    /* @__PURE__ */ h("span", { className: "ui-px-hearts", "aria-hidden": !0, children: [
      /* @__PURE__ */ e(se, { art: Ee, scale: 2 }),
      /* @__PURE__ */ e(se, { art: Ee, scale: 2 }),
      /* @__PURE__ */ e(se, { art: Ee, scale: 2 })
    ] }),
    /* @__PURE__ */ e("button", { type: "button", "data-coin": "self", className: "ui-px-sound", "aria-pressed": t.sound, onClick: () => t.setSound(!t.sound), children: t.sound ? "♪ ON" : "♪ OFF" })
  ] }) : null;
}
function St() {
  const t = it(), [n, a] = I(0), [r, i] = I([]), l = (s, d) => {
    r.includes(s) || (i((m) => [...m, s]), t == null || t.add(50, { x: d.clientX, y: d.clientY }), setTimeout(() => i((m) => m.filter((u) => u !== s)), 2400));
  };
  return /* @__PURE__ */ h("div", { className: "ui-px-scene", children: [
    /* @__PURE__ */ e("div", { className: "ui-px-coins", children: [0, 1, 2].map((s) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        "data-coin": "self",
        className: F("ui-px-coin", r.includes(s) && "is-taken"),
        style: { animationDelay: `${s * 0.25}s` },
        "aria-label": "Collect coin",
        onClick: (d) => l(s, d),
        children: /* @__PURE__ */ e(se, { art: at, scale: 5 })
      },
      s
    )) }),
    /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        "data-coin": "self",
        className: F("ui-px-hero", n > 0 && "is-jump"),
        "aria-label": "Make the robot jump",
        onClick: (s) => {
          a((d) => d + 1), t == null || t.add(10, { x: s.clientX, y: s.clientY });
        },
        children: /* @__PURE__ */ e(se, { art: nt, scale: 9 })
      },
      n
    ),
    /* @__PURE__ */ e("div", { className: "ui-px-platform" }),
    /* @__PURE__ */ e("div", { className: "ui-px-press", children: "PRESS START" })
  ] });
}
function Rt(t, n, a, r) {
  return Array.from({ length: t }, (i, l) => {
    const s = l / t * Math.PI * 2, d = Math.sin(s * 2 + r) * 0.5 + Math.sin(s * 5 + r * 2) * 0.3 + Math.sin(s * 11 + r * 3) * 0.2;
    return Math.round(n + d * a);
  });
}
function Xe({ cols: t, base: n, amp: a, seed: r, color: i, cap: l }) {
  const s = de(() => Rt(t, n, a, r), [t, n, a, r]), d = n + a + 4, m = /* @__PURE__ */ h("svg", { viewBox: `0 0 ${t} ${d}`, preserveAspectRatio: "none", shapeRendering: "crispEdges", children: [
    s.map((u, p) => /* @__PURE__ */ e("rect", { x: p, y: d - u, width: 1.02, height: u, fill: i }, p)),
    l && s.map((u, p) => u > n + a * 0.55 && /* @__PURE__ */ e("rect", { x: p, y: d - u, width: 1.02, height: 2, fill: l }, `c${p}`))
  ] });
  return /* @__PURE__ */ h("div", { className: "ui-px-mtn-track", children: [
    m,
    m
  ] });
}
const Bt = Array.from({ length: 90 }, (t, n) => [n * 137.5 % 100, n * 61.8 * 1.7 % 62, n % 3]);
function Tt() {
  const t = (n) => Bt.filter((a) => a[2] === n).map(([a, r]) => `${a}vw ${r}vh 0 0 #f4f4f4`).join(",");
  return /* @__PURE__ */ h("div", { className: "ui-bg ui-bg-pixel", "aria-hidden": !0, children: [
    /* @__PURE__ */ e("div", { className: "ui-px-stars", style: { boxShadow: t(0) } }),
    /* @__PURE__ */ e("div", { className: "ui-px-stars is-2", style: { boxShadow: t(1) } }),
    /* @__PURE__ */ e("div", { className: "ui-px-stars is-3", style: { boxShadow: t(2) } }),
    /* @__PURE__ */ e(se, { art: Et, scale: 8, className: "ui-px-moon" }),
    [0, 1, 2].map((n) => /* @__PURE__ */ e(se, { art: Ct, scale: 6, className: `ui-px-cloud c${n}` }, n)),
    /* @__PURE__ */ e("div", { className: "ui-px-mtn far", children: /* @__PURE__ */ e(Xe, { cols: 160, base: 26, amp: 18, seed: 1.3, color: "#29366f", cap: "#566c86" }) }),
    /* @__PURE__ */ e("div", { className: "ui-px-mtn near", children: /* @__PURE__ */ e(Xe, { cols: 120, base: 14, amp: 10, seed: 4.1, color: "#1f2640" }) }),
    /* @__PURE__ */ e("div", { className: "ui-px-ground" })
  ] });
}
const Se = ({ size: t = 160 }) => /* @__PURE__ */ h("div", { className: "ui-cube", style: { "--s": `${t}px` }, children: [
  /* @__PURE__ */ e("i", {}),
  /* @__PURE__ */ e("i", {}),
  /* @__PURE__ */ e("i", {}),
  /* @__PURE__ */ e("i", {}),
  /* @__PURE__ */ e("i", {}),
  /* @__PURE__ */ e("i", {})
] }), Dt = () => /* @__PURE__ */ h("div", { className: "ui-orb", "aria-hidden": !0, children: [
  /* @__PURE__ */ e("div", { className: "ui-orb-ring" }),
  /* @__PURE__ */ e("div", { className: "ui-orb-orbit" }),
  /* @__PURE__ */ e("div", { className: "ui-orb-orbit is-2" }),
  /* @__PURE__ */ e("div", { className: "ui-orb-core" })
] });
function Pt() {
  const t = Qe(22);
  return /* @__PURE__ */ h("div", { className: "ui-hero3d", ref: t, "aria-hidden": !0, children: [
    /* @__PURE__ */ e("div", { className: "ui-hero3d-tilt", children: /* @__PURE__ */ h("div", { className: "ui-hero3d-float", children: [
      /* @__PURE__ */ e("div", { className: "ui-ring" }),
      /* @__PURE__ */ e("div", { className: "ui-ring is-2" }),
      /* @__PURE__ */ e(Se, { size: 150 })
    ] }) }),
    /* @__PURE__ */ e("div", { className: "ui-hero3d-shadow" })
  ] });
}
const Mn = () => {
  const t = ie();
  return t === "pixel" ? /* @__PURE__ */ e("span", { className: "ui-logo is-pixel", children: /* @__PURE__ */ e(se, { art: nt, scale: 2 }) }) : t === "depth" ? /* @__PURE__ */ e("span", { className: "ui-logo is-3d", children: /* @__PURE__ */ e(Se, { size: 20 }) }) : /* @__PURE__ */ e("span", { className: "ui-logo", children: /* @__PURE__ */ e(_.sparkle, {}) });
}, zt = [
  [8, 18, 0, 14],
  [22, 62, 1.2, 10],
  [38, 12, 2.1, 12],
  [55, 78, 0.6, 16],
  [70, 28, 1.8, 11],
  [86, 54, 0.3, 14],
  [92, 14, 2.6, 9],
  [14, 88, 1.5, 12],
  [64, 46, 3.1, 8],
  [46, 34, 2.4, 10]
], Yt = [
  { x: "6%", y: "22%", s: 46 },
  { x: "88%", y: "16%", s: 34 },
  { x: "78%", y: "68%", s: 54 },
  { x: "14%", y: "74%", s: 30 },
  { x: "50%", y: "88%", s: 24 }
];
function Nn() {
  const t = ie();
  return t === "pixel" ? /* @__PURE__ */ e(Tt, {}) : t === "depth" ? /* @__PURE__ */ h("div", { className: "ui-bg ui-bg-depth", "aria-hidden": !0, children: [
    /* @__PURE__ */ e("div", { className: "ui-stars" }),
    /* @__PURE__ */ e("div", { className: "ui-floor-wrap", children: /* @__PURE__ */ e("div", { className: "ui-floor" }) }),
    Yt.map((n, a) => /* @__PURE__ */ e("div", { className: "ui-floater", style: { left: n.x, top: n.y, animationDelay: `${-a * 1.7}s` }, children: /* @__PURE__ */ e(Se, { size: n.s }) }, a))
  ] }) : /* @__PURE__ */ h("div", { className: "ui-bg ui-bg-dreamy", "aria-hidden": !0, children: [
    /* @__PURE__ */ e("i", { className: "ui-blob b1" }),
    /* @__PURE__ */ e("i", { className: "ui-blob b2" }),
    /* @__PURE__ */ e("i", { className: "ui-blob b3" }),
    /* @__PURE__ */ e("i", { className: "ui-blob b4" }),
    /* @__PURE__ */ e("div", { className: "ui-sparkles", children: zt.map(([n, a, r, i], l) => /* @__PURE__ */ e("span", { style: { left: `${n}%`, top: `${a}%`, animationDelay: `${r}s`, fontSize: i }, children: "✦" }, l)) }),
    /* @__PURE__ */ e("div", { className: "ui-grain" })
  ] });
}
function wn({ eyebrow: t, title: n, subtitle: a, actions: r, visual: i }) {
  const l = ie();
  return /* @__PURE__ */ h("section", { className: "ui-hero", children: [
    /* @__PURE__ */ h("div", { className: "ui-hero-copy", children: [
      t && /* @__PURE__ */ e("div", { children: t }),
      /* @__PURE__ */ e("h1", { children: n }),
      a && /* @__PURE__ */ e("p", { children: a }),
      r && /* @__PURE__ */ e("div", { className: "ui-hero-actions", children: r })
    ] }),
    /* @__PURE__ */ e("div", { className: "ui-hero-visual", children: i ?? (l === "depth" ? /* @__PURE__ */ e(Pt, {}) : l === "pixel" ? /* @__PURE__ */ e(St, {}) : /* @__PURE__ */ e(Dt, {})) })
  ] });
}
function $n({ id: t, kicker: n, title: a, desc: r, code: i, children: l }) {
  return /* @__PURE__ */ h("section", { id: t, className: "ui-section", children: [
    /* @__PURE__ */ e(He, { children: /* @__PURE__ */ h("div", { className: "ui-section-head", children: [
      n && /* @__PURE__ */ e("div", { className: "ui-kicker", children: n }),
      /* @__PURE__ */ e("h2", { children: a }),
      r && /* @__PURE__ */ e("p", { children: r }),
      i && /* @__PURE__ */ e("code", { className: "ui-code", children: i })
    ] }) }),
    /* @__PURE__ */ e(He, { delay: 120, children: l })
  ] });
}
function kn({ items: t, speed: n = 28 }) {
  return /* @__PURE__ */ e("div", { className: "ui-marquee", children: /* @__PURE__ */ e("div", { className: "ui-marquee-track", style: { animationDuration: `${n}s` }, children: [...t, ...t].map((a, r) => /* @__PURE__ */ e("span", { className: "ui-marquee-item", "aria-hidden": r >= t.length, children: a }, r)) }) });
}
const Wn = ({ children: t }) => /* @__PURE__ */ e("footer", { className: "ui-footer", children: t }), ae = (t) => `var(--s${t % 4 + 1})`, me = (t) => new Intl.NumberFormat(void 0, { notation: "compact", maximumFractionDigits: 1 }).format(t);
function pe() {
  const [t, n] = Ae(), [a, r] = I(0);
  return Ze(() => {
    const i = t.current;
    if (!i) return;
    r(i.clientWidth);
    const l = new ResizeObserver(([s]) => r(s.contentRect.width));
    return l.observe(i), () => l.disconnect();
  }, [t]), { ref: t, inView: n, w: a };
}
function ke(t, n = 700) {
  const a = ye(), [r, i] = I(t), l = Z(t), s = t.join(",");
  return ee(() => {
    if (a) {
      l.current = t, i(t);
      return;
    }
    const d = l.current, m = performance.now();
    let u = 0;
    const p = (f) => {
      const W = Math.min(1, (f - m) / n), C = 1 - Math.pow(1 - W, 3), k = t.map((N, w) => (d[w] ?? 0) + (N - (d[w] ?? 0)) * C);
      l.current = k, i(k), W < 1 && (u = requestAnimationFrame(p));
    };
    return u = requestAnimationFrame(p), () => cancelAnimationFrame(u);
  }, [s, a, n]), r;
}
function ve(t, n, a = 4) {
  n === t && (n = t + 1);
  const r = (n - t) / a, i = 10 ** Math.floor(Math.log10(r)), l = r / i, s = (l < 1.5 ? 1 : l < 3 ? 2 : l < 7 ? 5 : 10) * i, d = Math.floor(t / s) * s, m = Math.ceil(n / s) * s, u = [];
  for (let p = d; p <= m + s / 2; p += s) u.push(+p.toFixed(10));
  return u;
}
function st(t, n, a, r, i = 4) {
  return r <= 0 || a <= 0 ? "" : (i = Math.min(i, a / 2, r), `M${t},${n + r}V${n + i}Q${t},${n} ${t + i},${n}H${t + a - i}Q${t + a},${n} ${t + a},${n + i}V${n + r}Z`);
}
function Vt(t) {
  return t.map(([n, a], r) => r ? `H${(t[r - 1][0] + n) / 2}V${a}H${n}` : `M${n},${a}`).join("");
}
function It(t) {
  return t.map(([n, a], r) => {
    if (!r) return `M${n},${a}`;
    const [i, l] = t[r - 1], s = (n - i) / 2;
    return `C${i + s},${l} ${n - s},${a} ${n},${a}`;
  }).join("");
}
function Ot(t, n, a, r) {
  const i = t.map((d, m) => ({ y: d, i: m })).sort((d, m) => d.y - m.y);
  for (let d = 1; d < i.length; d++) i[d].y = Math.max(i[d].y, i[d - 1].y + n);
  const l = i.length ? i[i.length - 1].y - r : 0;
  l > 0 && i.forEach((d) => d.y = Math.max(a, d.y - l));
  const s = [...t];
  return i.forEach((d) => s[d.i] = d.y), s;
}
function ge({ tip: t, width: n }) {
  if (!t) return null;
  const a = Math.max(80, Math.min(n - 80, t.x));
  return /* @__PURE__ */ h("div", { className: "ui-ctip", style: { left: a, top: t.y }, role: "status", children: [
    /* @__PURE__ */ e("div", { className: "ui-ctip-title", children: t.title }),
    t.rows.map((r, i) => /* @__PURE__ */ h("div", { className: "ui-ctip-row", children: [
      r.color && /* @__PURE__ */ e("i", { style: { background: r.color } }),
      /* @__PURE__ */ e("span", { children: r.label }),
      /* @__PURE__ */ e("b", { children: r.value })
    ] }, i))
  ] });
}
function We({ ticks: t, y: n, x0: a, x1: r, format: i }) {
  return /* @__PURE__ */ e("g", { className: "ui-axis", children: t.map((l) => /* @__PURE__ */ h("g", { children: [
    /* @__PURE__ */ e("line", { x1: a, x2: r, y1: n(l), y2: n(l), className: l === 0 ? "is-base" : void 0 }),
    /* @__PURE__ */ e("text", { x: a - 8, y: n(l), dy: "0.32em", textAnchor: "end", children: i(l) })
  ] }, l)) });
}
function lt({ labels: t, x: n, y: a, width: r }) {
  const i = Math.max(1, Math.ceil(t.length / Math.max(1, r / 64)));
  return /* @__PURE__ */ e("g", { className: "ui-axis", children: t.map((l, s) => (s % i === 0 || s === t.length - 1) && /* @__PURE__ */ e("text", { x: n(s), y: a, textAnchor: "middle", children: l }, s)) });
}
function Ht({ items: t }) {
  return /* @__PURE__ */ e("div", { className: "ui-legend", children: t.map((n) => {
    const a = /* @__PURE__ */ h(he, { children: [
      /* @__PURE__ */ e(Re, { color: n.color, shape: n.shape }),
      n.name
    ] });
    return n.onToggle ? /* @__PURE__ */ e("button", { type: "button", className: F("ui-legend-item", n.active === !1 && "is-off"), "aria-pressed": n.active !== !1, onClick: n.onToggle, children: a }, n.name) : /* @__PURE__ */ e("span", { className: "ui-legend-item", children: a }, n.name);
  }) });
}
function Re({ color: t, shape: n = 0, size: a = 10 }) {
  const r = a / 2;
  return /* @__PURE__ */ e("svg", { width: a, height: a, viewBox: `0 0 ${a} ${a}`, "aria-hidden": "true", className: "ui-swatch", children: n === 1 ? /* @__PURE__ */ e("rect", { x: 0.5, y: 0.5, width: a - 1, height: a - 1, rx: 2, fill: t }) : n === 2 ? /* @__PURE__ */ e("path", { d: `M${r},0L${a},${r}L${r},${a}L0,${r}Z`, fill: t }) : n === 3 ? /* @__PURE__ */ e("path", { d: `M${r},0.5L${a - 0.5},${a - 0.5}H0.5Z`, fill: t }) : /* @__PURE__ */ e("circle", { cx: r, cy: r, r, fill: t }) });
}
function Ln({ title: t, subtitle: n, legend: a, table: r, actions: i, children: l }) {
  const [s, d] = I(!1);
  return /* @__PURE__ */ h(tt, { tilt: !1, className: "ui-chart-card", children: [
    /* @__PURE__ */ h("div", { className: "ui-chart-head", children: [
      /* @__PURE__ */ h("div", { children: [
        /* @__PURE__ */ e("h3", { children: t }),
        n && /* @__PURE__ */ e("p", { children: n })
      ] }),
      /* @__PURE__ */ h("div", { className: "ui-row", children: [
        i,
        r && /* @__PURE__ */ e("button", { type: "button", className: "ui-chip", "aria-pressed": s, onClick: () => d(!s), children: s ? "Chart" : "Table" })
      ] })
    ] }),
    a && a.length > 1 && /* @__PURE__ */ e(Ht, { items: a }),
    s && r ? /* @__PURE__ */ e("div", { className: "ui-table-wrap", children: /* @__PURE__ */ h("table", { className: "ui-table", children: [
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ e("tr", { children: r.columns.map((m) => /* @__PURE__ */ e("th", { children: m }, m)) }) }),
      /* @__PURE__ */ e("tbody", { children: r.rows.map((m, u) => /* @__PURE__ */ e("tr", { children: m.map((p, f) => /* @__PURE__ */ e("td", { children: typeof p == "number" ? p.toLocaleString() : p }, f)) }, u)) })
    ] }) }) : l
  ] });
}
function Cn({ labels: t, series: n, height: a = 260, area: r = !0, hidden: i = [], format: l = me }) {
  const { ref: s, inView: d, w: m } = pe(), u = ie() === "pixel", [p, f] = I(null), W = t.length, C = n.flatMap((c) => c.values), k = ke(d ? C : C.map(() => 0)), N = n.map((c, z) => ({ ...c, i: z, v: k.slice(z * W, (z + 1) * W) })).filter((c) => !i.includes(c.name)), w = ve(0, Math.max(1, ...N.flatMap((c) => c.values))), T = w[w.length - 1], g = { l: 44, r: N.length > 1 ? 92 : 18, t: 14, b: 28 }, o = Math.max(10, m - g.l - g.r), v = a - g.t - g.b, $ = (c) => g.l + (W <= 1 ? o / 2 : c * o / (W - 1)), A = (c) => g.t + v - c / T * v, S = Ot(N.map((c) => A(c.v[W - 1] ?? 0)), 16, g.t, g.t + v), P = (c) => {
    const z = c.currentTarget.getBoundingClientRect(), K = Math.round((c.clientX - z.left - g.l) / o * (W - 1));
    f(K >= 0 && K < W ? K : null);
  }, M = p === null || !N.length ? null : {
    x: $(p),
    y: Math.min(...N.map((c) => A(c.v[p]))) - 10,
    title: t[p],
    rows: [...N].sort((c, z) => z.values[p] - c.values[p]).map((c) => ({ color: ae(c.i), label: c.name, value: l(c.values[p]) }))
  };
  return /* @__PURE__ */ h("div", { className: "ui-chart", ref: s, style: { height: a }, children: [
    m > 0 && /* @__PURE__ */ h(
      "svg",
      {
        width: m,
        height: a,
        onPointerMove: P,
        onPointerLeave: () => f(null),
        role: "img",
        "aria-label": `Line chart: ${N.map((c) => c.name).join(", ")}`,
        children: [
          /* @__PURE__ */ e(We, { ticks: w, y: A, x0: g.l, x1: g.l + o, format: l }),
          /* @__PURE__ */ e(lt, { labels: t, x: $, y: a - 8, width: o }),
          N.map((c) => {
            const z = c.v.map((ne, j) => [$(j), A(ne)]), K = u ? Vt(z) : It(z);
            return /* @__PURE__ */ h("g", { style: { color: ae(c.i) }, children: [
              r && /* @__PURE__ */ e("path", { d: `${K}L${$(W - 1)},${A(0)}L${$(0)},${A(0)}Z`, className: "ui-chart-area" }),
              /* @__PURE__ */ e("path", { d: K, className: "ui-chart-line" })
            ] }, c.name);
          }),
          N.length > 1 && N.map((c, z) => /* @__PURE__ */ h("g", { className: "ui-chart-endlabel", transform: `translate(${g.l + o + 10},${S[z]})`, children: [
            /* @__PURE__ */ e("circle", { r: 4, fill: ae(c.i) }),
            /* @__PURE__ */ e("text", { x: 9, dy: "0.32em", children: c.name })
          ] }, c.name)),
          p !== null && /* @__PURE__ */ h("g", { children: [
            /* @__PURE__ */ e("line", { className: "ui-crosshair", x1: $(p), x2: $(p), y1: g.t, y2: g.t + v }),
            N.map((c) => /* @__PURE__ */ e("circle", { cx: $(p), cy: A(c.v[p]), r: 4.5, fill: ae(c.i), className: "ui-mark-ring" }, c.name))
          ] })
        ]
      }
    ),
    /* @__PURE__ */ e(ge, { tip: M, width: m })
  ] });
}
function En({ labels: t, series: n, height: a = 260, format: r = me }) {
  const { ref: i, inView: l, w: s } = pe(), d = ie(), m = d === "depth", u = d === "pixel" ? 0 : 4, [p, f] = I(null), W = t.length, C = n.length, k = n.flatMap((j) => j.values), N = ke(l ? k : k.map(() => 0), 900), w = ve(0, Math.max(1, ...k)), T = w[w.length - 1], g = { l: 44, r: 12, t: 18, b: 28 }, o = Math.max(10, s - g.l - g.r), v = a - g.t - g.b, $ = o / W, A = $ * 0.26, S = 2, P = Math.max(2, ($ - A - S * (C - 1)) / C), M = (j) => g.t + v - j / T * v, c = (j, q) => g.l + j * $ + A / 2 + q * (P + S), z = k.indexOf(Math.max(...k)), K = m ? Math.min(7, P * 0.4) : 0, ne = p && {
    x: c(p[0], p[1]) + P / 2,
    y: M(n[p[1]].values[p[0]]) - 10,
    title: t[p[0]],
    rows: [{ color: ae(p[1]), label: n[p[1]].name, value: r(n[p[1]].values[p[0]]) }]
  };
  return /* @__PURE__ */ h("div", { className: "ui-chart", ref: i, style: { height: a }, children: [
    s > 0 && /* @__PURE__ */ h("svg", { width: s, height: a, role: "img", "aria-label": `Bar chart: ${n.map((j) => j.name).join(", ")}`, onPointerLeave: () => f(null), children: [
      /* @__PURE__ */ e(We, { ticks: w, y: M, x0: g.l, x1: g.l + o, format: r }),
      /* @__PURE__ */ e(lt, { labels: t, x: (j) => g.l + j * $ + $ / 2, y: a - 8, width: o }),
      t.map((j, q) => n.map((Q, te) => {
        const ce = N[te * W + q], re = M(ce), fe = g.t + v - re, oe = c(q, te), Le = !p || p[0] === q && p[1] === te;
        return /* @__PURE__ */ h(
          "g",
          {
            style: { color: ae(te), opacity: Le ? 1 : 0.45 },
            className: "ui-bar",
            onPointerEnter: () => f([q, te]),
            children: [
              /* @__PURE__ */ e("rect", { x: g.l + q * $, y: g.t, width: $, height: v, fill: "transparent" }),
              K > 0 && fe > 1 && /* @__PURE__ */ h(he, { children: [
                /* @__PURE__ */ e("path", { d: `M${oe + P},${re + 2}l${K},${-K}V${g.t + v - K}l${-K},${K}Z`, fill: "currentColor", className: "ui-bar-side" }),
                /* @__PURE__ */ e("path", { d: `M${oe + 2},${re}l${K},${-K}H${oe + P + K}l${-K},${K}Z`, fill: "currentColor", className: "ui-bar-top" })
              ] }),
              /* @__PURE__ */ e("path", { d: st(oe, re, P, fe, u), fill: "currentColor" }),
              te * W + q === z && ce > 0 && /* @__PURE__ */ e("text", { className: "ui-bar-label", x: oe + P / 2, y: re - 6 - K, textAnchor: "middle", children: r(n[te].values[q]) })
            ]
          },
          `${q}-${te}`
        );
      }))
    ] }),
    /* @__PURE__ */ e(ge, { tip: ne, width: s })
  ] });
}
function Ge(t, n, a, r, i, l) {
  const s = (m, u) => `${t + m * Math.sin(u)},${n - m * Math.cos(u)}`, d = l - i > Math.PI ? 1 : 0;
  return `M${s(r, i)}A${r},${r} 0 ${d} 1 ${s(r, l)}L${s(a, l)}A${a},${a} 0 ${d} 0 ${s(a, i)}Z`;
}
function Kn({ slices: t, size: n = 210, format: a = me, label: r = "Total" }) {
  const { ref: i, inView: l } = pe(), s = ie() === "depth", [d, m] = I(null), u = de(() => {
    const o = [...t].sort((v, $) => $.value - v.value);
    return o.length <= 4 ? o : [...o.slice(0, 4), { name: "Other", value: o.slice(4).reduce((v, $) => v + $.value, 0) }];
  }, [t]), p = u.reduce((o, v) => o + v.value, 0) || 1, [f] = ke([l ? 1 : 0], 1100), W = n / 2, C = W - 8, k = C * 0.62, N = (o) => u[o].name === "Other" && o === 4 ? "var(--s-other)" : ae(o);
  let w = 0;
  const T = u.map((o, v) => {
    const $ = w * 2 * Math.PI * f, A = (w + o.value / p) * 2 * Math.PI * f;
    return w += o.value / p, { d: o, i: v, a0: $, a1: A, mid: ($ + A) / 2 };
  }), g = d === null ? null : u[d];
  return /* @__PURE__ */ h("div", { className: "ui-donut", ref: i, children: [
    /* @__PURE__ */ h("div", { className: "ui-donut-fig", style: { width: n, height: n }, children: [
      /* @__PURE__ */ h("svg", { width: n, height: n, role: "img", "aria-label": `Donut chart: ${u.map((o) => `${o.name} ${Math.round(o.value / p * 100)}%`).join(", ")}`, children: [
        s && [6, 5, 4, 3, 2, 1].map((o) => /* @__PURE__ */ e("g", { transform: `translate(0,${o * 2})`, className: "ui-donut-ext", children: T.map((v) => v.a1 > v.a0 && /* @__PURE__ */ e("path", { d: Ge(W, W, k, C, v.a0, v.a1), fill: N(v.i) }, v.i)) }, o)),
        T.map((o) => {
          const v = d === o.i ? 7 : 0;
          return o.a1 > o.a0 && /* @__PURE__ */ e(
            "path",
            {
              d: Ge(W, W, k, C, o.a0, o.a1),
              fill: N(o.i),
              className: "ui-donut-slice",
              style: { transform: `translate(${Math.sin(o.mid) * v}px,${-Math.cos(o.mid) * v}px)`, opacity: d === null || d === o.i ? 1 : 0.5 },
              onPointerEnter: () => m(o.i),
              onPointerLeave: () => m(null)
            },
            o.i
          );
        })
      ] }),
      /* @__PURE__ */ h("div", { className: "ui-donut-center", children: [
        /* @__PURE__ */ e("b", { children: g ? `${Math.round(g.value / p * 100)}%` : a(p) }),
        /* @__PURE__ */ e("span", { children: g ? g.name : r })
      ] })
    ] }),
    /* @__PURE__ */ e("ul", { className: "ui-donut-legend", children: u.map((o, v) => /* @__PURE__ */ h("li", { className: F(d === v && "is-active"), onPointerEnter: () => m(v), onPointerLeave: () => m(null), children: [
      /* @__PURE__ */ e(Re, { color: N(v) }),
      /* @__PURE__ */ e("span", { children: o.name }),
      /* @__PURE__ */ e("b", { children: a(o.value) }),
      /* @__PURE__ */ h("em", { children: [
        Math.round(o.value / p * 100),
        "%"
      ] })
    ] }, o.name)) })
  ] });
}
function Ft(t) {
  const n = t.length;
  if (n < 3) return null;
  const a = t.reduce((m, u) => m + u.x, 0) / n, r = t.reduce((m, u) => m + u.y, 0) / n;
  let i = 0, l = 0, s = 0;
  if (t.forEach((m) => {
    i += (m.x - a) * (m.y - r), l += (m.x - a) ** 2, s += (m.y - r) ** 2;
  }), !l || !s) return null;
  const d = i / l;
  return { slope: d, intercept: r - d * a, r: i / Math.sqrt(l * s) };
}
function qt({ shape: t, x: n, y: a, r, color: i, className: l }) {
  const s = { fill: i, className: F("ui-mark-ring", l) };
  return t === 1 ? /* @__PURE__ */ e("rect", { x: n - r * 0.9, y: a - r * 0.9, width: r * 1.8, height: r * 1.8, rx: 2, ...s }) : t === 2 ? /* @__PURE__ */ e("path", { d: `M${n},${a - r * 1.2}L${n + r * 1.2},${a}L${n},${a + r * 1.2}L${n - r * 1.2},${a}Z`, ...s }) : /* @__PURE__ */ e("circle", { cx: n, cy: a, r, ...s });
}
function An({ groups: t, height: n = 280, xLabel: a, yLabel: r, trend: i = !0, formatX: l = me, formatY: s = me }) {
  const { ref: d, inView: m, w: u } = pe(), [p, f] = I(null), W = t.flatMap((M) => M.points), C = ve(Math.min(...W.map((M) => M.x)), Math.max(...W.map((M) => M.x)), 5), k = Math.min(...W.map((M) => M.y)), N = ve(k >= 0 ? 0 : k, Math.max(...W.map((M) => M.y))), w = { l: 48, r: 16, t: 14, b: 42 }, T = Math.max(10, u - w.l - w.r), g = n - w.t - w.b, o = (M) => w.l + (M - C[0]) / (C[C.length - 1] - C[0]) * T, v = (M) => w.t + g - (M - N[0]) / (N[N.length - 1] - N[0]) * g, $ = i ? Ft(W) : null, A = (M) => {
    const c = M.currentTarget.getBoundingClientRect(), z = M.clientX - c.left, K = M.clientY - c.top;
    let ne = null, j = 18 ** 2;
    t.forEach((q, Q) => q.points.forEach((te, ce) => {
      const re = (o(te.x) - z) ** 2 + (v(te.y) - K) ** 2;
      re < j && (j = re, ne = { g: Q, i: ce });
    })), f(ne);
  }, S = p && t[p.g].points[p.i], P = p && S ? {
    x: o(S.x),
    y: v(S.y) - 12,
    title: S.label ?? t[p.g].name,
    rows: [{ color: ae(p.g), label: a ?? "x", value: l(S.x) }, { label: r ?? "y", value: s(S.y) }]
  } : null;
  return /* @__PURE__ */ h("div", { className: "ui-chart", ref: d, style: { height: n }, children: [
    u > 0 && /* @__PURE__ */ h("svg", { width: u, height: n, onPointerMove: A, onPointerLeave: () => f(null), role: "img", "aria-label": `Scatter plot of ${r} vs ${a}`, children: [
      /* @__PURE__ */ e(We, { ticks: N, y: v, x0: w.l, x1: w.l + T, format: s }),
      /* @__PURE__ */ h("g", { className: "ui-axis", children: [
        C.map((M) => /* @__PURE__ */ e("text", { x: o(M), y: w.t + g + 18, textAnchor: "middle", children: l(M) }, M)),
        a && /* @__PURE__ */ e("text", { x: w.l + T / 2, y: n - 4, textAnchor: "middle", className: "ui-axis-title", children: a })
      ] }),
      $ && m && (() => {
        const M = C[0], c = C[C.length - 1];
        return /* @__PURE__ */ e("g", { className: "ui-trend", children: /* @__PURE__ */ e("line", { x1: o(M), y1: v($.intercept + $.slope * M), x2: o(c), y2: v($.intercept + $.slope * c) }) });
      })(),
      m && t.map((M, c) => M.points.map((z, K) => /* @__PURE__ */ e("g", { className: "ui-pop-mark", style: { animationDelay: `${(c * M.points.length + K) * 12}ms` }, children: /* @__PURE__ */ e(qt, { shape: c, x: o(z.x), y: v(z.y), r: (p == null ? void 0 : p.g) === c && p.i === K ? 7 : 5, color: ae(c) }) }, `${c}-${K}`)))
    ] }),
    /* @__PURE__ */ e(ge, { tip: P, width: u }),
    $ && /* @__PURE__ */ h("div", { className: "ui-chart-note", children: [
      "Trend: y ≈ ",
      $.slope.toFixed(1),
      "x + ",
      $.intercept.toFixed(0),
      " · r = ",
      $.r.toFixed(2),
      " · n = ",
      W.length
    ] })
  ] });
}
function jt(t) {
  const n = [...t].sort((s, d) => s - d), a = n.length, r = n.reduce((s, d) => s + d, 0) / a, i = Math.sqrt(n.reduce((s, d) => s + (d - r) ** 2, 0) / Math.max(1, a - 1)), l = (s) => n[Math.min(a - 1, Math.floor(s * (a - 1)))];
  return { n: a, mean: r, sd: i, median: l(0.5), p95: l(0.95), min: n[0], max: n[a - 1] };
}
function Sn({ values: t, bins: n = 18, height: a = 260, unit: r = "", format: i = (l) => l.toFixed(0) }) {
  const { ref: l, inView: s, w: d } = pe(), m = ie() === "pixel" ? 0 : 3, [u, p] = I(null), f = de(() => jt(t), [t]), W = (f.max - f.min) / n || 1, C = de(() => {
    const S = Array(n).fill(0);
    return t.forEach((P) => S[Math.min(n - 1, Math.floor((P - f.min) / W))]++), S;
  }, [t, n, f.min, W]), k = ke(s ? C : C.map(() => 0), 900), N = ve(0, Math.max(...C)), w = { l: 40, r: 12, t: 26, b: 28 }, T = Math.max(10, d - w.l - w.r), g = a - w.t - w.b, o = (S) => w.l + (S - f.min) / (f.max - f.min || 1) * T, v = (S) => w.t + g - S / N[N.length - 1] * g, $ = T / n, A = u === null ? null : {
    x: w.l + u * $ + $ / 2,
    y: v(C[u]) - 10,
    title: `${i(f.min + u * W)}–${i(f.min + (u + 1) * W)}${r}`,
    rows: [{ color: ae(0), label: "Count", value: C[u] }]
  };
  return /* @__PURE__ */ h(he, { children: [
    /* @__PURE__ */ h("div", { className: "ui-chart", ref: l, style: { height: a }, children: [
      d > 0 && /* @__PURE__ */ h("svg", { width: d, height: a, onPointerLeave: () => p(null), role: "img", "aria-label": `Histogram, mean ${i(f.mean)}${r}`, children: [
        /* @__PURE__ */ e("rect", { x: o(f.mean - f.sd), y: w.t, width: Math.max(0, o(f.mean + f.sd) - o(f.mean - f.sd)), height: g, className: "ui-sigma" }),
        /* @__PURE__ */ e(We, { ticks: N, y: v, x0: w.l, x1: w.l + T, format: (S) => String(S) }),
        /* @__PURE__ */ e("g", { className: "ui-axis", children: [0, 0.25, 0.5, 0.75, 1].map((S) => /* @__PURE__ */ h("text", { x: w.l + S * T, y: a - 8, textAnchor: "middle", children: [
          i(f.min + S * (f.max - f.min)),
          r
        ] }, S)) }),
        k.map((S, P) => /* @__PURE__ */ h("g", { style: { color: ae(0), opacity: u === null || u === P ? 1 : 0.5 }, onPointerEnter: () => p(P), children: [
          /* @__PURE__ */ e("rect", { x: w.l + P * $, y: w.t, width: $, height: g, fill: "transparent" }),
          /* @__PURE__ */ e("path", { d: st(w.l + P * $ + 1, v(S), $ - 2, w.t + g - v(S), m), fill: "currentColor" })
        ] }, P)),
        /* @__PURE__ */ h("g", { className: "ui-refline", children: [
          /* @__PURE__ */ e("line", { x1: o(f.mean), x2: o(f.mean), y1: w.t - 6, y2: w.t + g }),
          /* @__PURE__ */ e("text", { x: o(f.mean), y: w.t - 10, textAnchor: "middle", children: "mean" })
        ] }),
        /* @__PURE__ */ e("g", { className: "ui-refline is-dashed", children: /* @__PURE__ */ e("line", { x1: o(f.median), x2: o(f.median), y1: w.t, y2: w.t + g }) })
      ] }),
      /* @__PURE__ */ e(ge, { tip: A, width: d })
    ] }),
    /* @__PURE__ */ e("div", { className: "ui-stats", children: [["n", String(f.n)], ["mean", i(f.mean) + r], ["median", i(f.median) + r], ["σ", i(f.sd) + r], ["p95", i(f.p95) + r]].map(([S, P]) => /* @__PURE__ */ h("div", { children: [
      /* @__PURE__ */ e("span", { children: S }),
      /* @__PURE__ */ e("b", { children: P })
    ] }, S)) })
  ] });
}
function Rn({ rows: t, cols: n, values: a, cell: r = 26, format: i = me, colEvery: l = 1 }) {
  const { ref: s, inView: d, w: m } = pe(), [u, p] = I(null), f = a.flat(), W = Math.min(...f), C = Math.max(...f), k = (v) => Math.min(4, Math.floor((v - W) / (C - W || 1) * 5)), N = { l: 44, t: 4, b: 24 }, w = Math.max(8, (m - N.l) / n.length), T = r, g = N.t + t.length * T + N.b, o = u && {
    x: N.l + u[1] * w + w / 2,
    y: N.t + u[0] * T - 6,
    title: `${t[u[0]]} · ${n[u[1]]}`,
    rows: [{ color: `var(--q${k(a[u[0]][u[1]]) + 1})`, label: "Value", value: i(a[u[0]][u[1]]) }]
  };
  return /* @__PURE__ */ h(he, { children: [
    /* @__PURE__ */ h("div", { className: "ui-chart", ref: s, style: { height: g }, children: [
      m > 0 && /* @__PURE__ */ h("svg", { width: m, height: g, onPointerLeave: () => p(null), role: "img", "aria-label": "Heatmap", children: [
        /* @__PURE__ */ h("g", { className: "ui-axis", children: [
          t.map((v, $) => /* @__PURE__ */ e("text", { x: N.l - 8, y: N.t + $ * T + T / 2, dy: "0.32em", textAnchor: "end", children: v }, v)),
          n.map((v, $) => $ % l === 0 && /* @__PURE__ */ e("text", { x: N.l + $ * w + w / 2, y: g - 6, textAnchor: "middle", children: v }, v))
        ] }),
        d && a.map((v, $) => v.map((A, S) => /* @__PURE__ */ e(
          "rect",
          {
            x: N.l + S * w + 1,
            y: N.t + $ * T + 1,
            width: w - 2,
            height: T - 2,
            rx: 3,
            fill: `var(--q${k(A) + 1})`,
            className: F("ui-cell", u && u[0] === $ && u[1] === S && "is-active"),
            style: { animationDelay: `${($ + S) * 18}ms` },
            onPointerEnter: () => p([$, S])
          },
          `${$}-${S}`
        )))
      ] }),
      /* @__PURE__ */ e(ge, { tip: o, width: m })
    ] }),
    /* @__PURE__ */ h("div", { className: "ui-scale-legend", children: [
      /* @__PURE__ */ e("span", { children: "Low" }),
      [1, 2, 3, 4, 5].map((v) => /* @__PURE__ */ e("i", { style: { background: `var(--q${v})` } }, v)),
      /* @__PURE__ */ e("span", { children: "High" })
    ] })
  ] });
}
const Ne = 700;
function Bn({ nodes: t, edges: n, groups: a, height: r = 460, events: i = [], selected: l = null, onSelect: s }) {
  const d = ie(), m = ye(), u = d === "depth", p = d === "pixel", f = Z(null), W = Z(null), C = Z(/* @__PURE__ */ new Map()), k = Z({ zoom: 1, px: 0, py: 0, ry: 0.5, rx: -0.32, alpha: 1, fit: !0 }), N = Z([]), w = Z([]), T = Z(/* @__PURE__ */ new Set()), g = Z(null), o = Z(null), v = Z({ edges: n, selected: l, onSelect: s, depth: u, reduced: m, pixel: p });
  v.current = { edges: n, selected: l, onSelect: s, depth: u, reduced: m, pixel: p };
  const [$, A] = I("grab");
  ee(() => {
    const M = C.current, c = new Set(t.map((K) => K.id));
    [...M.keys()].forEach((K) => {
      c.has(K) || M.delete(K);
    });
    const z = /* @__PURE__ */ new Map();
    n.forEach((K) => {
      z.set(K.source, (z.get(K.source) ?? 0) + 1), z.set(K.target, (z.get(K.target) ?? 0) + 1);
    }), t.forEach((K) => {
      const ne = M.get(K.id);
      if (ne) {
        ne.node = K, ne.deg = z.get(K.id) ?? 0;
        return;
      }
      const j = n.find((te) => te.source === K.id || te.target === K.id), q = j && M.get(j.source === K.id ? j.target : j.source), Q = () => (Math.random() - 0.5) * 80;
      M.set(K.id, {
        node: K,
        deg: z.get(K.id) ?? 0,
        vx: 0,
        vy: 0,
        vz: 0,
        x: ((q == null ? void 0 : q.x) ?? 0) + Q(),
        y: ((q == null ? void 0 : q.y) ?? 0) + Q(),
        z: u ? ((q == null ? void 0 : q.z) ?? 0) + Q() : 0
      });
    }), k.current.alpha = 1;
  }, [t, n, u]), ee(() => {
    C.current.forEach((M) => {
      M.z = u ? (Math.random() - 0.5) * 160 : 0, M.vz = 0;
    }), k.current.alpha = 1;
  }, [u]), ee(() => {
    const M = performance.now();
    i.forEach((c) => {
      T.current.has(c.id) || (T.current.add(c.id), N.current.push({ a: c.source, b: c.target, t0: M }));
    }), T.current.size > 500 && (T.current = new Set(i.map((c) => c.id)));
  }, [i]), ee(() => {
    const M = W.current, c = M.getContext("2d");
    let z = 0, K = 0, ne = 0, j = !0, q = [], Q = { ink: "#000", mut: "#888", line: "#ccc", surface: "#fff", glow: "#fff", groups: [] };
    const te = () => {
      const L = getComputedStyle(M), y = (E) => L.getPropertyValue(E).trim();
      Q = { ink: y("--ink"), mut: y("--mut"), line: y("--line-strong"), surface: y("--chart-surface"), glow: y("--a2"), groups: [1, 2, 3, 4].map((E) => y(`--s${E}`)) };
    }, ce = () => {
      const L = Math.min(2, window.devicePixelRatio || 1);
      z = f.current.clientWidth, K = r, M.width = z * L, M.height = K * L, M.style.width = `${z}px`, M.style.height = `${K}px`, c.setTransform(L, 0, 0, L, 0, 0), te();
    };
    ce();
    const re = new ResizeObserver(ce);
    re.observe(f.current);
    const fe = new IntersectionObserver(([L]) => {
      j = L.isIntersecting;
    });
    fe.observe(M);
    const oe = (L) => {
      const y = k.current, E = v.current.depth;
      let x = L.x, R = L.y, Y = L.z;
      if (E) {
        const b = Math.cos(y.ry), B = Math.sin(y.ry), D = Math.cos(y.rx), V = Math.sin(y.rx), H = x * b + Y * B, U = -x * B + Y * b, O = R * D - U * V, le = R * V + U * D;
        x = H, R = O, Y = le;
      }
      const G = E ? Ne / (Ne + Y) : 1, J = (7 + Math.sqrt(L.deg) * 3) * G * y.zoom;
      return { s: L, sx: z / 2 + y.px + x * G * y.zoom, sy: K / 2 + y.py + R * G * y.zoom, zr: E ? Y : 0, r: J };
    }, Le = (L, y, E, x) => {
      const R = k.current, Y = v.current.depth, G = Y ? Ne / (Ne + x) : 1, J = (y - z / 2 - R.px) / (G * R.zoom), b = (E - K / 2 - R.py) / (G * R.zoom);
      if (!Y) {
        L.x = J, L.y = b;
        return;
      }
      const B = Math.cos(-R.rx), D = Math.sin(-R.rx), V = Math.cos(-R.ry), H = Math.sin(-R.ry), U = b * B - x * D, O = b * D + x * B;
      L.x = J * V + O * H, L.z = -J * H + O * V, L.y = U;
    }, ct = () => {
      const L = k.current, y = [...C.current.values()], E = v.current.depth;
      if (!(L.alpha < 3e-3)) {
        for (let x = 0; x < y.length; x++) for (let R = x + 1; R < y.length; R++) {
          const Y = y[x], G = y[R];
          let J = Y.x - G.x, b = Y.y - G.y, B = Y.z - G.z, D = J * J + b * b + B * B;
          D < 1 && (J = Math.random(), b = Math.random(), D = 1);
          const V = 7e3 / D * L.alpha, H = Math.sqrt(D);
          Y.vx += J / H * V, Y.vy += b / H * V, G.vx -= J / H * V, G.vy -= b / H * V, E && (Y.vz += B / H * V, G.vz -= B / H * V);
        }
        v.current.edges.forEach((x) => {
          const R = C.current.get(x.source), Y = C.current.get(x.target);
          if (!R || !Y) return;
          const G = Y.x - R.x, J = Y.y - R.y, b = Y.z - R.z, B = Math.sqrt(G * G + J * J + b * b) || 1, D = (B - 120) * 0.03 * L.alpha;
          R.vx += G / B * D, R.vy += J / B * D, Y.vx -= G / B * D, Y.vy -= J / B * D, E && (R.vz += b / B * D, Y.vz -= b / B * D);
        }), y.forEach((x) => {
          if (x.vx -= x.x * 6e-3 * L.alpha, x.vy -= x.y * 6e-3 * L.alpha, x.vz -= x.z * 6e-3 * L.alpha, x.fixed) {
            x.vx = x.vy = x.vz = 0;
            return;
          }
          x.vx *= 0.82, x.vy *= 0.82, x.vz *= 0.82, x.x += x.vx, x.y += x.vy, x.z = E ? x.z + x.vz : 0;
        }), L.alpha *= 0.992;
      }
    }, be = (L, y, E, x) => {
      c.beginPath(), v.current.pixel && (y = Math.round(y / 3) * 3, E = Math.round(E / 3) * 3, x = Math.max(6, Math.round(x / 3) * 3)), L % 4 === 1 ? c.roundRect(y - x * 0.9, E - x * 0.9, x * 1.8, x * 1.8, v.current.pixel ? 0 : x * 0.35) : L % 4 === 2 ? (c.moveTo(y, E - x * 1.2), c.lineTo(y + x * 1.2, E), c.lineTo(y, E + x * 1.2), c.lineTo(y - x * 1.2, E), c.closePath()) : L % 4 === 3 ? (c.moveTo(y, E - x * 1.15), c.lineTo(y + x * 1.1, E + x * 0.8), c.lineTo(y - x * 1.1, E + x * 0.8), c.closePath()) : c.arc(y, E, x, 0, Math.PI * 2);
    }, ot = (L) => {
      const y = v.current, E = k.current;
      if (y.depth && !y.reduced && !o.current && !g.current && (E.ry += 25e-4), ct(), E.fit && C.current.size) {
        let b = 1 / 0, B = -1 / 0, D = 1 / 0, V = -1 / 0;
        C.current.forEach((U) => {
          const O = y.depth ? Math.hypot(U.x, U.z) : 0;
          b = Math.min(b, y.depth ? -O : U.x), B = Math.max(B, y.depth ? O : U.x), D = Math.min(D, U.y), V = Math.max(V, U.y);
        });
        const H = Math.max(0.35, Math.min(1.8, Math.min((z - 120) / (B - b || 1), (K - 110) / (V - D || 1))));
        E.zoom += (H - E.zoom) * 0.08, E.px += (-((b + B) / 2) * E.zoom - E.px) * 0.08, E.py += (-((D + V) / 2) * E.zoom - E.py) * 0.08;
      }
      c.clearRect(0, 0, z, K), q = [...C.current.values()].map(oe).sort((b, B) => B.zr - b.zr);
      const x = new Map(q.map((b) => [b.s.node.id, b])), R = g.current ?? y.selected, Y = /* @__PURE__ */ new Set();
      R && y.edges.forEach((b) => {
        b.source === R && Y.add(b.target), b.target === R && Y.add(b.source);
      });
      const G = (b) => !R || b === R || Y.has(b);
      y.edges.forEach((b, B) => {
        const D = x.get(b.source), V = x.get(b.target);
        if (!D || !V) return;
        const H = R && (b.source === R || b.target === R);
        if (c.globalAlpha = R && !H ? 0.12 : H ? 0.95 : 0.45, c.strokeStyle = H ? Q.groups[D.s.node.group % 4] : Q.line, c.lineWidth = y.pixel ? H ? 3 : 2 : (H ? 2 : 1.2) * Math.sqrt(b.weight ?? 1) * Math.min(1.4, (D.r + V.r) / 18), c.setLineDash(y.pixel ? [6, 4] : []), c.beginPath(), c.moveTo(D.sx, D.sy), c.lineTo(V.sx, V.sy), c.stroke(), c.setLineDash([]), !y.reduced && (!R || H)) {
          const U = (L / 2600 * (b.weight ?? 1) + B * 0.137) % 1;
          c.globalAlpha = H ? 0.9 : 0.5, c.fillStyle = Q.groups[D.s.node.group % 4];
          const O = D.sx + (V.sx - D.sx) * U, le = D.sy + (V.sy - D.sy) * U;
          y.pixel ? c.fillRect(Math.round(O / 3) * 3 - 2, Math.round(le / 3) * 3 - 2, 4, 4) : (c.beginPath(), c.arc(O, le, 1.8 * Math.min(1.5, D.r / 9), 0, Math.PI * 2), c.fill());
        }
      }), c.globalAlpha = 1, N.current = N.current.filter((b) => {
        const B = x.get(b.a), D = x.get(b.b);
        if (!B || !D) return !1;
        const V = (L - b.t0) / (y.reduced ? 1 : 900);
        if (V >= 1)
          return w.current.push({ id: b.b, t0: L }), !1;
        const H = V < 0.5 ? 2 * V * V : 1 - (-2 * V + 2) ** 2 / 2, U = B.sx + (D.sx - B.sx) * H, O = B.sy + (D.sy - B.sy) * H;
        if (y.pixel) {
          const Ve = Math.round(U / 3) * 3, Ie = Math.round(O / 3) * 3;
          return c.fillStyle = Q.glow, c.fillRect(Ve - 6, Ie - 6, 12, 12), c.fillStyle = "#f4f4f4", c.fillRect(Ve - 3, Ie - 3, 6, 6), !0;
        }
        const le = c.createRadialGradient(U, O, 0, U, O, 12);
        return le.addColorStop(0, Q.glow), le.addColorStop(1, "transparent"), c.fillStyle = le, c.beginPath(), c.arc(U, O, 12, 0, Math.PI * 2), c.fill(), c.fillStyle = "#fff", c.beginPath(), c.arc(U, O, 2.6, 0, Math.PI * 2), c.fill(), !0;
      });
      const J = E.zoom < 0.7;
      q.forEach((b) => {
        const B = b.s.node, D = Q.groups[B.group % 4], V = B.id === R, H = B.id === y.selected;
        c.globalAlpha = G(B.id) ? 1 : 0.22;
        const U = w.current.find((O) => O.id === B.id);
        if (U) {
          const O = (L - U.t0) / 700;
          c.strokeStyle = D, c.lineWidth = 2, c.globalAlpha *= Math.max(0, 1 - O), be(B.group, b.sx, b.sy, b.r + 4 + (y.pixel ? Math.floor(O * 4) * 5 : O * 18)), c.stroke(), c.globalAlpha = G(B.id) ? 1 : 0.22;
        }
        if (c.shadowColor = D, c.shadowBlur = y.pixel ? 0 : V || H ? 22 : y.depth ? 10 : 6, y.pixel && (c.fillStyle = "rgba(0,0,0,.45)", be(B.group, b.sx + 4, b.sy + 4, b.r), c.fill()), y.depth) {
          const O = c.createRadialGradient(b.sx - b.r * 0.4, b.sy - b.r * 0.5, b.r * 0.1, b.sx, b.sy, b.r * 1.3);
          O.addColorStop(0, "#ffffff"), O.addColorStop(0.25, D), O.addColorStop(1, "#05060f"), c.fillStyle = O;
        } else c.fillStyle = D;
        if (be(B.group, b.sx, b.sy, b.r), c.fill(), c.shadowBlur = 0, c.strokeStyle = y.pixel ? H || V ? "#ffcd75" : "#0d0e18" : H ? Q.ink : Q.surface, c.lineWidth = y.pixel ? 3 : H ? 2.5 : 2, be(B.group, b.sx, b.sy, b.r), c.stroke(), !J || V || Y.has(B.id)) {
          c.font = y.pixel ? '8px "Press Start 2P", monospace' : `${V ? 600 : 500} ${Math.max(10, 12 * Math.min(1.2, b.r / 10))}px Outfit, system-ui, sans-serif`, c.textAlign = "center", c.textBaseline = "top";
          const O = Math.round(b.sy + b.r * 1.25 + 6);
          y.pixel && (c.fillStyle = "#0d0e18", c.fillText(B.label.toUpperCase(), Math.round(b.sx) + 2, O + 2)), c.fillStyle = V ? Q.ink : Q.mut, c.fillText(y.pixel ? B.label.toUpperCase() : B.label, Math.round(b.sx), O);
        }
      }), w.current = w.current.filter((b) => L - b.t0 < 700), c.globalAlpha = 1;
    }, Be = (L) => {
      j && ot(L), ne = requestAnimationFrame(Be);
    };
    ne = requestAnimationFrame(Be);
    const Te = (L, y) => {
      for (let E = q.length - 1; E >= 0; E--) {
        const x = q[E];
        if ((x.sx - L) ** 2 + (x.sy - y) ** 2 <= (x.r + 6) ** 2) return x;
      }
      return null;
    }, Ce = (L) => {
      const y = M.getBoundingClientRect();
      return [L.clientX - y.left, L.clientY - y.top];
    }, De = (L) => {
      const [y, E] = Ce(L), x = Te(y, E);
      M.setPointerCapture(L.pointerId), o.current = { node: (x == null ? void 0 : x.s) ?? null, zr: (x == null ? void 0 : x.zr) ?? 0, x: y, y: E, sx: y, sy: E, moved: !1 }, x && (x.s.fixed = !0, k.current.alpha = Math.max(k.current.alpha, 0.5)), A("grabbing");
    }, Pe = (L) => {
      const [y, E] = Ce(L), x = o.current, R = k.current;
      if (!x) {
        const Y = Te(y, E);
        g.current = (Y == null ? void 0 : Y.s.node.id) ?? null, A(Y ? "pointer" : "grab");
        return;
      }
      Math.abs(y - x.sx) + Math.abs(E - x.sy) > 4 && (x.moved = !0), x.node ? (Le(x.node, y, E, x.zr), R.alpha = Math.max(R.alpha, 0.3)) : v.current.depth && !L.shiftKey ? (R.ry += (y - x.x) * 8e-3, R.rx = Math.max(-1.2, Math.min(1.2, R.rx - (E - x.y) * 6e-3))) : (R.px += y - x.x, R.py += E - x.y, R.fit = !1), x.x = y, x.y = E;
    }, Me = () => {
      var y, E;
      const L = o.current;
      L && (L.node && (L.node.fixed = !1), L.moved || (E = (y = v.current).onSelect) == null || E.call(y, L.node ? L.node.node : null)), o.current = null, A("grab");
    }, ze = () => {
      g.current = null;
    }, Ye = (L) => {
      L.preventDefault();
      const y = k.current, [E, x] = Ce(L), R = Math.max(0.35, Math.min(2.6, y.zoom * Math.exp(-L.deltaY * 15e-4))), Y = R / y.zoom;
      y.px = E - z / 2 - (E - z / 2 - y.px) * Y, y.py = x - K / 2 - (x - K / 2 - y.py) * Y, y.zoom = R, y.fit = !1;
    };
    return M.addEventListener("pointerdown", De), M.addEventListener("pointermove", Pe), M.addEventListener("pointerup", Me), M.addEventListener("pointercancel", Me), M.addEventListener("pointerleave", ze), M.addEventListener("wheel", Ye, { passive: !1 }), () => {
      cancelAnimationFrame(ne), re.disconnect(), fe.disconnect(), M.removeEventListener("pointerdown", De), M.removeEventListener("pointermove", Pe), M.removeEventListener("pointerup", Me), M.removeEventListener("pointercancel", Me), M.removeEventListener("pointerleave", ze), M.removeEventListener("wheel", Ye);
    };
  }, [r, d]);
  const S = (M) => {
    const c = k.current;
    c.fit = !1, c.zoom = Math.max(0.35, Math.min(2.6, c.zoom * M));
  }, P = () => {
    Object.assign(k.current, { rx: -0.32, alpha: 1, fit: !0 });
  };
  return /* @__PURE__ */ h("div", { className: "ui-graph", ref: f, style: { height: r }, children: [
    /* @__PURE__ */ e(
      "canvas",
      {
        ref: W,
        style: { cursor: $, touchAction: "none" },
        role: "img",
        "aria-label": `Entity graph: ${t.length} entities, ${n.length} connections`
      }
    ),
    /* @__PURE__ */ e("div", { className: "ui-graph-legend", children: a.map((M, c) => /* @__PURE__ */ h("span", { children: [
      /* @__PURE__ */ e(Re, { color: ae(c), shape: c % 4 }),
      M
    ] }, M)) }),
    /* @__PURE__ */ h("div", { className: "ui-graph-tools", children: [
      /* @__PURE__ */ e("button", { type: "button", className: "ui-icon-btn", "aria-label": "Zoom in", onClick: () => S(1.25), children: /* @__PURE__ */ e(_.plus, {}) }),
      /* @__PURE__ */ e("button", { type: "button", className: "ui-icon-btn", "aria-label": "Zoom out", onClick: () => S(0.8), children: /* @__PURE__ */ e("svg", { viewBox: "0 0 24 24", width: "1em", height: "1em", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ e("path", { d: "M5 12h14" }) }) }),
      /* @__PURE__ */ e("button", { type: "button", className: "ui-icon-btn", "aria-label": "Reset view", onClick: P, children: /* @__PURE__ */ e(_.back, { style: { transform: "rotate(45deg)" } }) })
    ] }),
    /* @__PURE__ */ e("div", { className: "ui-graph-hint", children: p ? "DRAG · SCROLL · CLICK" : u ? "Drag nodes · drag space to orbit · shift-drag to pan · scroll to zoom" : "Drag nodes · drag space to pan · scroll to zoom · click to inspect" })
  ] });
}
export {
  vn as Accordion,
  kt as Avatar,
  hn as AvatarGroup,
  Nn as Background,
  wt as Badge,
  En as BarChart,
  Zt as Button,
  at as COIN,
  tt as Card,
  Ln as ChartCard,
  an as Chat,
  on as Checkbox,
  nn as CommandPalette,
  Se as Cube,
  Kn as DonutChart,
  Fe as Dots,
  Bn as EntityGraph,
  rn as Field,
  un as FileDrop,
  Wn as Footer,
  gn as GameLayer,
  Ee as HEART,
  Rn as Heatmap,
  wn as Hero,
  Pt as HeroScene,
  Sn as Histogram,
  _ as Icon,
  Ht as Legend,
  Cn as LineChart,
  Mn as Logo,
  kn as Marquee,
  vt as Modal,
  _e as MotionCtx,
  _t as Navbar,
  Dt as Orb,
  Tt as PixelBackground,
  bn as PixelHUD,
  St as PixelScene,
  Je as Portal,
  Jt as Progress,
  en as ProgressRing,
  nt as ROBOT,
  He as Reveal,
  yn as STAR,
  An as ScatterChart,
  Mt as SearchBar,
  $n as Section,
  ln as Select,
  Qt as Skeleton,
  dn as Slider,
  Wt as Sparkline,
  ft as Spinner,
  se as Sprite,
  pn as StatCard,
  xn as Stepper,
  Re as Swatch,
  fn as Tabs,
  sn as TextArea,
  ut as ThemeCtx,
  tn as ToastProvider,
  cn as Toggle,
  mn as Tooltip,
  F as cx,
  me as fmtCompact,
  ht as motionClass,
  mt as prefersReducedMotion,
  ae as seriesColor,
  jt as summarize,
  Oe as uid,
  pt as useCountUp,
  it as useGame,
  Ae as useInView,
  ye as useReducedMotion,
  Qe as useTilt,
  xt as useToast,
  ie as useUITheme
};
//# sourceMappingURL=index.js.map
