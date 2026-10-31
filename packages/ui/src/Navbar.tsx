import { ReactNode, useEffect, useState } from "react";
import { cx } from "./core";

export interface NavItem { label: string; href?: string; onClick?: () => void; active?: boolean }

export function Navbar({ brand, items, actions, sticky = true }: {
  brand: ReactNode; items: NavItem[]; actions?: ReactNode; sticky?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!sticky) return;
    const f = () => setScrolled(window.scrollY > 12);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, [sticky]);

  const link = (it: NavItem) => {
    const className = cx("ui-nav-link", it.active && "is-active");
    const click = () => { setOpen(false); it.onClick?.(); };
    return it.href
      ? <a key={it.label} className={className} href={it.href} onClick={click}>{it.label}</a>
      : <button key={it.label} className={className} type="button" onClick={click}>{it.label}</button>;
  };

  return (
    <header className={cx("ui-nav", sticky && "is-sticky", scrolled && "is-scrolled", open && "is-open")}>
      <div className="ui-nav-bar">
        <div className="ui-nav-brand">{brand}</div>
        <nav className="ui-nav-links">{items.map(link)}</nav>
        {actions && <div className="ui-nav-actions">{actions}</div>}
        <button type="button" className="ui-nav-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span /><span /><span />
        </button>
      </div>
      <div className="ui-nav-drawer">
        <div>
          <div className="ui-nav-sheet">
            {items.map(link)}
            {actions && <div className="ui-nav-sheet-actions">{actions}</div>}
          </div>
        </div>
      </div>
    </header>
  );
}
